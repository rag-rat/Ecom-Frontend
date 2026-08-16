
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Individual category tile in the homepage's category showcase grid.
 * Links to the product listing page pre-filtered by categoryId —
 * matches exactly how ProductListPage (Part 8) reads the categoryId
 * query param.
 */

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?categoryId=${category.id}`}
      className="group relative aspect-square rounded-xl overflow-hidden bg-gray-50 card-hover"
    >
      {category.imageUrl ? (
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300">
          <Package size={40} />
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-display font-semibold text-sm md:text-base">
          {category.name}
        </h3>
      </div>
    </Link>
  )
}
