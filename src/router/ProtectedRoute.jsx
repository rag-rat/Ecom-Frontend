
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsLoggedIn, selectAuthInitialized } from '../store/slices/authSlice'
import Spinner from '../components/ui/Spinner'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Prevents unauthenticated users from accessing protected pages
 * like Cart, Orders, Profile, Checkout.
 *
 * HOW IT WORKS:
 * React Router v6 uses element composition for route protection.
 * Wrap any <Route> with <ProtectedRoute> as the element:
 *   <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
 *
 * If the user is not logged in → redirect to /login
 * If the user IS logged in → render children (the actual page)
 *
 * WHY WE CHECK initialized:
 * On page refresh, App.jsx dispatches initializeAuth() which checks
 * localStorage. This takes a brief moment. Without the initialized
 * check, ProtectedRoute would see isLoggedIn=false (the initial state)
 * and redirect to /login BEFORE initializeAuth completes — even for
 * users who ARE logged in. The spinner prevents this flash redirect.
 *
 * saveLocation: we remember WHERE the user was trying to go,
 * so after login we can redirect them back there automatically.
 * This is the standard "redirect after login" UX pattern.
 */

export default function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const initialized = useSelector(selectAuthInitialized)
  const location = useLocation()

  // Still checking stored tokens — show spinner to prevent flash redirect
  if (!initialized) {
    return <Spinner fullScreen />
  }

  if (!isLoggedIn) {
    // Save the location the user was trying to reach
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}