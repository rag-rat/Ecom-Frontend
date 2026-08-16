
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartApi } from '../../api/cartApi'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Cart state is needed by:
 *   - Navbar (show item count badge)
 *   - Product page (to disable "Add" if item already in cart)
 *   - Cart page (show all items)
 *   - Checkout page (show order summary)
 *
 * Without Redux, we'd need to re-fetch the cart from the backend
 * every time any of these components mounts. With Redux, we fetch
 * once, store globally, and every component reads from the store.
 *
 * OPTIMISTIC UPDATES:
 * When a user clicks "Add to Cart", we want the UI to respond
 * INSTANTLY — not wait for the API round-trip. We update the local
 * state immediately (optimistic), then confirm/rollback based on
 * the actual API response. This makes the UI feel fast and responsive.
 */



// ─────────────────────────────────────────────────────────────
// ASYNC THUNKS
// ─────────────────────────────────────────────────────────────

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart()
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(productId, quantity)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateQuantity(productId, quantity)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeItem(productId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart()
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


// ─────────────────────────────────────────────────────────────
// SLICE DEFINITION
// ─────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false,
    error: null,
    /*
     * isCartOpen: controls the cart drawer visibility.
     * Kept in global state because both the Navbar's cart icon
     * (which opens it) and the CartDrawer itself (which closes it)
     * need access — they're not in a parent-child relationship.
     */
    isCartOpen: false,
  },


  reducers: {
    openCart: (state) => { state.isCartOpen = true },
    closeCart: (state) => { state.isCartOpen = false },
    toggleCart: (state) => { state.isCartOpen = !state.isCartOpen },
    clearCartError: (state) => { state.error = null },
  },


  extraReducers: (builder) => {

    // Helper to update cart state from API response
    // All cart mutations return the full updated cart
    const updateCartState = (state, action) => {
      const cart = action.payload
      state.items = cart.items || []
      state.totalAmount = cart.totalAmount || 0
      state.totalItems = cart.totalItems || 0
      state.loading = false
      state.error = null
    }


    // ── fetchCart ─────────────────────────────────────────
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true })
      .addCase(fetchCart.fulfilled, updateCartState)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })


    // ── addToCart ─────────────────────────────────────────
    builder
      .addCase(addToCart.pending, (state) => { state.loading = true })
      .addCase(addToCart.fulfilled, (state, action) => {
        updateCartState(state, action)
        state.isCartOpen = true  // Auto-open cart drawer on add
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })


    // ── updateQuantity ────────────────────────────────────
    builder
      .addCase(updateCartQuantity.pending, (state) => { state.loading = true })
      .addCase(updateCartQuantity.fulfilled, updateCartState)
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })


    // ── removeFromCart ────────────────────────────────────
    builder
      .addCase(removeFromCart.pending, (state) => { state.loading = true })
      .addCase(removeFromCart.fulfilled, updateCartState)
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })


    // ── clearCart ─────────────────────────────────────────
    builder
      .addCase(clearCart.pending, (state) => { state.loading = true })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.totalAmount = 0
        state.totalItems = 0
        state.loading = false
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})


export const { openCart, closeCart, toggleCart, clearCartError } = cartSlice.actions



// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => state.cart.totalAmount
export const selectCartItemCount = (state) => state.cart.totalItems
export const selectCartLoading = (state) => state.cart.loading
export const selectCartError = (state) => state.cart.error
export const selectIsCartOpen = (state) => state.cart.isCartOpen


/*
 * selectIsInCart — checks if a specific product is already in the cart.
 * Used by product cards to show "In Cart" badge instead of "Add to Cart".
 */
export const selectIsInCart = (productId) => (state) =>
  state.cart.items.some((item) => item.productId === productId)



export default cartSlice.reducer