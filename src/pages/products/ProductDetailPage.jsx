import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Star, Minus, Plus, ShieldCheck, Truck, ChevronRight } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { reviewApi } from '../../api/reviewApi'
import { formatCurrency } from '../../utils/formatCurrency'
import ImageGallery from '../../components/products/ImageGallery'
import RatingSummary from '../../components/reviews/RatingSummary'
import ReviewList from '../../components/reviews/ReviewList'
import ReviewForm from '../../components/reviews/ReviewForm'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import useCart from '../../hooks/useCart'
import useWishlist from '../../hooks/useWishlist'
import useAuth from '../../hooks/useAuth'
import { clsx } from 'clsx'
import { toast } from "react-hot-toast";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The page where purchase decisions happen. Fetches THREE things on
 * mount: full product detail, ratings summary, and (implicitly)
 * reviews via ReviewList's own internal fetch.
 *
 * showReviewForm state is toggled by RatingSummary's "Write a Review"
 * button — kept at THIS level (not inside RatingSummary) because
 * submitting a review needs to refresh BOTH the summary AND the list,
 * which live as siblings under this parent.
 */

export default function ProductDetailPage() {
  const { productId } = useParams()
  const { isLoggedIn } = useAuth()
  const { handleAddToCart, isInCart, loading: cartLoading } = useCart()
  const { isWishlisted, handleToggleWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [ratingsSummary, setRatingsSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0)



  useEffect(() => {
    setLoading(true)
    Promise.all([
      productApi.getProductById(productId),
      reviewApi.getRatingsSummary(productId),
    ])
      .then(([productRes, summaryRes]) => {
        setProduct(productRes.data)
        setRatingsSummary(summaryRes.data)
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))

    setQuantity(1)
    window.scrollTo(0, 0)
  }, [productId])


  const refreshRatings = () => {
    reviewApi.getRatingsSummary(productId).then((res) => setRatingsSummary(res.data))
    setReviewRefreshTrigger((t) => t + 1)
  }


  if (loading) {
    return <div className="py-24"><Spinner fullScreen /></div>
  }


  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/products" className="text-[#0078D4] font-medium mt-2 inline-block">
          Browse all products
        </Link>
      </div>
    )
  }


  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0
  const wishlisted = isWishlisted(product.id)
  const inCart = isInCart(product.id)


  return (
    <div className="container-page py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-[#0078D4]">Home</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-[#0078D4]">Products</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── IMAGE GALLERY ────────────────────────────────── */}
        <ImageGallery images={product.images} />


        {/* ── PRODUCT INFO ─────────────────────────────────── */}
        <div>
          {product.categoryName && (
            <p className="text-xs text-[#0078D4] font-medium uppercase tracking-wide mb-2">
              {product.categoryName}
            </p>
          )}

          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
            {product.name}
          </h1>


          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className={s <= Math.round(product.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}


          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-display font-bold text-gray-900">
              {formatCurrency(hasDiscount ? product.discountedPrice : product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
                <Badge variant="danger">{discountPercent}% OFF</Badge>
              </>
            )}
          </div>


          {/* Attributes */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {product.brand && (
              <div><span className="text-gray-400">Brand:</span> <span className="text-gray-700 font-medium">{product.brand}</span></div>
            )}
            {product.color && (
              <div><span className="text-gray-400">Color:</span> <span className="text-gray-700 font-medium">{product.color}</span></div>
            )}
            {product.productType&& (
              <div><span className="text-gray-400">Product Type:</span> <span className="text-gray-700 font-medium">{product.productType}</span></div>
            )}
            {product.condition && (
              <div><span className="text-gray-400">Condition:</span> <span className="text-gray-700 font-medium">{product.condition}</span></div>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>


          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3 mb-4">

            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <Plus size={14} />
              </button>
            </div>


            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              loading={cartLoading}
              disabled={inCart}
              onClick={() => handleAddToCart(product.id, quantity)}
            >
              {inCart ? 'Already in Cart' : 'Add to Cart'}
            </Button>


            <button
              onClick={() => handleToggleWishlist(product.id)}
              className={clsx(
                'w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors',
                wishlisted
                  ? 'bg-gray-900 border-gray-900 text-white'
                  : 'border-gray-300 text-gray-400 hover:text-gray-900'
              )}
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>

          </div>


          {/* Trust signals */}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-[#0078D4]" /> Free shipping on orders above ₹2,000
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#0078D4]" /> 7-day easy returns
            </div>
          </div>
          
        </div>

      </div>


      {/* ── RATINGS & REVIEWS SECTION ────────────────────────── */}
      <div className="mt-8 max-w-3xl">
        <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
          Ratings & Reviews
        </h2>

        <RatingSummary
          summary={ratingsSummary}
          onWriteReview={() => {
            if (!isLoggedIn) {
              toast.error('Please login to write a review')
              return
            }
            setShowReviewForm(true)
          }}
        />

        {showReviewForm && (
          <div className="mt-4">
            <ReviewForm
              productId={product.id}
              onSuccess={() => {
                setShowReviewForm(false)
                refreshRatings()
              }}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}


        <div className="mt-6">
          <ReviewList
            productId={product.id}
            refreshTrigger={reviewRefreshTrigger}
            onReviewChanged={refreshRatings}
          />
        </div>

      </div>
    </div>
  )
}
