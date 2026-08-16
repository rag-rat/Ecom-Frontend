// import { Link } from "react-router-dom";
// import { Phone, Mail, MapPin } from "lucide-react";
// // import {Instagram, Facebook, Twitter} from "lucide-react"
// import { SiInstagram, SiFacebook, SiX } from "@icons-pack/react-simple-icons";

// export default function Footer() {
//   return (
//     <footer className="bg-gray-900 text-gray-300 mt-auto">
//       {/* ── MAIN FOOTER CONTENT ──────────────────────────────── */}
//       <div className="container-page py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Brand column */}
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-display font-bold">LS</span>
//               </div>
//               <span className="font-display font-bold text-white text-lg">
//                 Ecom Store
//               </span>
//             </div>

//             <p className="text-sm text-gray-400 leading-relaxed mb-4">
//               {/* Premium saree wholesaler with over 20 years of experience.
//               Authentic handloom and designer sarees at wholesale prices. */}
//               Your one-stop destination for the latest tech products. Quality
//               gadgets, great prices, and reliable customer support.
//             </p>

//             {/* <div className="flex gap-3">
//               {[Instagram, Facebook, Twitter].map((Icon, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-700 transition-colors"
//                 >
//                   <Icon size={16} />
//                 </a>
//               ))}
//             </div> */}

//             <div className="flex gap-3">
//               {[SiInstagram, SiFacebook, SiX].map((Icon, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-700 transition-colors"
//                 >
//                   <Icon size={16} />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Quick links */}
//           <div>
//             <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
//               Shop
//             </h3>

//             <ul className="space-y-2.5">
//               {[
//                 // { label: 'All Sarees', path: '/products' },
//                 // { label: 'Silk Sarees', path: '/products?fabric=Silk' },
//                 // { label: 'Cotton Sarees', path: '/products?fabric=Cotton' },
//                 // { label: 'Wedding Collection', path: '/products?occasion=Wedding' },
//                 // { label: 'Featured Products', path: '/products?featured=true' },

//                 { label: "All Products", path: "/products" },
//                 { label: "Laptops", path: "/products?category=Laptops" },
//                 {
//                   label: "Smartphones",
//                   path: "/products?category=Smartphones",
//                 },
//                 { label: "Headphones", path: "/products?category=Headphones" },
//                 { label: "Gaming", path: "/products?type=Gaming" },
//                 { label: "Featured", path: "/products?featured=true" },
//               ].map((item) => (
//                 <li key={item.path}>
//                   <Link
//                     to={item.path}
//                     className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
//                   >
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Account links */}
//           <div>
//             <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
//               Account
//             </h3>

//             <ul className="space-y-2.5">
//               {[
//                 { label: "My Profile", path: "/profile" },
//                 { label: "My Orders", path: "/orders" },
//                 { label: "Wishlist", path: "/wishlist" },
//                 { label: "Cart", path: "/cart" },
//               ].map((item) => (
//                 <li key={item.path}>
//                   <Link
//                     to={item.path}
//                     className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
//                   >
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
//               Contact
//             </h3>

//             <ul className="space-y-3">
//               <li className="flex items-start gap-3 text-sm text-gray-400">
//                 <MapPin
//                   size={16}
//                   className="mt-0.5 flex-shrink-0 text-brand-500"
//                 />
//                 {/* <span>123 Textile Market, Surat, Gujarat 395003</span> */}
//                 <span>
//                   789 Innovation Hub, Sector 62, Noida, Uttar Pradesh 201309
//                 </span>
//               </li>

//               <li className="flex items-center gap-3 text-sm text-gray-400">
//                 <Phone size={16} className="flex-shrink-0 text-brand-500" />
//                 <a
//                   href="tel:+919876543210"
//                   className="hover:text-brand-400 transition-colors"
//                 >
//                   +91 98765 43210
//                 </a>
//               </li>

//               <li className="flex items-center gap-3 text-sm text-gray-400">
//                 <Mail size={16} className="flex-shrink-0 text-brand-500" />
//                 <a
//                   href="mailto:support@sareestore.com"
//                   className="hover:text-brand-400 transition-colors"
//                 >
//                   support@ecomstore.com
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* ── BOTTOM BAR ───────────────────────────────────────── */}
//       <div className="border-t border-gray-800">
//         <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
//           <p className="text-xs text-gray-500">
//             © 2026 Ecom Store. All rights reserved.
//           </p>

//           <div className="flex gap-4">
//             {["Privacy Policy", "Terms of Service", "Return Policy"].map(
//               (item) => (
//                 <a
//                   key={item}
//                   href="#"
//                   className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
//                 >
//                   {item}
//                 </a>
//               ),
//             )}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
// import {Instagram, Facebook, Twitter} from "lucide-react"
import { SiInstagram, SiFacebook, SiX } from "@icons-pack/react-simple-icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      {/* ── MAIN FOOTER CONTENT ──────────────────────────────── */}
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-gray-900 font-display font-bold text-sm">LS</span>
              </div>
              <span className="font-display font-semibold text-white text-lg tracking-tight">
                Ecom Store
              </span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {/* Premium saree wholesaler with over 20 years of experience.
              Authentic handloom and designer sarees at wholesale prices. */}
              Your one-stop destination for the latest tech products. Quality
              gadgets, great prices, and reliable customer support.
            </p>

            {/* <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-700 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div> */}

            <div className="flex gap-3">
              {[SiInstagram, SiFacebook, SiX].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0078D4] hover:border-[#0078D4] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-medium text-white mb-4 text-xs uppercase tracking-widest">
              Shop
            </h3>

            <ul className="space-y-2.5">
              {[
                // { label: 'All Sarees', path: '/products' },
                // { label: 'Silk Sarees', path: '/products?fabric=Silk' },
                // { label: 'Cotton Sarees', path: '/products?fabric=Cotton' },
                // { label: 'Wedding Collection', path: '/products?occasion=Wedding' },
                // { label: 'Featured Products', path: '/products?featured=true' },

                { label: "All Products", path: "/products" },
                { label: "Laptops", path: "/products?category=Laptops" },
                {
                  label: "Smartphones",
                  path: "/products?category=Smartphones",
                },
                { label: "Headphones", path: "/products?category=Headphones" },
                { label: "Gaming", path: "/products?type=Gaming" },
                { label: "Featured", path: "/products?featured=true" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-500 hover:text-[#4CC2FF] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="font-medium text-white mb-4 text-xs uppercase tracking-widest">
              Account
            </h3>

            <ul className="space-y-2.5">
              {[
                { label: "My Profile", path: "/profile" },
                { label: "My Orders", path: "/orders" },
                { label: "Wishlist", path: "/wishlist" },
                { label: "Cart", path: "/cart" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-500 hover:text-[#4CC2FF] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-white mb-4 text-xs uppercase tracking-widest">
              Contact
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <MapPin
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 flex-shrink-0 text-gray-500"
                />
                {/* <span>123 Textile Market, Surat, Gujarat 395003</span> */}
                <span>
                  789 Innovation Hub, Sector 62, Noida, Uttar Pradesh 201309
                </span>
              </li>

              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Phone size={16} strokeWidth={1.75} className="flex-shrink-0 text-gray-500" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-[#4CC2FF] transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>

              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Mail size={16} strokeWidth={1.75} className="flex-shrink-0 text-gray-500" />
                <a
                  href="mailto:support@sareestore.com"
                  className="hover:text-[#4CC2FF] transition-colors"
                >
                  support@ecomstore.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            © 2026 Ecom Store. All rights reserved.
          </p>

          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Return Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs text-gray-600 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

