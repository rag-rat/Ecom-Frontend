// import { clsx } from 'clsx'
// import { forwardRef } from 'react'

// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * Consistent form input across registration, login, checkout, profile.
//  * forwardRef lets React Hook Form (Part 5) attach its ref to the
//  * underlying <input> element — without forwardRef, RHF can't register
//  * the field and validation won't work.
//  *
//  * label + error + helperText are common patterns every form needs —
//  * bundling them into the component avoids repeating this structure
//  * in every form across 18 parts.
//  */

// const Input = forwardRef(function Input({
//   label,
//   error,
//   helperText,
//   className = '',
//   type = 'text',
//   required = false,
//   ...props
// }, ref) {

//   return (

//     <div className="w-full">

//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1.5">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}

//       <input
//         ref={ref}
//         type={type}
//         className={clsx(
//           'w-full px-4 py-2.5 rounded-lg border text-sm',
//           'transition-colors duration-200',
//           'placeholder:text-gray-400',
//           'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
//           error
//             ? 'border-red-400 bg-red-50 focus:ring-red-400'
//             : 'border-gray-300 bg-white hover:border-gray-400',
//           className
//         )}
//         {...props}
//       />

//       {error && (
//         <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
//           <span>⚠</span> {error}
//         </p>
//       )}

//       {helperText && !error && (
//         <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
//       )}

//     </div>
//   )
// })

// export default Input

import { clsx } from "clsx";
import { forwardRef } from "react";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Consistent form input across registration, login, checkout, profile.
 * forwardRef lets React Hook Form (Part 5) attach its ref to the
 * underlying <input> element — without forwardRef, RHF can't register
 * the field and validation won't work.
 *
 * label + error + helperText are common patterns every form needs —
 * bundling them into the component avoids repeating this structure
 * in every form across 18 parts.
 */

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    className = "",
    type = "text",
    required = false,
    theme = "light",
    ...props
  },
  ref,
) {
  return (
    <div className="w-full">
      {label && (
        <label
          className={clsx(
            "block text-sm font-medium mb-1.5",
            theme === "dark" ? "text-gray-300" : "text-gray-700",
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        className={clsx(
          "w-full px-4 py-2.5 rounded-lg border text-sm",
          "transition-colors duration-200",
          theme === "dark"
            ? [
                "bg-gray-800 text-gray-100 border-gray-700",
                "placeholder:text-gray-500",
                "hover:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent",
                /// Remove number spinner arrows
                "[appearance:textfield]",
                "[&::-webkit-inner-spin-button]:appearance-none",
                "[&::-webkit-outer-spin-button]:appearance-none",
                error ? "border-red-400 bg-red-900/20 focus:ring-red-400" : "",
              ]
            : [
                "bg-white text-gray-900 border-gray-300",
                "placeholder:text-gray-400",
                "hover:border-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
                error ? "border-red-400 bg-red-50 focus:ring-red-400" : "",
              ],
          className,
        )}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
