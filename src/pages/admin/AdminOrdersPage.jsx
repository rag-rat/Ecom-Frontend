import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderApi } from '../../api/orderApi'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { getStatusConfig } from '../../utils/orderStatusUtils'
import DataTable from '../../components/admin/DataTable'
import Badge from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/Spinner'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Admin's order fulfillment queue. Status filter tabs map to backend
 * Part 16's GET /api/admin/orders/status/{status} endpoint. The status
 * update dropdown per row calls PUT /api/admin/orders/{id}/status —
 * matching the SAME forward-only state machine validation backend
 * enforces (OrderService.updateOrderStatus()'s FROM_PENDING/
 * FROM_CONFIRMED/FROM_SHIPPED sets) — we just show the appropriate
 * NEXT options per current status rather than a free-for-all dropdown.
 */

const NEXT_STATUS_OPTIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

const FILTER_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [updatingOrderId, setUpdatingOrderId] = useState(null)


  const fetchOrders = () => {
    setLoading(true)
    const request = activeFilter === 'ALL'
      ? orderApi.getAllOrders(page, 15)
      : orderApi.getOrdersByStatus(activeFilter, page, 15)

    request
      .then((res) => {
        setOrders(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }


  useEffect(() => {
    fetchOrders()
  }, [page, activeFilter])


  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    try {
      await orderApi.updateOrderStatus(orderId, newStatus)
      toast.success(`Order marked as ${newStatus}`)
      fetchOrders()
    } catch (err) {
      toast.error(err.message || 'Failed to update status')
    } finally {
      setUpdatingOrderId(null)
    }
  }


  const columns = [
    { key: 'orderNumber', label: 'Order #', render: (row) => <span className="font-medium text-white">{row.orderNumber}</span> },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
    { key: 'items', label: 'Items', render: (row) => `${row.items.length} item(s)` },
    { key: 'totalAmount', label: 'Total', render: (row) => <span className="font-medium text-gray-200">{formatCurrency(row.totalAmount)}</span> },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={getStatusConfig(row.status).badgeVariant}>{row.status}</Badge> },
    {
      key: 'actions', label: 'Update Status', render: (row) => {
        const options = NEXT_STATUS_OPTIONS[row.status] || []
        if (options.length === 0) return <span className="text-xs text-gray-600">—</span>
        return (
          <select
            defaultValue=""
            disabled={updatingOrderId === row.id}
            onChange={(e) => {
              if (e.target.value) handleStatusChange(row.id, e.target.value)
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
          >
            <option value="" disabled>Move to...</option>
            {options.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )
      }
    },
  ]


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-display font-bold text-white mb-6">Orders</h1>

      {/* Status filter tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveFilter(tab); setPage(0) }}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
              activeFilter === tab ? 'bg-[#0078D4] text-white' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800'
            )}
          >
            {tab}
          </button>
        ))}
      </div>


      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg shadow-black/20">
        {loading ? (
          <div className="py-16 flex items-center justify-center"><Spinner /></div>
        ) : (
          <DataTable
            columns={columns}
            data={orders}
            onRowClick={(row) => navigate(`/orders/${row.id}`)}
            emptyMessage="No orders found"
          />
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
