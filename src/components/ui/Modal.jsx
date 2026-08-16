// import { useEffect } from 'react'
// import { X } from 'lucide-react'
// import { clsx } from 'clsx'

// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * Reusable modal dialog — used for confirmations (delete address?,
//  * cancel order?), image viewer, admin forms. The backdrop click and
//  * Escape key both close it — standard UX that we only want to write once.
//  *
//  * Locks body scroll when open — prevents the background from scrolling
//  * while the modal is visible (a small detail that makes the UI feel polished).
//  */

// export default function Modal({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = 'md',
//   showClose = true,
// }) {

//   // Lock body scroll when modal is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = ''
//     }
//     return () => { document.body.style.overflow = '' }
//   }, [isOpen])

//   // Close on Escape key
//   useEffect(() => {
//     const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
//     if (isOpen) window.addEventListener('keydown', handleEsc)
//     return () => window.removeEventListener('keydown', handleEsc)
//   }, [isOpen, onClose])

//   if (!isOpen) return null

//   const sizeClasses = {
//     sm: 'max-w-md',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-4xl',
//   }

//   return (

//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50 animate-fade-in"
//         onClick={onClose}
//       />

//       {/* Modal panel */}
//       <div className={clsx(
//         'relative w-full bg-white rounded-2xl shadow-modal',
//         'animate-slide-up',
//         sizeClasses[size]
//       )}>

//         {/* Header */}
//         {(title || showClose) && (
//           <div className="flex items-center justify-between p-6 border-b border-gray-100">
//             {title && (
//               <h2 className="text-lg font-display font-semibold text-gray-900">
//                 {title}
//               </h2>
//             )}
//             {showClose && (
//               <button
//                 onClick={onClose}
//                 className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             )}
//           </div>
//         )}

//         {/* Content */}
//         <div className="p-6">
//           {children}
//         </div>

//       </div>
//     </div>
//   )
// }

import { useEffect } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Reusable modal dialog — used for confirmations (delete address?,
 * cancel order?), image viewer, admin forms. The backdrop click and
 * Escape key both close it — standard UX that we only want to write once.
 *
 * Locks body scroll when open — prevents the background from scrolling
 * while the modal is visible (a small detail that makes the UI feel polished).
 */

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
  theme = "light",
  scrollable = false,
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={clsx(
          "relative w-full rounded-2xl shadow-modal",
          "animate-slide-up",
          sizeClasses[size],
          theme === "dark" ? "bg-gray-900" : "bg-white",
          scrollable && "max-h-[90vh] overflow-hidden",
        )}
      >
        {/* Header */}
        {(title || showClose) && (
          <div
            className={clsx(
              "flex items-center justify-between p-6 border-b border-gray-100",
              theme === "dark" ? "border-gray-800" : "border-gray-100",
            )}
          >
            {title && (
              <h2
                className={clsx(
                  "text-lg font-display font-semibold ",
                  theme === "dark" ? "text-gray-100" : "text-gray-900",
                )}
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className={clsx(
                  "p-2 rounded-lg text-gray-400 transition-colors",
                  theme === "dark"
                    ? "hover:text-white hover:bg-gray-800"
                    : "hover:text-black hover:bg-gray-100",
                )}
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className={clsx(
            "p-6",
            scrollable && "overflow-y-auto max-h-[calc(90vh-85px)]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
