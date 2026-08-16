import { useState } from "react";
import { clsx } from "clsx";
import { ShoppingBag } from "lucide-react";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Product detail image display — a large primary image with a
 * thumbnail strip below/beside it. Clicking a thumbnail swaps the
 * main image. Matches the `images` array shape from backend's
 * Product entity (Part 9 backend): [{ url, publicId, isPrimary }]
 */

export default function ImageGallery({ images = [] }) {
  const sortedImages = [...images].sort(
    (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0),
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
        <ShoppingBag size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      {/* Thumbnail strip */}
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px]">
        {sortedImages.map((img, i) => (
          <button
            key={img.publicId || i}
            onClick={() => setActiveIndex(i)}
            className={clsx(
              "flex-shrink-0 w-16 h-20 sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors",
              i === activeIndex
                ? "border-[#0078D4]"
                : "border-transparent hover:border-gray-300",
            )}
          >
            <img
              src={img.url}
              alt={`View ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 aspect-[5/6] rounded-xl overflow-hidden bg-gray-50 group">
        <img
          src={sortedImages[activeIndex].url}
          alt="Product"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{
            transform: "translateY(-75px)",
          }}
        />
      </div>
    </div>
  );
}
