
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../api/authApi'

/*
 * ═══════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 * ═══════════════════════════════════════════════════════════════
 * Manages everything related to authentication state:
 *   - Is the user logged in?
 *   - Who is the user? (name, email, role, ID)
 *   - What are the current tokens?
 *   - Is a login/register request in progress?
 *   - Did something fail?
 *
 * ═══════════════════════════════════════════════════════════════
 * createAsyncThunk EXPLAINED
 * ═══════════════════════════════════════════════════════════════
 * createAsyncThunk is Redux Toolkit's way of handling async operations.
 * It generates THREE action types automatically:
 *
 *   login.pending   → dispatched when the API call STARTS
 *   login.fulfilled → dispatched when the API call SUCCEEDS
 *   login.rejected  → dispatched when the API call FAILS
 *
 * We handle each in extraReducers below.
 *
 * WHY NOT just call the API in the component and dispatch the result?
 * You could, but then every component that needs to login would need
 * to duplicate the loading state management, error handling, and
 * localStorage writing. A thunk centralizes this logic once.
 *
 * ═══════════════════════════════════════════════════════════════
 * TOKEN PERSISTENCE — localStorage
 * ═══════════════════════════════════════════════════════════════
 * We write tokens to localStorage on login and read them on app start
 * (initializeAuth thunk). This is what keeps users logged in across
 * page refreshes — Redux state is in memory only (lost on refresh),
 * so we persist the tokens externally and restore Redux state from them.
 * ═══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────
// ASYNC THUNKS
// ─────────────────────────────────────────────────────────────

/*
 * initializeAuth — called once on app startup (App.jsx useEffect)
 * Reads stored tokens/user from localStorage and restores auth state.
 * This is the "stay logged in after refresh" mechanism.
 */
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')

    if (!accessToken || !user) {
      return rejectWithValue('No stored auth')
    }

    try {
      // Verify the token is still valid (not expired, not blacklisted)
      // If this fails, the interceptor in axiosInstance will try to
      // refresh — if refresh also fails, it redirects to /login
      await authApi.verifyToken()
      return { user: JSON.parse(user), accessToken }
    } catch (error) {
      // Token invalid — clear storage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      return rejectWithValue('Token invalid')
    }
  }
)



/*
 * login — called by the Login page (Part 5)
 * On success: stores tokens in localStorage, returns user to Redux state.
 * On failure: returns the error message for the form to display.
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)

      /*
       * response.data has the AuthResponse shape from backend Part 6:
       * { accessToken, refreshToken, userId, firstName, lastName, email, role }
       */
      const { accessToken, refreshToken, ...userData } = response.data

      // Persist tokens
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))

      return { user: userData, accessToken }
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)



/*
 * register — called by the Register page (Part 5)
 * Same as login — backend returns tokens immediately after registration.
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData)
      const { accessToken, refreshToken, ...userInfo } = response.data

      console.log(accessToken)
      console.log(refreshToken)

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userInfo))

      return { user: userInfo, accessToken }
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)



/*
 * logout — called by Navbar or Profile page
 * Clears tokens from both localStorage AND Redux state.
 * The backend call blacklists the JWT in Redis (Part 18 backend).
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      // Call backend to blacklist the token — best effort, don't block
      // logout if the API call fails (maybe backend is down)
      await authApi.logout(refreshToken).catch(() => {})
    } finally {
      // Always clear local state regardless of backend response
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }
)



// ─────────────────────────────────────────────────────────────
// SLICE DEFINITION
// ─────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: null,           // { userId, firstName, lastName, email, role }
    accessToken: null,
    isLoggedIn: false,
    isAdmin: false,
    loading: false,       // true while login/register API call is in progress
    initialized: false,   // true after initializeAuth has run (prevents protected routes from redirecting to login before we've checked localStorage)
    error: null,
  },


  /*
   * reducers: synchronous state updates (no API calls)
   * Used for simple operations like clearing errors or updating
   * profile data after an edit.
   */
  reducers: {
    clearError: (state) => {
      state.error = null
    },

    /*
     * updateUser: called after profile edit (Part 15) to sync
     * the Redux user state with the newly saved profile data
     * without requiring a full re-login.
     */
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },

    /*
     * setCredentials: called by OAuth2 redirect handler (Part 5)
     * after the browser returns from Google/GitHub with tokens in
     * the URL. Sets auth state the same way login.fulfilled does.
     */
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload
      state.accessToken = accessToken
      state.user = user
      state.isLoggedIn = true
      state.isAdmin = user?.role === 'ADMIN'

      console.log(state)

      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      if (user) localStorage.setItem('user', JSON.stringify(user))
    },
  },


  /*
   * extraReducers: handle the async thunk lifecycle actions
   * (pending, fulfilled, rejected) for each thunk defined above.
   *
   * The builder.addCase pattern from Redux Toolkit:
   *   addCase(thunk.pending, handler)   → runs when thunk starts
   *   addCase(thunk.fulfilled, handler) → runs on success
   *   addCase(thunk.rejected, handler)  → runs on failure
   */
  extraReducers: (builder) => {

    // ── initializeAuth ──────────────────────────────────────
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isLoggedIn = true
      state.isAdmin = action.payload.user?.role === 'ADMIN'
      state.initialized = true
    })
    builder.addCase(initializeAuth.rejected, (state) => {
      // No stored auth or invalid token — start as logged out
      state.initialized = true
      state.isLoggedIn = false
    })


    // ── login ─────────────────────────────────────────────
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isLoggedIn = true
      state.isAdmin = action.payload.user?.role === 'ADMIN'
      state.error = null
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })


    // ── register ──────────────────────────────────────────
    builder.addCase(register.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isLoggedIn = true
      state.isAdmin = action.payload.user?.role === 'ADMIN'
      state.error = null
    })
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })


    // ── logout ────────────────────────────────────────────
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.accessToken = null
      state.isLoggedIn = false
      state.isAdmin = false
      state.error = null
    })
  },
})


export const { clearError, updateUser, setCredentials } = authSlice.actions


// ─────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────
/*
 * Selectors are functions that extract specific pieces of state.
 * Components use these with useSelector:
 *   const user = useSelector(selectUser)
 *   const isAdmin = useSelector(selectIsAdmin)
 *
 * WHY NAMED SELECTORS instead of inline state.auth.user everywhere?
 * If the state shape ever changes (e.g. renaming 'user' to 'profile'),
 * you fix it in ONE selector function instead of hunting through
 * every component that reads state.auth.user directly.
 */
export const selectUser = (state) => state.auth.user
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectIsAdmin = (state) => state.auth.isAdmin
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectAuthInitialized = (state) => state.auth.initialized


export default authSlice.reducer