import { useState, useEffect, useCallback } from 'react'
import { Star, ShieldCheck, Pencil, Trash2 } from 'lucide-react'
import { reviewApi } from '../../api/reviewApi'
import { timeAgo } from '../../utils/formatDate'
import Pagination from '../ui/Pagination'
import ReviewForm from './ReviewForm'
import Modal from '../ui/Modal'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Paginated review display. isOwner flag (from backend Part 15's
 * ReviewResponse DTO — set server-side by comparing the review's
 * userId against the authenticated requester) drives whether Edit/
 * Delete buttons appear — the backend has already done the ownership
 * check, so the UI simply trusts and reflects that flag.
 */

export default function ReviewList({ productId, refreshTrigger, onReviewChanged }) {

  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editingReview, setEditingReview] = useState(null)
  const [deletingReviewId, setDeletingReviewId] = useState(null)


  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const response = await reviewApi.getProductReviews(productId, { page, size: 5 })
      setReviews(response.data?.content || [])
      setTotalPages(response.data?.totalPages || 0)
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [productId, page])


  useEffect(() => {
    fetchReviews()
  }, [fetchReviews, refreshTrigger])


  const handleDelete = async () => {
    try {
      await reviewApi.deleteReview(deletingReviewId)
      toast.success('Review deleted')
      setDeletingReviewId(null)
      fetchReviews()
      onReviewChanged?.()
    } catch (err) {
      toast.error(err.message || 'Failed to delete review')
    }
  }


  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl p-5 border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }


  if (reviews.length === 0) {
    return <p className="text-center text-gray-400 py-8 text-sm">No reviews yet.</p>
  }


  // console.log(reviews)

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-5">
          {editingReview?.id === review.id ? (
            <ReviewForm
              productId={productId}
              existingReview={review}
              onSuccess={() => {
                setEditingReview(null)
                fetchReviews()
                onReviewChanged?.()
              }}
              onCancel={() => setEditingReview(null)}
            />
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {review.userName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                          <ShieldCheck size={10} /> Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
                    </div>

                  </div>
                </div>

                
                {review.owner && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingReview(review)}
                      className="p-1.5 text-gray-400 hover:text-[#0078D4] transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingReviewId(review.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>


              {review.title && (
                <p className="text-sm font-medium text-gray-800 mt-3">{review.title}</p>
              )}
              {review.reviewText && (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{review.reviewText}</p>
              )}
            </>
          )}
        </div>
      ))}


      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />


      <Modal
        isOpen={Boolean(deletingReviewId)}
        onClose={() => setDeletingReviewId(null)}
        title="Delete review?"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-6">
          This action cannot be undone. Your review will be permanently removed.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setDeletingReviewId(null)}
            className="flex-1 border border-gray-300 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

    </div>
  )
}
