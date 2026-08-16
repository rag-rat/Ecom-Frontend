
// import { Link } from 'react-router-dom'
// import Button from '../components/ui/Button'

// export default function NotFoundPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4">
//       <div className="text-center max-w-md">
//         <p className="text-8xl font-display font-bold text-brand-200 mb-4">404</p>
//         <h1 className="text-2xl font-display font-bold text-gray-900 mb-3">
//           Page not found
//         </h1>
//         <p className="text-gray-500 mb-8">
//           The page you're looking for doesn't exist or has been moved.
//         </p>
//         <Link to="/">
//           <Button variant="primary" size="lg">
//             Back to Home
//           </Button>
//         </Link>
//       </div>
//     </div>
//   )
// }




import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-sans font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-2xl font-sans font-semibold text-gray-900 mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
