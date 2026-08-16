import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'
import { orderApi } from '../../api/orderApi'
import { formatCurrency } from '../../utils/formatCurrency'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Landing page after successful payment verification. Fetches the
 * order one more time to display its now-CONFIRMED status — by the
 * time the customer lands here, the backend's payment-success Kafka
 * flow (Part 19 backend) has already deducted inventory and the order
 * status has flipped from PENDING to CONFIRMED.
 */

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    orderApi.getOrderById(orderId)
      .then((res) => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>

        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Your order has been confirmed and is being prepared for shipment.
        </p>

        {order && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-left mb-8">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Order Number</span>
              <span className="text-sm font-semibold text-gray-900">{order.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Amount Paid</span>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Items</span>
              <span className="text-sm font-semibold text-gray-900">{order.items.length} item(s)</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {order && (
            <Link to={`/orders/${order.id}`}>
              <Button variant="primary" size="lg">
                <Package size={16} /> View Order
              </Button>
            </Link>
          )}
          <Link to="/products">
            <Button variant="secondary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}