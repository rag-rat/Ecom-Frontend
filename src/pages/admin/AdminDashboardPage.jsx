import { useEffect, useState } from 'react'
import {
  IndianRupee, ShoppingBag, Users, AlertTriangle
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { dashboardApi } from '../../api/dashboardApi'
import { formatCurrency, formatCompact } from '../../utils/formatCurrency'
import StatsCard from '../../components/admin/StatsCard'
import Spinner from '../../components/ui/Spinner'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Consumes backend Part 21's DashboardSummaryResponse in full:
 *   totalRevenue, totalOrders, ordersByStatus, totalCustomers,
 *   totalProducts, lowStockProducts, topSellingProducts
 *
 * All fields are used directly — no additional client-side aggregation
 * needed, since the backend's DashboardService already computed
 * everything (revenue filtering by status, top products ranking, low
 * stock detection via Inventory's isLowStock()).
 */


const STATUS_COLORS = {
  PENDING: '#f59e0b',
  CONFIRMED: '#0078D4',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
}

const darkTooltipStyle = {
  backgroundColor: '#111827',
  border: '1px solid #374151',
  borderRadius: '0.75rem',
  color: '#F3F4F6',
}


export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    dashboardApi.getSummary()
      .then((res) => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])


  if (loading) return <Spinner fullScreen />
  if (!summary) return <p className="text-gray-500">Failed to load dashboard.</p>


  const statusData = Object.entries(summary.ordersByStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ name: status, value: count }))

  const topProductsData = summary.topSellingProducts.map((p) => ({
    name: p.productName.length > 15 ? p.productName.slice(0, 15) + '…' : p.productName,
    units: p.totalUnitsSold,
  }))


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-display font-bold text-white mb-6">
        Dashboard
      </h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={IndianRupee} label="Total Revenue" value={formatCompact(summary.totalRevenue)} color="green" />
        <StatsCard icon={ShoppingBag} label="Total Orders" value={summary.totalOrders} color="brand" />
        <StatsCard icon={Users} label="Total Customers" value={summary.totalCustomers} color="blue" />
        <StatsCard icon={AlertTriangle} label="Low Stock Items" value={summary.lowStockProducts.length} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Orders by status pie chart */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg shadow-black/20 p-6">
          <h2 className="font-display font-semibold text-white mb-4">Orders by Status</h2>
          {statusData.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-sm">No orders yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  stroke="#111827"
                  strokeWidth={2}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: '#4B5563' }}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={darkTooltipStyle} itemStyle={{ color: '#E5E7EB' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>


        {/* Top products bar chart */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg shadow-black/20 p-6">
          <h2 className="font-display font-semibold text-white mb-4">Top Selling Products</h2>
          {topProductsData.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-sm">No sales data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={darkTooltipStyle} cursor={{ fill: '#1F2937', opacity: 0.6 }} />
                <Bar dataKey="units" fill="#0078D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>


      {/* Low stock alert list */}
      {summary.lowStockProducts.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-amber-900/40 p-6">
          <h2 className="font-display font-semibold text-white flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-400" /> Low Stock Alerts
          </h2>
          <div className="space-y-2">
            {summary.lowStockProducts.map((item) => (
              <div key={item.productId} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-sm text-gray-300">{item.productName}</span>
                <span className="text-xs font-medium text-amber-400">
                  {item.availableStock} left (threshold: {item.threshold})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
