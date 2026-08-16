import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Reusable pagination control — used by product listing, order history,
 * admin tables. Backend's PageResponse (Part 3 backend common module)
 * gives us pageNumber (0-based), totalPages, first, last — this
 * component maps those directly to page buttons.
 *
 * We show a SLIDING WINDOW of page numbers (not all pages if there
 * are 50+) — e.g. for page 12 of 40: « 10 11 [12] 13 14 »
 * This keeps the control usable regardless of how many total pages exist.
 */

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build a sliding window of up to 5 page numbers centered on current
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const start = Math.max(0, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={(e) => {
          e.currentTarget.blur();
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 0}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages[0] > 0 && (
        <>
          <PageButton page={0} current={currentPage} onClick={onPageChange} />
          {pages[0] > 1 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}

      {pages.map((page) => (
        <PageButton
          key={page}
          page={page}
          current={currentPage}
          onClick={onPageChange}
        />
      ))}

      {pages[pages.length - 1] < totalPages - 1 && (
        <>
          {pages[pages.length - 1] < totalPages - 2 && (
            <span className="px-1 text-gray-400">…</span>
          )}
          <PageButton
            page={totalPages - 1}
            current={currentPage}
            onClick={onPageChange}
          />
        </>
      )}

      <button
        onClick={(e) => {
          e.currentTarget.blur();
          onPageChange(currentPage + 1);
        }}
        disabled={currentPage === totalPages - 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

function PageButton({ page, current, onClick }) {
  return (
    <button
      onClick={() => onClick(page)}
      className={clsx(
        "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
        page === current
          ? "bg-[#0078D4] text-white"
          : "border border-gray-200 text-gray-600 hover:bg-gray-50",
      )}
    >
      {page + 1}
    </button>
  );
}
