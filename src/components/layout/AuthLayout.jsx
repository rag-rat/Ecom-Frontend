// import { Link } from 'react-router-dom'
// import { CheckCircle2 } from 'lucide-react'

// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * Shared split-screen shell for Login and Register — left brand panel,
//  * right form panel. Both pages render very different forms but share
//  * this exact same visual wrapper, so we build it once here.
//  */

// export default function AuthLayout({ children, title, subtitle }) {
//   return (
//     <div className="min-h-screen flex">

//       {/* ── LEFT — BRAND PANEL (hidden on mobile) ──────────── */}
//       <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-gradient-to-br from-brand-700 via-brand-800 to-saree-900 relative overflow-hidden">
//         {/* Decorative circles */}
//         <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

//         <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
//           <Link to="/" className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
//               <span className="text-brand-700 font-display font-bold text-xl">LS</span>
//             </div>
//             <span className="font-display font-bold text-xl">Ecom Store</span>
//           </Link>

//           <div>
//             <h1 className="text-3xl font-display font-bold leading-tight mb-4">
//               Premium Products,<br />wholesale prices.
//             </h1>
//             <p className="text-brand-100 text-sm mb-8 max-w-xs">
//               {/* Join thousands of customers who trust us for authentic
//               handloom and designer sarees. */}
//               Join thousands of customers who trust us for premium laptops, smartphones, and cutting-edge tech.
//             </p>

//             <div className="space-y-3">
//               {[
//                 // '20+ years of textile expertise',
//                 // '10,000+ saree designs',
//                 // 'Direct wholesale pricing',

//                 'Latest Premium Electronics',
//                 'Top Global Tech Brands',
//                 'Fast & Secure Delivery',
//               ].map((item) => (
//                 <div key={item} className="flex items-center gap-3 text-sm">
//                   <CheckCircle2 size={18} className="text-brand-300 flex-shrink-0" />
//                   <span className="text-brand-50">{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <p className="text-xs text-brand-200">
//             © 2026 Ecom Store. All rights reserved.
//           </p>
//         </div>
//       </div>


//       {/* ── RIGHT — FORM PANEL ──────────────────────────────── */}
//       <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
//         <div className="w-full max-w-sm">
//           {/* Mobile logo (shown only when left panel is hidden) */}
//           <Link to="/" className="md:hidden flex items-center gap-2 mb-8 justify-center">
//             <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-display font-bold">LS</span>
//             </div>
//             <span className="font-display font-bold text-lg text-gray-900">Ecom Store</span>
//           </Link>

//           <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">
//             {title}
//           </h2>
//           <p className="text-sm text-gray-500 mb-8">{subtitle}</p>

//           {children}
//         </div>
//       </div>
//     </div>
//   )
// }




import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Shared split-screen shell for Login and Register — left brand panel,
 * right form panel. Both pages render very different forms but share
 * this exact same visual wrapper, so we build it once here.
 */

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">

      {/* ── LEFT — BRAND PANEL (hidden on mobile) ──────────── */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-gradient-to-br from-[#004578] via-[#0078D4] to-gray-900 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-display font-bold text-xl">LS</span>
            </div>
            <span className="font-display font-bold text-xl">Ecom Store</span>
          </Link>

          <div>
            <h1 className="text-3xl font-display font-bold leading-tight mb-4">
              Premium Products,<br />wholesale prices.
            </h1>
            <p className="text-blue-100 text-sm mb-8 max-w-xs">
              {/* Join thousands of customers who trust us for authentic
              handloom and designer sarees. */}
              Join thousands of customers who trust us for premium laptops, smartphones, and cutting-edge tech.
            </p>

            <div className="space-y-3">
              {[
                // '20+ years of textile expertise',
                // '10,000+ saree designs',
                // 'Direct wholesale pricing',

                'Latest Premium Electronics',
                'Top Global Tech Brands',
                'Fast & Secure Delivery',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-[#4CC2FF] flex-shrink-0" />
                  <span className="text-blue-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-blue-200">
            © 2026 Ecom Store. All rights reserved.
          </p>
        </div>
      </div>


      {/* ── RIGHT — FORM PANEL ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo (shown only when left panel is hidden) */}
          <Link to="/" className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold">LS</span>
            </div>
            <span className="font-display font-bold text-lg text-gray-900">Ecom Store</span>
          </Link>

          <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mb-8">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  )
}
