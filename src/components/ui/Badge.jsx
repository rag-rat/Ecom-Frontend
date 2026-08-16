
import { clsx } from 'clsx'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Status badges used everywhere — order status, stock labels,
 * role indicators, verified purchase labels.
 */

const variants = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger:  'bg-red-100 text-red-800',
  info:    'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-800',
  brand:   'bg-brand-100 text-brand-800',
  saree:   'bg-saree-100 text-saree-800',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}