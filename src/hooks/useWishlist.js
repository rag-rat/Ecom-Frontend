
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

import {
  selectWishlistProducts,
  selectWishlistLoading,
  selectIsWishlisted,
  toggleWishlist,
} from '../store/slices/wishlistSlice'

import { selectIsLoggedIn } from '../store/slices/authSlice'



export default function useWishlist() {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const products = useSelector(selectWishlistProducts)
  const loading = useSelector(selectWishlistLoading)


  const handleToggleWishlist = useCallback(async (productId) => {
    if (!isLoggedIn) {
      toast.error('Please login to save to wishlist')
      return
    }

    await dispatch(toggleWishlist(productId))
  }, [dispatch, isLoggedIn])


  /*
   * isWishlisted: returns a function that takes productId and returns
   * a boolean. Used in product cards:
   *   const wishlisted = isWishlisted(product.id)
   */
  const isWishlisted = useCallback((productId) => {
    return products.some(p => p.id === productId)
  }, [products])
  

  return {
    products,
    loading,
    isWishlisted,
    handleToggleWishlist,
  }
}