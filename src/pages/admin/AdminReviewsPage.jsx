import { useState, useEffect } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { reviewApi } from '../../api/reviewApi'
import { timeAgo } from '../../utils/formatDate'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Matches backend Part 15's AdminReviewController — GET all reviews
 * across every product/user (no ownership filter, since admin has
 * moderation authority over everything), DELETE any review regardless
 * of who wrote it.
 */

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const navigate = useNavigate()


  const fetchReviews = () => {
    setLoading(true)
    reviewApi.getAllReviewsAdmin(page, 15)
      .then((res) => {
        setReviews(res.data?.content || [])
        setTotalPages(res.data?.totalPages || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchReviews()
  }, [page])


  const handleDelete = async () => {
    try {
      await reviewApi.adminDeleteReview(deletingId)
      toast.success('Review removed')
      setDeletingId(null)
      fetchReviews()
    } catch (err) {
      toast.error(err.message || 'Failed to delete review')
    }
  }


  const columns = [
    { key: 'userName', label: 'Customer' },
    {
      key: 'rating', label: 'Rating', render: (row) => (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={12} className={s <= row.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'} />
          ))}
        </div>
      )
    },
    {
      key: 'content', label: 'Review', render: (row) => (
        <div className="max-w-xs">
          {row.title && <p className="font-medium text-gray-200 text-xs">{row.title}</p>}
          <p className="text-gray-500 text-xs line-clamp-2">{row.reviewText}</p>
        </div>
      )
    },
    { key: 'createdAt', label: 'Posted', render: (row) => timeAgo(row.createdAt) },
    {
      key: 'actions', label: '', render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDeletingId(row.id) }}
          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      )
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-display font-bold text-white mb-6">Review Moderation</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg shadow-black/20">
        {loading ? (
          <div className="py-16 flex items-center justify-center"><Spinner /></div>
        ) : (
          <DataTable columns={columns} data={reviews} emptyMessage="No reviews yet" onRowClick={(row) => navigate(`/products/${row.productId}`)}/>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} title="Remove this review?" size="sm" theme = "dark">
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          This review will be permanently removed and the product's rating will be recalculated.
        </p>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="flex-1 bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors">
            Remove Review
          </button>
          <button onClick={() => setDeletingId(null)} className="flex-1 border border-gray-700 text-gray-300 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
