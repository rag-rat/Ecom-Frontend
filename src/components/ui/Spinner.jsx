
// import { clsx } from 'clsx'

// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * Every async operation needs a loading indicator. One consistent
//  * spinner component rather than inconsistent per-page implementations.
//  *
//  * size variants map to Tailwind's w/h scale:
//  *   sm → w-4 h-4  (inline, inside buttons)
//  *   md → w-8 h-8  (section loading)
//  *   lg → w-12 h-12 (full page loading)
//  */

// const sizes = {
//   sm: 'w-4 h-4',
//   md: 'w-8 h-8',
//   lg: 'w-12 h-12',
// }

// export default function Spinner({ size = 'md', className = '', fullScreen = false }) {
    
//   const spinner = (
//     <svg
//       className={clsx('animate-spin text-brand-600', sizes[size], className)}
//       fill="none"
//       viewBox="0 0 24 24"
//     >
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//     </svg>
//   )

//   if (fullScreen) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
//         {spinner}
//       </div>
//     )
//   }

//   return spinner
// }





import { clsx } from 'clsx'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Every async operation needs a loading indicator. One consistent
 * spinner component rather than inconsistent per-page implementations.
 *
 * size variants map to Tailwind's w/h scale:
 *   sm → w-4 h-4  (inline, inside buttons)
 *   md → w-8 h-8  (section loading)
 *   lg → w-12 h-12 (full page loading)
 */

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export default function Spinner({ size = 'md', className = '', fullScreen = false }) {
    
  const spinner = (
    <svg
      className={clsx('animate-spin text-black', sizes[size], className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}
