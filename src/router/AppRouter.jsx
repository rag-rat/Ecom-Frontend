
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import PublicLayout from '../components/layout/PublicLayout'
import AdminLayout from '../components/layout/AdminLayout'
import Spinner from '../components/ui/Spinner'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Single file for routes → All app URLs (/, /login, /products, etc.) are defined in one place, making them easy to manage.
 * React.lazy() → Doesn't load a page until the user actually visits it.
 * Code splitting → Instead of one huge JavaScript file, each page gets its own smaller file (chunk).
 * Benefit → The app loads faster because users download only the pages they need. For example, a customer doesn't download the Admin Dashboard code unless they visit it.
 * Suspense → While a lazy-loaded page is downloading, it shows a loading UI (your full-screen Spinner).
 * Placeholder routes → The routes are already defined, even though the page components haven't been created yet. Later, you'll replace the placeholders with the real pages.
 */



// ── Auth pages (Part 5) ───────────────────────────────────────
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const OAuth2RedirectPage = lazy(() => import('../pages/auth/OAuth2RedirectPage'))


// ── Customer pages ────────────────────────────────────────────
const HomePage = lazy(() => import('../pages/home/HomePage'))                         // Part 7
const ProductListPage = lazy(() => import('../pages/products/ProductListPage'))       // Part 8
const ProductDetailPage = lazy(() => import('../pages/products/ProductDetailPage'))   // Part 9
const CartPage = lazy(() => import('../pages/cart/CartPage'))                         // Part 10
const WishlistPage = lazy(() => import('../pages/wishlist/WishlistPage'))             // Part 11
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'))             // Part 12
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage'))                   // Part 13
const OrderDetailPage = lazy(() => import('../pages/orders/OrderDetailPage'))         // Part 13
const PaymentSuccessPage = lazy(() => import('../pages/payment/PaymentSuccessPage'))  // Part 14
const PaymentFailurePage = lazy(() => import('../pages/payment/PaymentFailurePage'))  // Part 14
const PaymentProcessingPage = lazy(() => import('../pages/payment/PaymentProcessingPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))                // Part 15


// ── Admin pages ───────────────────────────────────────────────
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'))    // Part 17
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage'))      // Part 17
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'))          // Part 17
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'))            // Part 18
const AdminReviewsPage = lazy(() => import('../pages/admin/AdminReviewsPage'))        // Part 18
const AdminChatPage = lazy(() => import('../pages/admin/AdminChatPage'))              // Part 18


// ── Utility pages ─────────────────────────────────────────────
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))



export default function AppRouter() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>

      <Routes>

        {/* ── PUBLIC ROUTES (with Navbar + Footer) ─────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/featured" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />

          {/* Protected customer routes — need login */}
          <Route path="/cart" element={
            <ProtectedRoute><CartPage /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute><WishlistPage /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><CheckoutPage /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><OrdersPage /></ProtectedRoute>
          } />
          <Route path="/orders/:orderId" element={
            <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
          } />
          <Route path="/payment/success" element={
            <ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>
          } />
          <Route path="/payment/failure" element={
            <ProtectedRoute><PaymentFailurePage /></ProtectedRoute>
          } />
          <Route path="/payment/process/:orderId" element={
            <ProtectedRoute><PaymentProcessingPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
        </Route>


        {/* ── AUTH ROUTES (no Navbar/Footer) ───────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />


        {/* ── ADMIN ROUTES (admin layout, admin role required) ─ */}
        <Route path="/admin" element={
          <AdminRoute><AdminLayout /></AdminRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="chat" element={<AdminChatPage />} />
        </Route>


        {/* ── 404 ──────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>

    </Suspense>
  )
}