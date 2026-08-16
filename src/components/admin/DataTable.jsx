/*
 * WHY THIS FILE EXISTS
 * --------------------
 * A minimal, reusable table shell used by AdminProductsPage,
 * AdminOrdersPage, AdminUsersPage (Part 18), AdminReviewsPage (Part 18).
 * Rather than building a full data-grid library integration, we keep
 * this simple: columns definition + rows + optional row click handler.
 *
 * columns: [{ key, label, render? }] — render is an optional function
 * (row) => JSX for custom cell rendering (badges, images, actions).
 */

export default function DataTable({ columns, data, onRowClick, emptyMessage = 'No data found' }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wide whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'hover:bg-gray-800/60 cursor-pointer transition-colors' : ''}
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-gray-300 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
