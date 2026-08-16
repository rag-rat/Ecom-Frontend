import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2, ShieldCheck } from "lucide-react";
import { reviewApi } from "../../../api/reviewApi";
import { timeAgo } from "../../../utils/formatDate";
import Pagination from "../../../components/ui/Pagination";
import Modal from "../../../components/ui/Modal";
import EmptyState from "../../../components/ui/EmptyState";
import toast from "react-hot-toast";
import { ExternalLink } from "lucide-react";
import ReviewCardSkeleton from "../../../components/reviews/ReviewCardSkeleton";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Lists all reviews the current user has written, across ALL products —
 * uses backend Part 15's dedicated GET /api/reviews/my-reviews endpoint
 * rather than filtering ReviewList (Part 9) per-product.
 *
 * Each review links back to its product so the customer can revisit
 * the product page directly from their review history.
 */

export default function MyReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const fetchReviews = useCallback(() => {
    setLoading(true);
    reviewApi
      .getMyReviews(page, 10)
      .then((res) => {
        setReviews(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 0);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async () => {
    try {
      await reviewApi.deleteReview(deletingReviewId);
      toast.success("Review deleted");
      setDeletingReviewId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  return (
    <div>
      <h2 className="font-display font-semibold text-lg text-gray-900 mb-1">
        My Reviews
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Reviews you've written for products
      </p>

      {loading ? (
        <ReviewCardSkeleton count={1} />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<Star size={24} />}
          title="No reviews yet"
          description="Reviews you write on products will appear here"
        />
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={
                            s <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {timeAgo(review.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-5">
                    <Link
                      to={`/products/${review.productId}`}
                      className="group flex items-center gap-1 text-xs font-medium text-[#0078D4] hover:text-[#106EBE] transition-colors"
                    >
                      View Product
                      <ExternalLink
                        size={12}
                        className="transition-transform duration-200 group-hover:scale-110"
                      />
                    </Link>

                    <button
                      onClick={() => setDeletingReviewId(review.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* <button
                    onClick={() => setDeletingReviewId(review.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button> */}
                </div>

                {review.title && (
                  <p className="text-sm font-medium text-gray-800 mt-3">
                    {review.title}
                  </p>
                )}
                {review.reviewText && (
                  <p className="text-sm text-gray-600 mt-1">
                    {review.reviewText}
                  </p>
                )}
              </div>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        isOpen={Boolean(deletingReviewId)}
        onClose={() => setDeletingReviewId(null)}
        title="Delete this review?"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-6">
          This action cannot be undone.
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
  );
}
