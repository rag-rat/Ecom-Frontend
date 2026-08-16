
/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Shared Google/GitHub buttons used on BOTH Login and Register pages —
 * same visual treatment, same behavior (redirect to backend's OAuth2
 * authorization endpoint, Part 5 backend / OAuth2 addition).
 *
 * These are plain <a> tags, NOT buttons with onClick handlers —
 * OAuth2 requires a full browser navigation (not an AJAX call) so
 * Spring Security can redirect to Google/GitHub's actual login page.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092'

export default function OAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <a
        href={`${API_BASE_URL}/oauth2/authorize/google`}
        className="
          flex items-center justify-center gap-2 px-4 py-2.5
          border border-gray-200 rounded-lg text-sm font-medium text-gray-700
          hover:bg-gray-50 hover:border-gray-300 transition-colors
        "
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </a>
      
      <a
        href={`${API_BASE_URL}/oauth2/authorize/github`}
        className="
          flex items-center justify-center gap-2 px-4 py-2.5
          border border-gray-200 rounded-lg text-sm font-medium text-gray-700
          hover:bg-gray-50 hover:border-gray-300 transition-colors
        "
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4 1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.7.83.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
      </a>
    </div>
  )
}
