import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { categoryApi } from "../../api/categoryApi";
import Button from "../ui/Button";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The filter panel — categories, price range, fabric, occasion.
 * Deliberately UNCONTROLLED for text/number inputs (price) with a
 * local "pending" state, applied only on "Apply Filters" click —
 * NOT on every keystroke. Filtering on every keystroke would fire an
 * API call per character typed, which is wasteful and janky. Category/
 * fabric/occasion buttons DO apply immediately since they're single clicks,
 * not continuous typing.
 *
 * mobileOpen/onMobileClose props support a slide-in drawer on mobile —
 * on desktop this renders inline as a static sidebar.
 */

// const FABRICS = ["Silk", "Cotton", "Georgette", "Chiffon", "Linen", "Crepe"];
// const OCCASIONS = ["Wedding", "Casual", "Festive", "Party", "Office"];

const BRANDS = ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Samsung"];
const PRODUCT_TYPES = ["Laptop", "Smartphone", "Tablet", "Desktop PCs", "Keyboard", "Mouse", "Headphone", "Gaming"];
const COLORS = ["Black", "White", "Silver", "Blue", "Gray", "Gold"];
const CONDITIONS = ["New", "Refurbished", "Open Box"];

export default function FilterSidebar({
  filters,
  onChange,
  mobileOpen,
  onMobileClose,
}) {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
  });

  useEffect(() => {
    categoryApi.getCategories().then((res) => setCategories(res.data || []));
  }, []);

  // Keep local price inputs in sync if filters are cleared externally
  useEffect(() => {
    setPriceRange({
      minPrice: filters.minPrice || "",
      maxPrice: filters.maxPrice || "",
    });
  }, [filters.minPrice, filters.maxPrice]);

  const applyPriceRange = () => {
    onChange({
      ...filters,
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
    });
  };


  const toggleValue = (key, value) => {
    onChange({ ...filters, [key]: filters[key] === value ? "" : value });
  };

  const clearAll = () => {
    setPriceRange({ minPrice: "", maxPrice: "" });
    onChange({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const content = (
    <div className="space-y-6">
      {/* Header with clear button */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-[#0078D4] hover:text-[#106EBE] font-medium"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>


      {/* Category */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">Category</p>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                checked={filters.categoryId === cat.id}
                onChange={() => toggleValue("categoryId", cat.id)}
                className="w-4 h-4 text-[#0078D4] focus:ring-[#0078D4]"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>


      {/* Price Range */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">Price Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.minPrice}
            onChange={(e) =>
              setPriceRange({ ...priceRange, minPrice: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.maxPrice}
            onChange={(e) =>
              setPriceRange({ ...priceRange, maxPrice: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
          />
        </div>
        <button
          onClick={applyPriceRange}
          className="mt-2 w-full text-xs font-medium text-[#0078D4] border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 transition-colors"
        >
          Apply
        </button>
      </div>


      {/* Fabric */}
      {/* Brands */}
      <div>
        {/* <p className="text-sm font-semibold text-gray-800 mb-3">Fabric</p> */}

        <p className="text-sm font-semibold text-gray-800 mb-3"> Brands </p>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => toggleValue("brand", brand)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filters.brand === brand
                  ? "bg-[#0078D4] text-white border-[#0078D4]"
                  : "text-gray-600 border-gray-300 hover:border-[#0078D4]"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>


      {/* Occasion */}
      {/* PRODUCT_TYPES */}
      {/* <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">Occasion</p>

        <p className="text-sm font-semibold text-gray-800 mb-3">
          Product Types
        </p>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((product_type) => (
            <button
              key={product_type}
              onClick={() => toggleValue("product_type", product_type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filters.product_type === product_type
                  ? "bg-[#0078D4] text-white border-[#0078D4]"
                  : "text-gray-600 border-gray-300 hover:border-[#0078D4]"
              }`}
            >
              {product_type}
            </button>
          ))}
        </div>
      </div> */}


      {/* Color */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => toggleValue("color", color)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filters.color === color
                  ? "bg-[#0078D4] text-white border-[#0078D4]"
                  : "text-gray-600 border-gray-300 hover:border-[#0078D4]"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>


      {/* Condition */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">Condition</p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((condition) => (
            <button
              key={condition}
              onClick={() => toggleValue("condition", condition)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filters.condition === condition
                  ? "bg-[#0078D4] text-white border-[#0078D4]"
                  : "text-gray-600 border-gray-300 hover:border-[#0078D4]"
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  // // Desktop — static sidebar
  // if (!mobileOpen && mobileOpen !== false) {
  //   return (
  //     <aside className="hidden lg:block w-64 flex-shrink-0">
  //       <div className="sticky top-24 bg-white rounded-xl border border-gray-100 p-5">
  //         {content}
  //       </div>
  //     </aside>
  //   )
  // }

  //     {mobileOpen && (
  //     <div className="lg:hidden fixed inset-0 z-50">
  //       <div
  //         className="absolute inset-0 bg-black/40"
  //         onClick={onMobileClose}
  //       />
  //       <div className="absolute left-0 inset-y-0 w-80 max-w-[85vw] bg-white p-5 overflow-y-auto animate-slide-in-right">
  //         <div className="flex items-center justify-between mb-4">
  //           {/* <span className="font-display font-semibold">Filters</span> */}
  //           <button onClick={onMobileClose} className="p-2 text-gray-400 ml-auto">
  //             <X size={30} />
  //           </button>
  //         </div>
  //         {content}
  //         <Button
  //           variant="primary"
  //           size="full"
  //           className="mt-6"
  //           onClick={onMobileClose}
  //         >
  //           Show Results
  //         </Button>
  //       </div>
  //     </div>
  //   )}


  return (
    <>
      {!mobileOpen && mobileOpen == false && (
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-[160px] max-h-[calc(100vh-180px)] overflow-y-auto bg-white rounded-xl border border-gray-100 p-5">
            {content}
          </div>
        </aside>
      )}


      {/* // Mobile — slide-in drawer */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />


          {/* Filter Drawer */}
          <aside className="absolute left-0 inset-y-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto animate-slide-in-right">
            {/* Close Button */}
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Drawer Content */}
            <div className="p-5 pt-16">
              {content}

              <Button
                variant="primary"
                size="full"
                className="mt-6"
                onClick={onMobileClose}
              >
                Show Results
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

