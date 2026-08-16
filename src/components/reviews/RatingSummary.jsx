
import { Star } from 'lucide-react'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Visualizes the ProductRatingsSummary DTO from backend Part 15:
 * { averageRating, totalRatings, totalReviews, ratingBreakdown: {1:x,2:x,...} }
 *
 * The breakdown bars show relative proportion of each star level —
 * standard e-commerce rating display pattern (same as Amazon).
 */

export default function RatingSummary({ summary, onWriteReview }) {

  if (!summary || summary.totalRatings === 0) {

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
        <p className="text-gray-500 text-sm mb-3">No ratings yet — be the first to review!</p>
        <button
          onClick={onWriteReview}
          className="text-sm font-medium text-[#0078D4] hover:text-[#106EBE]"
        >
          Write a Review
        </button>
      </div>
    )
  }

  const { averageRating, totalRatings, totalReviews, ratingBreakdown } = summary


  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row gap-8">


        {/* Big average number */}
        <div className="flex flex-col items-center sm:items-start flex-shrink-0">
          <p className="text-5xl font-display font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </p>
          <div className="flex gap-0.5 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {totalRatings} rating{totalRatings !== 1 ? 's' : ''} · {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
          <button
            onClick={onWriteReview}
            className="mt-4 text-sm font-medium text-[#0078D4] border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors"
          >
            Write a Review
          </button>
        </div>


        {/* Breakdown bars */}
        <div className="flex-1 space-y-1.5">

          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingBreakdown[star] || 0
            const percent = totalRatings > 0 ? (count / totalRatings) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-gray-500">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-400">{count}</span>
              </div>
            )
          })}
          
        </div>

      </div>
    </div>
  )
}
