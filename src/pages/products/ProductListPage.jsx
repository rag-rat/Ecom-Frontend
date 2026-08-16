import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, PackageX } from 'lucide-react'
import { productApi } from '../../api/productApi'
import ProductCard from '../../components/products/ProductCard'
import ProductGridSkeleton from '../../components/products/ProductGridSkeleton'
import FilterSidebar from '../../components/products/FilterSidebar'
import SortDropdown from '../../components/products/SortDropdown'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'

/*
 * ═══════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 * ═══════════════════════════════════════════════════════════════
 * The main product discovery page. Combines search (from Navbar),
 * filters (FilterSidebar), sorting (SortDropdown), and pagination
 * into one cohesive experience.
 *
 * ═══════════════════════════════════════════════════════════════
 * WHY useSearchParams INSTEAD OF useState FOR FILTERS?
 * ═══════════════════════════════════════════════════════════════
 * useSearchParams reads/writes the actual URL query string. This means:
 *   1. SHAREABLE — a customer can copy the URL and send it to a friend,
 *      who sees the exact same filtered/sorted results
 *   2. BOOKMARKABLE — customers can bookmark a specific filtered view
 *   3. BACK BUTTON WORKS — browser back/forward navigates through
 *      filter changes naturally, since each filter change is a URL change
 *   4. REFRESH-SAFE — reloading the page keeps the same filters
 *
 * If we used useState instead, all of this would be lost on refresh
 * or if the URL is shared — a plain useState value only exists in memory.
 *
 * ═══════════════════════════════════════════════════════════════
 * HOW THE DATA FLOW WORKS
 * ═══════════════════════════════════════════════════════════════
 *   1. searchParams change (user clicks a filter, types a search, etc.)
 *   2. useEffect detects the change (searchParams is in the dependency array)
 *   3. Build a filters object from searchParams
 *   4. Call productApi.getProducts(filters) — hits Part 9 backend's
 *      dynamic search endpoint with exactly these query params
 *   5. Update local state with results, re-render the grid
 * ═══════════════════════════════════════════════════════════════
 */


export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)


  // Extract current filter state from the URL
  const filters = {
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    // fabric: searchParams.get('fabric') || '',
    // color: searchParams.get('color') || '',
    // occasion: searchParams.get('occasion') || '',
    brand: searchParams.get('brand') || '',
    color: searchParams.get('color') || '',
    // productType: searchParams.get('product_type') || '',
    condition: searchParams.get("condition") || '',
  }



  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortDir = searchParams.get('sortDir') || 'desc'
  const page = parseInt(searchParams.get('page') || '0', 10)


  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await productApi.getProducts({
        ...filters,
        sortBy,
        sortDir,
        page,
        size: 12,
      })
      setProducts(response.data?.content || [])
      setPageInfo({
        totalPages: response.data?.totalPages || 0,
        totalElements: response.data?.totalElements || 0,
      })
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [searchParams])


  useEffect(() => {
    fetchProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [fetchProducts])



  /*
   * updateFilters()
   * Merges new filter values into the URL search params, and
   * IMPORTANTLY resets page back to 0 — changing a filter while on
   * page 3 should take you back to page 1 of the new filtered results,
   * not attempt to show a nonexistent "page 3" of the new smaller set.
   */
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    // Preserve sort when only filters change
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy)
    if (sortDir !== 'desc') params.set('sortDir', sortDir)
    setSearchParams(params)
  }


  const updateSort = (newSortBy, newSortDir) => {
    const params = new URLSearchParams(searchParams)
    params.set('sortBy', newSortBy)
    params.set('sortDir', newSortDir)
    params.set('page', '0')
    setSearchParams(params)
  }


  const updatePage = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }




  return (
    <div className="container-page py-8">

      {/* ── PAGE HEADER ────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">
          {filters.keyword ? `Results for "${filters.keyword}"` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? 'Searching...' : `${pageInfo.totalElements} products found`}
        </p>
      </div>


      <div className="flex gap-8">

        {/* ── FILTER SIDEBAR (desktop static, mobile drawer) ── */}
        <FilterSidebar
          filters={filters}
          onChange={updateFilters}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="ml-auto">
              <SortDropdown sortBy={sortBy} sortDir={sortDir} onChange={updateSort} />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<PackageX size={28} />}
              title="No products found"
              description="Try adjusting your filters or search term"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={pageInfo.totalPages}
                onPageChange={updatePage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
