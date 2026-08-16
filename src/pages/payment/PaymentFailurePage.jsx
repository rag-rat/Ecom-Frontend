import { Link, useSearchParams } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import Button from '../../components/ui/Button'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Landing page when payment is cancelled or fails. The order stays
 * PENDING in the backend (never CONFIRMED) — no inventory was deducted
 * (backend Part 17's confirmOrderPayment() only runs on verified
 * success), so this is a completely safe, recoverable state. The
 * customer can retry from their Orders page whenever ready.
 */

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const reason = searchParams.get('reason')

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-amber-500" />
        </div>

        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          {reason === 'cancelled' ? 'Payment Cancelled' : 'Payment Not Completed'}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Your order has been saved and is awaiting payment. No amount has been
          charged. You can complete the payment anytime from your Orders page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && (
            <Link to={`/payment/process/${orderId}`}>
              <Button variant="primary" size="lg">
                Try Payment Again
              </Button>
            </Link>
          )}
          <Link to="/orders">
            <Button variant="secondary" size="lg">
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}