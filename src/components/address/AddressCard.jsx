
import { Star, Pencil, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Reused in TWO places: Checkout page (this part, radio-select mode)
 * and Profile page (Part 15, management mode with edit/delete).
 * The `selectable` and `selected` props toggle between these two modes
 * from the same component — avoids building two nearly-identical
 * address card components.
 */

export default function AddressCard({
  address,
  selectable = false,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <div
      onClick={selectable ? onSelect : undefined}
      className={clsx(
        'relative rounded-xl border-2 p-4 transition-colors',
        selectable && 'cursor-pointer',
        selected ? 'border-[#0078D4] bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
      )}
    >

      {address.defaultIs && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-[#0078D4] bg-blue-100 px-2 py-0.5 rounded-full">
          <Star size={10} fill="currentColor" /> DEFAULT
        </span>
      )}


      <p className="font-semibold text-gray-900 text-sm pr-20">{address.fullName}</p>
      <p className="text-sm text-gray-600 mt-1">{address.phoneNumber}</p>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        {address.addressLine1}
        {address.addressLine2 && `, ${address.addressLine2}`}
        <br />
        {address.city}, {address.state} - {address.pincode}
        <br />
        {address.country}
      </p>


      {(onEdit || onDelete || onSetDefault) && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          {onSetDefault && !address.defaultIs 
          && (
            <button
              onClick={(e) => { e.stopPropagation(); onSetDefault() }}
              className="text-xs font-medium text-[#0078D4] hover:text-[#106EBE]"
            >
              Set as Default
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 ml-auto"
            >
              <Pencil size={12} /> Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
