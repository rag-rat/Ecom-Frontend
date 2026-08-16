
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'

/*
 * ═══════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 * ═══════════════════════════════════════════════════════════════
 * The Redux store is the SINGLE SOURCE OF TRUTH for all global
 * application state. Think of it as a JavaScript object that lives
 * outside any component and can be read or updated by any component
 * in the entire tree, regardless of how deeply nested they are.
 *
 * WHY DO WE NEED GLOBAL STATE AT ALL?
 * Without global state, sharing data between components requires
 * "prop drilling" — passing props down through every intermediate
 * component even if those components don't need the data themselves.
 * Example: the Navbar needs to know if the user is logged in and
 * show their name. The cart icon needs the item count. Without Redux,
 * this state would need to live at the App level and be drilled down
 * through Layout → Header → Navbar → CartIcon. Redux makes the state
 * directly accessible from any component without drilling.
 *
 * WHAT GOES IN REDUX vs LOCAL STATE (useState)?
 * Redux (global):
 *   - Auth state (user, tokens) — needed by navbar, routes, API calls
 *   - Cart state — needed by product page, cart page, navbar icon
 *   - Wishlist state — needed by product cards across multiple pages
 *
 * useState (local):
 *   - Form input values (only the form needs them)
 *   - Modal open/closed (only that component needs it)
 *   - Dropdown open/closed (only that component needs it)
 *
 * ═══════════════════════════════════════════════════════════════
 * configureStore vs createStore
 * ═══════════════════════════════════════════════════════════════
 * configureStore (Redux Toolkit) automatically:
 *   - Adds Redux DevTools Extension support (install the browser extension
 *     to inspect state changes in real time — extremely useful for debugging)
 *   - Adds the thunk middleware (needed for async actions)
 *   - Enables useful development warnings (e.g. "you mutated state directly")
 *
 * The old createStore from classic Redux requires all of this manually.
 * Always use configureStore with Redux Toolkit.
 * ═══════════════════════════════════════════════════════════════
 */

export const store = configureStore({
  reducer: {
    /*
     * Each key here becomes a "slice" of the state object.
     * store.getState() returns:
     * {
     *   auth:     { user: {...}, isLoggedIn: true, ... }
     *   cart:     { items: [...], totalAmount: 4999, ... }
     *   wishlist: { products: [...], productIds: [...] }
     * }
     *
     * useSelector(state => state.auth.user) reads from the auth slice.
     * useSelector(state => state.cart.totalItems) reads from the cart slice.
     */
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },

  /*
   * middleware configuration
   * By default, Redux Toolkit adds the thunk middleware and in development
   * adds the serializability check middleware (warns if you put non-
   * serializable values like Date objects or functions into state).
   *
   * We extend the default middleware — never replace it entirely.
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types in the serializability check
        // (redux-persist or other libraries sometimes dispatch with
        // non-serializable payloads — not relevant here but good practice)
        ignoredActions: ['persist/PERSIST'],
      },
    }),

  /*
   * devTools: true in development (the default) enables Redux DevTools
   * browser extension. Set to false in production to avoid exposing
   * state structure to end users.
   */
  devTools: import.meta.env.DEV,
})