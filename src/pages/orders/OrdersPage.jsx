import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { orderApi } from '../../api/orderApi'
import OrderCard from '../../components/orders/OrderCard'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    orderApi.getMyOrders(page, 10)
      .then((res) => {
        setOrders(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [page])

  if (loading && orders.length === 0) return <Spinner fullScreen />

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package size={28} />}
          title="No orders yet"
          description="When you place an order, it will show up here"
          action={
            <Link to="/products">
              <Button variant="primary" size="lg">Start Shopping</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-4 max-w-6xl">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}