
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'
import ChatWidget from '../chat/ChatWidget'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Wraps all customer-facing pages with the shared Navbar and Footer.
 * React Router's <Outlet /> is where the matching child route's page
 * component renders — so Navbar appears at the top of EVERY page,
 * Footer at the bottom, and the actual page content in between.
 *
 * CartDrawer is rendered here (outside the page content) so it can
 * slide in from the right over ANY page when the cart icon is clicked —
 * it's a global overlay, not a per-page component.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  )
}