/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Loading skeleton shown WHILE product data is being fetched — used
 * on homepage featured products AND the full product listing page.
 * A skeleton (grey animated placeholder shapes matching the real
 * card's layout) feels far more polished than a blank space or spinner
 * for grid content — this is standard modern e-commerce UX.
 */

export default function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
          <div className="aspect-[3/4] bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-2.5 bg-gray-200 rounded w-1/3" />
            <div className="h-3.5 bg-gray-200 rounded w-full" />
            <div className="h-3.5 bg-gray-200 rounded w-2/3" />
            <div className="h-5 bg-gray-200 rounded w-1/2 mt-3" />
          </div>
        </div>
      ))}
    </div>
  )
}