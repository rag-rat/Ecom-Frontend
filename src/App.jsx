import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { initializeAuth } from './store/slices/authSlice'
import AppRouter from './router/AppRouter'


// Root component → first/main component of your app.
// It defines all routes (/login, /cart, etc.).
// On startup (mount), initializeAuth() checks saved tokens (localStorage/cookies) and restores login state.
// That’s why refresh doesn’t log you out.
// Lazy loading means pages load only when needed, making initial app load faster.
// “Thin file” means App.jsx should only manage routes/layout, not actual business logic.

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // On every app load, check if we have stored tokens and restore auth state
    // This is the "stay logged in" mechanism — without it, every page
    // refresh would log the user out
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    
    <AppRouter/>
    // <h1> this is the App</h1>
  )
}

export default App