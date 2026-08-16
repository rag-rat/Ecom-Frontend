import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import useWishlist from "../../hooks/useWishlist";
import useCart from "../../hooks/useCart";
import { clsx } from "clsx";

/*
 * ═══════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 * ═══════════════════════════════════════════════════════════════
 * The single most-reused component in the entire frontend. Used on:
 *   - Homepage featured products (Part 7)
 *   - Product listing grid (Part 8)
 *   - Wishlist page (Part 11)
 *   - Related products on product detail (Part 9)
 *
 * Built ONCE here, used everywhere — matches the same DRY principle
 * we followed throughout the backend (BaseEntity, ApiResponse etc.)
 *
 * Accepts a ProductSummaryResponse-shaped object (matches backend
 * Part 9's lightweight DTO exactly): id, name, price, discountedPrice,
 * primaryImageUrl, categoryName, averageRating, reviewCount, isFeatured
 *
 * e.stopPropagation() on the wishlist/cart buttons prevents the click
 * from also triggering the outer <Link> navigation — without this,
 * clicking the heart icon would BOTH toggle the wishlist AND navigate
 * to the product page, which is not what the user intended.
 */

export default function ProductCard({ product }) {
  const { isWishlisted, handleToggleWishlist } = useWishlist();
  const { handleAddToCart, isInCart } = useCart();

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  const onWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggleWishlist(product.id);
  };

  const onAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(product.id, 1);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 card-hover"
    >
      {/* ── IMAGE ─────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart size={32} />
          </div>
        )}

        {/* Featured badge */}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-[#0078D4] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={onWishlistClick}
          className={clsx(
            "absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center",
            "shadow-md transition-all duration-200",
            wishlisted
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-400 hover:text-gray-900'
          )}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── DETAILS ───────────────────────────────────────── */}
      <div className="p-4">
        {product.categoryName && (
          <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">
            {product.categoryName}
          </p>
        )}

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700">
              {product.averageRating?.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-gray-900">
              {formatCurrency(
                hasDiscount ? product.discountedPrice : product.price,
              )}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={onAddToCartClick}
            disabled={inCart}
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
              inCart
                ? "bg-green-100 text-green-700"
                : "bg-blue-50 text-[#0078D4] hover:bg-[#0078D4] hover:text-white",
            )}
            title={inCart ? "Already in cart" : "Add to cart"}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}
