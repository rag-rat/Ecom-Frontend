
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import ProductCard from '../../components/products/ProductCard'
import ProductGridSkeleton from '../../components/products/ProductGridSkeleton'
import HeroCarousel from '../../components/home/HeroCarousel'
import CategoryCard from '../../components/home/CategoryCard'
import Button from '../../components/ui/Button'


/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The customer landing page. Fetches TWO independent pieces of data
 * on mount — categories (for the showcase grid) and featured products
 * (for the "You may like" section) — using two separate useEffect-driven
 * fetches rather than one combined call, since these come from
 * genuinely different backend endpoints (Part 8 and Part 9 backend).
 *
 * Each section has its OWN loading state so the categories can render
 * as soon as they arrive without waiting for the (potentially slower)
 * featured products call to also finish — this is a deliberate UX
 * choice: show content progressively rather than blocking the whole
 * page behind one combined spinner.
 */


export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredLoading, setFeaturedLoading] = useState(true)

  useEffect(() => {
    categoryApi.getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => {})
      .finally(() => setCategoriesLoading(false))

    productApi.getFeaturedProducts(0, 12)
      .then((res) => setFeaturedProducts(res.data?.content || []))
      .catch(() => {})
      .finally(() => setFeaturedLoading(false))
  }, [])


  return (
    <div>
      {/* ── HERO CAROUSEL ────────────────────────────────────── */}
      <HeroCarousel />


      {/* ── TRUST BADGES STRIP ───────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-page py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹2,000' },
              { icon: ShieldCheck, label: 'Secure Payment', sub: '100% protected checkout' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '7-day return policy' },
              { icon: Headphones, label: '24/7 Support', sub: 'Live chat assistance' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#0078D4]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{label}</p>
                  <p className="text-xs text-gray-500 truncate">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CATEGORY SHOWCASE ────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-page">
          <div className="text-center mb-10">
            <p className="text-[#0078D4] font-medium text-sm mb-2">SHOP BY CATEGORY</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">
              Explore Our Collections
            </h2>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#0078D4] font-medium text-sm mb-2">HANDPICKED FOR YOU</p>
              <h2 className="text-3xl font-display font-bold text-gray-900">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products/featured"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0078D4] hover:text-[#106EBE]"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {featuredLoading ? (
            <ProductGridSkeleton count={8} />
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-gray-400 py-12">
              No featured products available right now.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Link to="/products?featured=true">
              <Button variant="secondary" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* ── WHOLESALE CTA BANNER ─────────────────────────────── */}
      <section className="section-padding">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#004578] to-gray-900 px-8 py-14 md:py-20 text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                Buying in Bulk? Get Wholesale Pricing
              </h2>
              <p className="text-blue-100 text-sm mb-8">
                Retailers and business owners — contact us for special
                wholesale rates on bulk tech orders.
              </p>
              <a href="mailto:wholesale@ecomstore.com">
                <Button variant="secondary" size="lg" className="bg-white">
                  Contact for Wholesale
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}
