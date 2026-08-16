
/*
===========================================================
AXIOS CENTRAL CLIENT
===========================================================

Why this file exists:
This is the single Axios instance used across the app.
All API modules import this instead of raw axios.

Benefits:
1. One place for baseURL
2. One place for headers
3. One place for interceptors
4. Easy maintenance

-----------------------------------------------------------
REQUEST INTERCEPTOR
-----------------------------------------------------------

Runs BEFORE request goes to backend.

Purpose:
Automatically attach JWT access token to every request.

Flow:
Request starts
   ↓
Read token from localStorage
   ↓
Add Authorization header
   ↓
Send request

Without this:
We would manually add token in every API call.

-----------------------------------------------------------
RESPONSE INTERCEPTOR
-----------------------------------------------------------

Runs AFTER backend sends response.

Purpose:
Handle expired access tokens automatically.

If backend returns 401:
   ↓
Call /auth/refresh with refresh token
   ↓
Get new access token
   ↓
Save new token
   ↓
Retry original failed request

This is called SILENT REFRESH.

Benefit:
User stays logged in without interruption.

-----------------------------------------------------------
TOKEN STORAGE
-----------------------------------------------------------

Current:
accessToken -> localStorage
refreshToken -> localStorage

Why:
Simple and easy.

More secure production setup:
accessToken -> memory
refreshToken -> HttpOnly cookie

Current setup is okay for most SPA projects.
===========================================================
*/



import axios from 'axios'


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092'



// Create our configured Axios instance
const axiosInstance = axios.create({

  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },

  // Timeout after 15 seconds — prevents requests hanging forever
  // if the backend is slow or unreachable
  timeout: 15000,
})




// ─────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs BEFORE every request is sent
// ─────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    /*
     * Read the access token from localStorage on every request.
     * We read it here (not at startup) so we always get the CURRENT
     * token, even after a silent refresh has updated it.
     */
    const token = localStorage.getItem('accessToken')

    if (token) {
      /*
       * Attach the token as a Bearer token in the Authorization header.
       * This is exactly what JwtAuthenticationFilter (Part 5 backend)
       * looks for: "Authorization: Bearer eyJhbGci..."
       */
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Request setup failed (rare — usually a network config issue)
    return Promise.reject(error)
  }
)




// ─────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Runs AFTER every response arrives (or fails)
// ─────────────────────────────────────────────────────────────

/*
 * isRefreshing flag prevents multiple simultaneous refresh calls.
 *
 * WHY DO WE NEED THIS?
 * Imagine the user triggers 3 API calls simultaneously (e.g. page
 * load fetching products + cart + profile). If the token is expired,
 * ALL THREE return 401 at roughly the same time. Without this flag,
 * we'd fire 3 refresh requests simultaneously — but the second and
 * third would fail because the first refresh already consumed/rotated
 * the refresh token (Part 6 backend's rotation logic).
 *
 * With the flag: only the first 401 triggers a refresh. The other two
 * wait in a queue (failedRequestsQueue) and are retried once the
 * single refresh completes.
 */

let isRefreshing = false
let failedRequestsQueue = []

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((request) => {
    if (error) {
      request.reject(error)
    } else {
      request.resolve(token)
    }
  })
  failedRequestsQueue = []
}


axiosInstance.interceptors.response.use(
  // SUCCESS path — just pass the response through unchanged
  (response) => response,

  // ERROR path — intercept 401s for silent refresh
  async (error) => {
    const originalRequest = error.config

    /*
     * We only attempt the silent refresh if ALL of these are true:
     *   1. The response status is 401 (Unauthorized — token expired)
     *   2. This is NOT already a retry (prevents infinite loops)
     *   3. This is NOT the refresh endpoint itself (if refresh fails,
     *      we logout — we don't try to refresh the refresh)
     */
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      // Mark this request so we don't retry it again
      originalRequest._retry = true

      if (isRefreshing) {
        /*
         * Another refresh is already in progress.
         * Queue THIS request to retry once that refresh completes.
         */
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject })
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosInstance(originalRequest)
        }).catch((err) => Promise.reject(err))
      }

      // Mark that a refresh is now in progress
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // No refresh token stored — user must log in again
        handleLogout()
        return Promise.reject(error)
      }

      try {
        /*
         * Call the refresh endpoint directly with plain axios (not our
         * intercepted instance) to avoid triggering this interceptor again.
         */
        const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data

        // Store the new tokens
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Update the Authorization header for future requests
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`

        // Process all queued requests that were waiting for this refresh
        processQueue(null, accessToken)

        // Retry the original request that triggered the 401
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)

      } catch (refreshError) {
        /*
         * Refresh failed — the refresh token itself has expired or been
         * revoked (e.g. after logout from another device). Force logout.
         */
        processQueue(refreshError, null)
        handleLogout()
        return Promise.reject(refreshError)

      } finally {
        isRefreshing = false
      }
    }

    /*
     * For all non-401 errors (400, 403, 404, 500 etc.),
     * extract our standard ApiResponse error format from the backend
     * and reject with a clean error object the calling code can use.
     */
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      errors: error.response?.data?.errors || [],
    })
  }
)

/*
 * handleLogout()
 * ─────────────────
 * Clear all stored auth data and redirect to login.
 * Called when the refresh token itself has expired or been revoked.
 *
 * We DON'T dispatch a Redux action here to avoid circular dependency
 * (axiosInstance → store → axiosInstance). Instead, we clear storage
 * directly and let the protected route redirect logic (Part 4) handle
 * the rest on the next render.
 */
const handleLogout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  // Redirect to login — window.location forces a full page reload
  // which clears all React state cleanly
  window.location.href = '/login'
}

export default axiosInstance