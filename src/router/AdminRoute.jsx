
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn, selectIsAdmin, selectAuthInitialized } from '../store/slices/authSlice'
import Spinner from '../components/ui/Spinner'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Double-checks BOTH authentication AND admin role.
 * Even if someone hacks the Redux state in DevTools to set isAdmin=true,
 * the backend will still reject their API calls with 403.
 * This route guard is purely a UX convenience — real security is the backend.
 *
 * Non-admin logged-in user → redirect to home (not login — they ARE logged in)
 * Not logged in → redirect to login
 * Admin → render the admin page
 */

export default function AdminRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const isAdmin = useSelector(selectIsAdmin)
  const initialized = useSelector(selectAuthInitialized)

  if (!initialized) return <Spinner fullScreen />

  if (!isLoggedIn) return <Navigate to="/login" replace />

  if (!isAdmin) return <Navigate to="/" replace />

  return children
}