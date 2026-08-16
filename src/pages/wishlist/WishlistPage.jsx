import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { fetchWishlist } from '../../store/slices/wishlistSlice'
import useWishlist from '../../hooks/useWishlist'
import ProductCard from '../../components/products/ProductCard'
import ProductGridSkeleton from '../../components/products/ProductGridSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The simplest page in the entire frontend — nearly all the real work
 * (fetching, toggling, state management) already lives in wishlistSlice
 * (Part 3) and ProductCard (Part 7). This page is mostly composition:
 * fetch on mount, render the grid, handle empty/loading states.
 *
 * WHY fetchWishlist AGAIN HERE, when Navbar (Part 4) already fetches
 * it on login?
 * The Navbar's fetch happens once at login time. If the user has been
 * browsing for a while and toggled items from various product cards,
 * the Redux state is ALREADY up to date via toggleWishlist's own
 * fulfilled reducer (Part 3) — no need to re-fetch on every visit to
 * this page. But we fetch here too as a defensive refresh, in case the
 * user navigated directly to /wishlist via a bookmark/shared link
 * before the Navbar's login-triggered fetch had a chance to complete,
 * or after a long session where data might have drifted.
 */

export default function WishlistPage() {
  
  const dispatch = useDispatch()
  const { products, loading } = useWishlist()

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto", // or "auto" for instant
    });
  }, []);

  
  return (
    <div className="container-page py-8">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={22} className="text-gray-900" fill="currentColor" />
        <h1 className="text-2xl font-display font-bold text-gray-900">
          My Wishlist
        </h1>
        {products.length > 0 && (
          <span className="text-sm text-gray-400">({products.length} items)</span>
        )}
      </div>

      {loading && products.length === 0 ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Heart size={28} />}
          title="Your wishlist is empty"
          description="Save your favorite products here to shop them later"
          action={
            <Link to="/products">
              <Button variant="primary" size="lg">Discover Products</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
