
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { wishlistApi } from '../../api/wishlistApi'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Wishlist state is needed across many product cards displayed on
 * different pages — home, search results, product detail.
 * Without global state, each card would need to fetch the full wishlist
 * to know if THIS product is wishlisted. With Redux, we load the
 * wishlist once and every card checks against the global productIds list.
 *
 * selectIsWishlisted selector (below) enables this O(1) lookup per card.
 */

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getWishlist()
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { wishlist } = getState()
      const isWishlisted = wishlist.productIds.includes(productId)

      if (isWishlisted) {
        const response = await wishlistApi.removeFromWishlist(productId)
        return response.data
      } else {
        const response = await wishlistApi.addToWishlist(productId)
        return response.data
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)



const wishlistSlice = createSlice({
  name: 'wishlist',

  initialState: {
    products: [],     // Full ProductSummaryResponse objects (for wishlist page)
    productIds: [],   // Just the IDs (for fast O(1) "is wishlisted?" lookup)
    loading: false,
    error: null,
  },


  reducers: {
    clearWishlistError: (state) => { state.error = null },
  },


  extraReducers: (builder) => {

    const updateWishlistState = (state, action) => {
      const wishlist = action.payload
      state.products = wishlist.products || []
      // Extract just the IDs for the fast lookup
      state.productIds = (wishlist.products || []).map((p) => p.id)
      state.loading = false
      state.error = null
    }

    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true })
      .addCase(fetchWishlist.fulfilled, updateWishlistState)
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    builder
      .addCase(toggleWishlist.pending, (state) => { state.loading = true })
      .addCase(toggleWishlist.fulfilled, updateWishlistState)
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})


export const { clearWishlistError } = wishlistSlice.actions


// Selectors
export const selectWishlistProducts = (state) => state.wishlist.products
export const selectWishlistLoading = (state) => state.wishlist.loading


/*
 * selectIsWishlisted — O(1) check using the productIds array.
 * Called by EVERY product card, so this MUST be fast.
 * Array.includes() on an array of IDs is O(n), which for typical
 * wishlist sizes (< 100 items) is effectively instant. For very large
 * wishlists, convert to a Set instead: state.wishlist.productIdSet.has(id)
 */
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.productIds.includes(productId)



export default wishlistSlice.reducer