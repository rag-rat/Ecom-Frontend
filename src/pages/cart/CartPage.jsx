import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Plus, Minus, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'
import useCart from '../../hooks/useCart'
import { formatCurrency } from '../../utils/formatCurrency'
import OrderSummary from '../../components/cart/OrderSummary'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The dedicated /cart route — a fuller-featured view of the same data
 * shown in the CartDrawer (Part 4), reached either by clicking "View
 * Cart" somewhere, or directly navigating to /cart.
 *
 * WHY BOTH A DRAWER (Part 4) AND A FULL PAGE (this part)?
 * The drawer is for QUICK glances and adjustments while browsing —
 * doesn't interrupt the shopping flow. The full page is for customers
 * who want to carefully review everything before checkout, with more
 * screen real estate and the sticky OrderSummary sidebar. Most major
 * e-commerce sites (Amazon, Myntra) offer both patterns.
 */

export default function CartPage() {

    useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto", // or "auto" for instant
    });
  }, []);

  const {
    items, totalAmount, totalItems, loading,
    handleUpdateQuantity, handleRemoveItem, handleClearCart,
  } = useCart()

  // console.log(items)

  const hasOutOfStockItems = items.some((item) => !item.inStock)

  if (loading && items.length === 0) {
    return <Spinner fullScreen />
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          action={
            <Link to="/products">
              <Button variant="primary" size="lg">Start Shopping</Button>
            </Link>
          }
        />
      </div>
    )
  }


  return (
    <div className="container-page py-8">

      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
        Shopping Cart
      </h1>


      {hasOutOfStockItems && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-sm text-amber-800">
          <AlertTriangle size={16} className="flex-shrink-0" />
          Some items in your cart have insufficient stock. Please update quantities before checkout.
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── ITEMS LIST ─────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">

            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 p-5">

                {/* Image */}
                <Link
                  to={`/products/${item.productId}`}
                  className="w-24 h-28 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0"
                >
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/products/${item.productId}`}
                      className="text-sm font-medium text-gray-900 hover:text-[#0078D4] line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>


                  <p className="text-sm text-gray-900 font-semibold mt-1">
                    {formatCurrency(item.price)}
                  </p>

                  {!item.inStock && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> Insufficient stock available
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={loading}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Link
              to="/products"
              className="text-sm font-medium text-[#0078D4] hover:text-[#106EBE]"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={handleClearCart}
              className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>


        {/* ── ORDER SUMMARY ──────────────────────────────────── */}
        <div>
          <OrderSummary subtotal={totalAmount} itemCount={totalItems}>
            <Link to="/checkout">
              <Button
                variant="primary"
                size="full"
                disabled={hasOutOfStockItems}
              >
                Proceed to Checkout
              </Button>
            </Link>
            {hasOutOfStockItems && (
              <p className="text-xs text-red-500 text-center mt-2">
                Resolve stock issues to continue
              </p>
            )}
          </OrderSummary>
        </div>


      </div>
    </div>
  )
}
