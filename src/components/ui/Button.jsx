
// import { clsx } from 'clsx'

// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * A single Button component used across the entire application.
//  * Without this, every developer would write slightly different button
//  * styles — inconsistent padding, colours, hover states, loading
//  * spinners. One component = one consistent look everywhere.
//  *
//  * VARIANTS:
//  *   primary   → brand orange, main actions (Add to Cart, Place Order)
//  *   secondary → outlined, secondary actions (Cancel, Back)
//  *   danger    → red, destructive actions (Delete, Remove)
//  *   ghost     → transparent, subtle actions (Close, Skip)
//  *
//  * SIZES:
//  *   sm → compact (table actions, inline buttons)
//  *   md → default (most buttons)
//  *   lg → prominent (hero CTAs, checkout)
//  *   full → full width (mobile checkout button)
//  */


// const variants = {
//   primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 disabled:bg-brand-300',
//   secondary: 'bg-white text-brand-700 border border-brand-300 hover:bg-brand-50 focus:ring-brand-500',
//   danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
//   ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
//   saree: 'bg-saree-700 text-white hover:bg-saree-800 focus:ring-saree-500',
// }

// const sizes = {
//   sm: 'px-3 py-1.5 text-sm',
//   md: 'px-4 py-2 text-sm',
//   lg: 'px-6 py-3 text-base',
//   full: 'w-full px-6 py-3 text-base',
// }

// export default function Button({
//   children,
//   variant = 'primary',
//   size = 'md',
//   loading = false,
//   disabled = false,
//   className = '',
//   onClick,
//   type = 'button',
//   ...props
// }) {
//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled || loading}
//       className={clsx(
//         // Base styles applied to ALL buttons
//         'inline-flex items-center justify-center gap-2',
//         'rounded-lg font-medium',
//         'transition-all duration-200',
//         'focus:outline-none focus:ring-2 focus:ring-offset-2',
//         'disabled:cursor-not-allowed disabled:opacity-60',
//         // Variant and size
//         variants[variant],
//         sizes[size],
//         className
//       )}
//       {...props}
//     >
//       {loading && (
//         <svg
//           className="animate-spin h-4 w-4"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//         </svg>
//       )}
//       {children}
//     </button>
//   )
// }





import { clsx } from 'clsx'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * A single Button component used across the entire application.
 * Without this, every developer would write slightly different button
 * styles — inconsistent padding, colours, hover states, loading
 * spinners. One component = one consistent look everywhere.
 *
 * VARIANTS:
 *   primary   → solid black, main actions (Add to Cart, Place Order)
 *   secondary → outlined, secondary actions (Cancel, Back)
 *   danger    → red, destructive actions (Delete, Remove)
 *   ghost     → transparent, subtle actions (Close, Skip)
 *
 * SIZES:
 *   sm → compact (table actions, inline buttons)
 *   md → default (most buttons)
 *   lg → prominent (hero CTAs, checkout)
 *   full → full width (mobile checkout button)
 */


const variants = {
  primary: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-400 disabled:bg-gray-300',
  secondary: 'bg-white text-black border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
  saree: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  full: 'w-full px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        // Base styles applied to ALL buttons
        'inline-flex items-center justify-center gap-2',
        'rounded-full font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-75',
        // Variant and size
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
