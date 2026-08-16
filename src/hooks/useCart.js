import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import toast from "react-hot-toast";

import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartLoading,
  selectIsCartOpen,
  selectIsInCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
  fetchCart,
} from "../store/slices/cartSlice";

import { selectIsLoggedIn } from "../store/slices/authSlice";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Same philosophy as useAuth — bundles cart state and actions.
 * Also handles the "must be logged in" guard so every component
 * using useCart doesn't need to implement this check itself.
 */

export default function useCart() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const items = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);
  const totalItems = useSelector(selectCartItemCount);
  const loading = useSelector(selectCartLoading);
  const isCartOpen = useSelector(selectIsCartOpen);

  const handleAddToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isLoggedIn) {
        toast.error("Please login to add items to cart");
        return false;
      }

      const result = await dispatch(addToCart({ productId, quantity }));

      if (addToCart.fulfilled.match(result)) {
        toast.success("Added to cart!");
        return true;
      } else {
        toast.error(result.payload || "Failed to add to cart");
        return false;
      }
    },
    [dispatch, isLoggedIn],
  );

  const handleUpdateQuantity = useCallback(
    async (productId, quantity) => {
      const result = await dispatch(
        updateCartQuantity({ productId, quantity }),
      );

      if (!updateCartQuantity.fulfilled.match(result)) {
        toast.error(result.payload || "Failed to update quantity");
      }
    },
    [dispatch],
  );

  const handleRemoveItem = useCallback(
    async (productId) => {
      const result = await dispatch(removeFromCart(productId));

      if (removeFromCart.fulfilled.match(result)) {
        toast.success("Item removed from cart");
      }
    },
    [dispatch],
  );

  const handleClearCart = useCallback(async () => {
    await dispatch(clearCart());
  }, [dispatch]);

  const isInCart = useCallback(
    (productId) => items.some((item) => item.productId === productId),
    [items],
  );


  const refreshCart = useCallback(async () => {
    await dispatch(fetchCart());
  }, [dispatch]);


  return {
    items,
    totalAmount,
    totalItems,
    loading,
    isCartOpen,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
    isInCart,
    refreshCart,
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
    toggleCart: () => dispatch(toggleCart()),
  };
}
