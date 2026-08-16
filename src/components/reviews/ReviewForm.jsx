
import { useState } from 'react'
import { Star } from 'lucide-react'
import { clsx } from 'clsx'
import Button from '../ui/Button'
import { reviewApi } from '../../api/reviewApi'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Inline review submission form. Used both for CREATING a new review
 * and EDITING an existing one (existingReview prop, passed by ReviewList
 * when the user clicks "Edit" on their own review).
 *
 * Star rating uses a simple hover-preview pattern — hoveredStar shows
 * what WOULD be selected on click, separate from the actual selected
 * rating state.
 */

export default function ReviewForm({ productId, existingReview, onSuccess, onCancel }) {

  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [title, setTitle] = useState(existingReview?.title || '')
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || '')
  const [submitting, setSubmitting] = useState(false)

  const isEditing = Boolean(existingReview)


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a star rating')
      return
    }

    setSubmitting(true)
    try {
      if (isEditing) {
        await reviewApi.updateReview(existingReview.id, { rating, title, reviewText })
        toast.success('Review updated')
      } else {
        await reviewApi.createReview({ productId, rating, title, reviewText })
        toast.success('Review submitted — thank you!')
      }
      onSuccess()
    } catch (err) {
      toast.error(err.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
      <p className="text-sm font-semibold text-gray-800 mb-3">
        {isEditing ? 'Edit your review' : 'Write a review'}
      </p>


      {/* Star selector */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
          >
            <Star
              size={28}
              className={clsx(
                'transition-colors',
                (hoveredStar || rating) >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-200'
              )}
            />
          </button>
        ))}
      </div>


      <input
        type="text"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
      />


      <textarea
        placeholder="Share your experience with this product..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        maxLength={2000}
        rows={4}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
      />


      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="md" loading={submitting}>
          {isEditing ? 'Update Review' : 'Submit Review'}
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      
    </form>
  )
}
