
// import { clsx } from 'clsx'


// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * Consistent empty state for when lists have no data —
//  * empty cart, no orders, no reviews, empty wishlist.
//  * A good empty state tells the user WHY it's empty and what to do next.
//  */

// export default function EmptyState({
//   icon,
//   title,
//   description,
//   action,
//   className = ''
// }) {

//   return (
    
//     <div className={clsx(
//       'flex flex-col items-center justify-center py-16 px-4 text-center',
//       className
//     )}>
//       {icon && (
//         <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mb-4 text-gray-400">
//           {icon}
//         </div>
//       )}
//       <h3 className="text-lg font-display font-semibold text-gray-800 mb-2">
//         {title}
//       </h3>
//       {description && (
//         <p className="text-gray-500 text-sm max-w-xs mb-6">
//           {description}
//         </p>
//       )}
//       {action && action}
//     </div>
//   )
// }






import { clsx } from 'clsx'


/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Consistent empty state for when lists have no data —
 * empty cart, no orders, no reviews, empty wishlist.
 * A good empty state tells the user WHY it's empty and what to do next.
 */

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}) {

  return (
    
    <div className={clsx(
      'flex flex-col items-center justify-center py-16 px-4 text-center',
      className
    )}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-xs mb-6">
          {description}
        </p>
      )}
      {action && action}
    </div>
  )
}
