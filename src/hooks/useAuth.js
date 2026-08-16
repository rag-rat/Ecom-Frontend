
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  selectUser,
  selectIsLoggedIn,
  selectIsAdmin,
  selectAuthLoading,
  selectAuthError,
  login,
  register,
  logout,
  clearError,
} from '../store/slices/authSlice'



/*
 * WHY THIS FILE EXISTS
 * --------------------
 * A custom hook that bundles all auth-related state and actions into
 * one clean import. Components use this instead of importing multiple
 * things from the slice:
 *
 * WITHOUT this hook (verbose, repetitive in every component):
 *   const user = useSelector(selectUser)
 *   const isLoggedIn = useSelector(selectIsLoggedIn)
 *   const loading = useSelector(selectAuthLoading)
 *   const dispatch = useDispatch()
 *   const navigate = useNavigate()
 *   const handleLogin = (creds) => dispatch(login(creds))
 *
 * WITH this hook (clean, one import):
 *   const { user, isLoggedIn, loading, handleLogin } = useAuth()
 */



export default function useAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUser)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const isAdmin = useSelector(selectIsAdmin)
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)


  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials))
    if (login.fulfilled.match(result)) {
      // Redirect based on role after login
      const role = result.payload.user?.role
      navigate(role === 'ADMIN' ? '/admin/dashboard' : '/')
      return true
    }
    return false
  }


  const handleRegister = async (userData) => {
    const result = await dispatch(register(userData))
    if (register.fulfilled.match(result)) {
      navigate('/')
      return true
    }
    return false
  }


  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }


  const handleClearError = () => dispatch(clearError())
  

  return {
    user,
    isLoggedIn,
    isAdmin,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    handleClearError,
  }
}