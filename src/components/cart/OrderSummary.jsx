
import { formatCurrency } from '../../utils/formatCurrency'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Reused in TWO places: the Cart page (this part) and the Checkout
 * page (Part 12) — same summary calculation logic, same visual card,
 * just with a different action button passed as children.
 *
 * The 2000 free-shipping threshold and 99 flat rate mirror EXACTLY
 * the constants in backend's OrderService (Part 16 backend:
 * SHIPPING_CHARGE = 99, FREE_SHIPPING_THRESHOLD = 2000) — this is
 * a PREVIEW calculation for the customer's convenience; the backend
 * recalculates authoritatively when the order is actually placed.
 */


export default function OrderSummary({ subtotal, itemCount, children }) {

  const FREE_SHIPPING_THRESHOLD = 2000
  const SHIPPING_CHARGE = 99

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE
  const total = subtotal + shipping
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-[160px]">
      <h2 className="font-display font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      {/* Free shipping progress nudge */}
      {amountToFreeShipping > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 text-xs text-[#0078D4]">
          Add <span className="font-semibold">{formatCurrency(amountToFreeShipping)}</span> more to get FREE shipping!
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
          <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>
      </div>


      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-baseline">
        <span className="font-display font-semibold text-gray-900">Total</span>
        <span className="font-display font-bold text-xl text-gray-900">
          {formatCurrency(total)}
        </span>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </div>
  )
}
