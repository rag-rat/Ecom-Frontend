import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { userApi } from '../../api/userApi'
import { formatDate } from '../../utils/formatDate'
import DataTable from '../../components/admin/DataTable'
import Badge from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Matches backend Part 7's AdminUserController exactly: list all
 * users, search by keyword, activate/deactivate, change role.
 *
 * We debounce the search input (300ms) so we don't fire an API call
 * on every single keystroke — same performance reasoning as
 * FilterSidebar's "Apply" button pattern from Part 8, just implemented
 * via debounce instead of an explicit button here, since search boxes
 * conventionally search-as-you-type with a short delay.
 */


export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [activeSearch, setActiveSearch] = useState('')


  const fetchUsers = useCallback(() => {
    setLoading(true)
    const request = activeSearch
      ? userApi.searchUsers(activeSearch, page, 15)
      : userApi.getAllUsers(page, 15)

    request
      .then((res) => {
        setUsers(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, activeSearch])


  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])


  // console.log(users)


  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearch(searchInput)
      setPage(0)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])


  const handleToggleActive = async (userId, currentlyActive) => {
    try {
      await userApi.toggleUserActive(userId, !currentlyActive)
      toast.success(currentlyActive ? 'User deactivated' : 'User activated')
      fetchUsers()
    } catch (err) {
      toast.error(err.message || 'Failed to update user')
    }
  }


  const handleRoleChange = async (userId, newRole) => {
    try {
      await userApi.updateUserRole(userId, newRole)
      toast.success(`Role updated to ${newRole}`)
      fetchUsers()
    } catch (err) {
      toast.error(err.message || 'Failed to update role')
    }
  }


  const columns = [
    {
      key: 'name', label: 'Name', render: (row) => (
        <div>
          <p className="font-medium text-white">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    { key: 'phoneNumber', label: 'Phone' },
    {
      key: 'role', label: 'Role', render: (row) => (
        <select
          value={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-xs border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
        >
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      )
    },
    { key: 'createdAt', label: 'Joined', render: (row) => formatDate(row.createdAt) },
    {
      key: 'status', label: 'Status', render: (row) => (
        <Badge variant={row.active ? 'success' : 'danger'}>
          {row.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions', label: '', render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(row.id, row.active) }}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            row.active
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-green-400 hover:bg-green-500/10'
          }`}
        >
          {row.active ? 'Deactivate' : 'Activate'}
        </button>
      )
    },
  ]


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-display font-bold text-white mb-6">Customers</h1>

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-700 bg-gray-800 text-gray-100 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
        />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg shadow-black/20">
        {loading ? (
          <div className="py-16 flex items-center justify-center"><Spinner /></div>
        ) : (
          <DataTable columns={columns} data={users} emptyMessage="No customers found" />
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
