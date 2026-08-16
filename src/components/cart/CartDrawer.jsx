// import { useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
// import { useSelector } from 'react-redux'
// import { selectIsCartOpen } from '../../store/slices/cartSlice'
// import useCart from '../../hooks/useCart'
// import { formatCurrency } from '../../utils/formatCurrency'
// import Button from '../ui/Button'
// import EmptyState from '../ui/EmptyState'

// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * The slide-in cart drawer that appears from the right when the
//  * cart icon in the Navbar is clicked. Allows quick quantity changes
//  * and removal without navigating away from the current page.
//  *
//  * Rendered inside PublicLayout so it overlays the entire page.
//  */

// export default function CartDrawer() {
//   const isOpen = useSelector(selectIsCartOpen)
//   const {
//     items, totalAmount, loading,
//     handleUpdateQuantity, handleRemoveItem, closeCart
//   } = useCart()

//   // Prevent body scroll when drawer is open
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? 'hidden' : ''
//     return () => { document.body.style.overflow = '' }
//   }, [isOpen])

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 animate-fade-in"
//         onClick={closeCart}
//       />

//       {/* Drawer panel */}
//       <div className="absolute right-0 inset-y-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <ShoppingBag size={20} className="text-brand-600" />
//             <h2 className="font-display font-semibold text-gray-900">
//               Shopping Cart
//             </h2>
//             {items.length > 0 && (
//               <span className="text-sm text-gray-500">({items.length} items)</span>
//             )}
//           </div>
//           <button
//             onClick={closeCart}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Items */}
//         <div className="flex-1 overflow-y-auto px-5 py-4">
//           {items.length === 0 ? (
//             <EmptyState
//               icon={<ShoppingBag size={28} />}
//               title="Your cart is empty"
//               description="Add some Products to your cart"
//               action={
//                 <Button variant="primary" size="md" onClick={closeCart}>
//                   <Link to="/products">Browse Products</Link>
//                 </Button>
//               }
//             />
//           ) : (
//             <div className="space-y-4">
//               {items.map((item) => (
//                 <div key={item.productId} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
//                   {/* Product image */}
//                   <div className="w-20 h-20 rounded-lg overflow-hidden bg-warm-100 flex-shrink-0">
//                     {item.productImage ? (
//                       <img
//                         src={item.productImage}
//                         alt={item.productName}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-300">
//                         <ShoppingBag size={24} />
//                       </div>
//                     )}
//                   </div>

//                   {/* Product info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
//                       {item.productName}
//                     </p>
//                     <p className="text-sm font-semibold text-brand-700 mt-1">
//                       {formatCurrency(item.price)}
//                     </p>

//                     {/* Stock warning */}
//                     {!item.inStock && (
//                       <p className="text-xs text-red-500 mt-1">
//                         ⚠ Insufficient stock
//                       </p>
//                     )}

//                     {/* Quantity controls */}
//                     <div className="flex items-center gap-2 mt-2">
//                       <div className="flex items-center border border-gray-200 rounded-lg">
//                         <button
//                           onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
//                           disabled={loading || item.quantity <= 1}
//                           className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-brand-700 disabled:opacity-40 transition-colors"
//                         >
//                           <Minus size={12} />
//                         </button>
//                         <span className="w-8 text-center text-sm font-medium">
//                           {item.quantity}
//                         </span>
//                         <button
//                           onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
//                           disabled={loading}
//                           className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-brand-700 disabled:opacity-40 transition-colors"
//                         >
//                           <Plus size={12} />
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => handleRemoveItem(item.productId)}
//                         className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Subtotal */}
//                   <div className="text-right flex-shrink-0">
//                     <p className="text-sm font-semibold text-gray-900">
//                       {formatCurrency(item.subtotal)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         {items.length > 0 && (
//           <div className="border-t border-gray-100 px-5 py-4 space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Subtotal</span>
//               <span className="font-display font-bold text-lg text-gray-900">
//                 {formatCurrency(totalAmount)}
//               </span>
//             </div>
//             <p className="text-xs text-gray-400 text-center">
//               Shipping calculated at checkout
//             </p>
//             <Link to="/checkout" onClick={closeCart}>
//               <Button variant="primary" size="full" loading={loading}>
//                 Proceed to Checkout
//               </Button>
//             </Link>
//             <button
//               onClick={closeCart}
//               className="w-full text-sm text-center text-gray-500 hover:text-gray-700 transition-colors py-1"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useSelector } from "react-redux";
import { selectIsCartOpen } from "../../store/slices/cartSlice";
import useCart from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The slide-in cart drawer that appears from the right when the
 * cart icon in the Navbar is clicked. Allows quick quantity changes
 * and removal without navigating away from the current page.
 *
 * Rendered inside PublicLayout so it overlays the entire page.
 */

export default function CartDrawer() {
  const isOpen = useSelector(selectIsCartOpen);
  const {
    items,
    totalAmount,
    loading,
    handleUpdateQuantity,
    handleRemoveItem,
    closeCart,
  } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer panel */}
      <div className="absolute right-0 inset-y-0 w-full max-w-md bg-white shadow-[0_0_40px_rgba(0,0,0,0.15)] flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag
              size={20}
              strokeWidth={1.75}
              className="text-gray-900"
            />
            <h2 className="font-display font-semibold text-gray-900">
              Shopping Cart
            </h2>
            {items.length > 0 && (
              <span className="text-sm text-gray-400">
                ({items.length} items)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <Link
                to="/cart"
                onClick={closeCart}
                className="inline-block text-sm font-medium text-[#0078D4] border-b border-transparent hover:border-[#0078D4] transition-all duration-200"
              >
                View Full Cart
              </Link>
            )}
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={28} strokeWidth={1.75} />}
              title="Your cart is empty"
              description="Add some Products to your cart"
              action={
                <Button variant="primary" size="md" onClick={closeCart}>
                  <Link to="/products">Browse Products</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 py-3 border-b border-gray-100 last:border-0"
                >
                  {/* Product image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={24} strokeWidth={1.75} />
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                      {item.productName}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatCurrency(item.price)}
                    </p>

                    {/* Stock warning */}
                    {!item.inStock && (
                      <p className="text-xs text-red-500 mt-1">
                        ⚠ Insufficient stock
                      </p>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1,
                            )
                          }
                          disabled={loading || item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors"
                        >
                          <Minus size={12} strokeWidth={1.75} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1,
                            )
                          }
                          disabled={loading}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors"
                        >
                          <Plus size={12} strokeWidth={1.75} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-display font-semibold text-lg text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Shipping calculated at checkout
            </p>
            <p></p>

            {/* <Link
  to="/cart"
  onClick={closeCart}
  className="inline-block text-sm font-medium text-[#0078D4] border-b border-transparent hover:border-[#0078D4] transition-all duration-200"
>
  View Full Cart
</Link> */}

            <Link to="/checkout" onClick={closeCart}>
              <Button variant="primary" size="full" loading={loading}>
                Proceed to Checkout
              </Button>
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-sm text-center text-gray-500 hover:text-gray-900 transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
