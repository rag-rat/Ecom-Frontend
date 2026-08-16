import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Sort control — maps friendly labels to the exact sortBy/sortDir
 * query param combinations our ProductSearchRepository (Part 9 backend)
 * expects: sortBy=price&sortDir=asc etc.
 */

const SORT_OPTIONS = [
  { label: 'Newest First', sortBy: 'createdAt', sortDir: 'desc' },
  { label: 'Price: Low to High', sortBy: 'price', sortDir: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', sortDir: 'desc' },
  { label: 'Highest Rated', sortBy: 'averageRating', sortDir: 'desc' },
  { label: 'Name: A to Z', sortBy: 'name', sortDir: 'asc' },
]

export default function SortDropdown({ sortBy, sortDir, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const current = SORT_OPTIONS.find(
    (o) => o.sortBy === sortBy && o.sortDir === sortDir
  ) || SORT_OPTIONS[0]

  
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
      >
        <span className="text-gray-500">Sort:</span>
        <span className="font-medium text-gray-900">{current.label}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-modal border border-gray-100 z-20 py-1 animate-fade-in">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                onChange(option.sortBy, option.sortDir)
                setIsOpen(false)
              }}
              className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {option.label}
              {current.label === option.label && (
                <Check size={14} className="text-[#0078D4]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
