import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store/index'
import './index.css'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The entry point of the React application. Three providers wrap everything:
 *
 * Provider (Redux): makes the Redux store available to every component
 *   via useSelector and useDispatch — without this, no component can
 *   read from or write to the global state.
 *
 * BrowserRouter: enables React Router — without this, useNavigate,
 *   useParams, <Link>, <Route> all throw errors because they need a
 *   router context to know the current URL.
 *
 * Toaster (react-hot-toast): renders the toast notification container
 *   in a fixed overlay — placed at the ROOT so toasts from ANY
 *   component in the tree appear in the same place (top-right corner).
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#0078D4', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </>
)