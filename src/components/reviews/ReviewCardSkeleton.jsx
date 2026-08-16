
export default function ReviewCardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-5 w-14 rounded-full bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-200" />
            </div>

            <div className="h-5 w-5 rounded bg-gray-200" />
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}