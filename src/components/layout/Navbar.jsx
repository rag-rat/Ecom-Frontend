// import { useState, useEffect } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import {
//   ShoppingCart, Heart, User, Search, Menu, X,
//   LogOut, Package, Settings, ChevronDown
// } from 'lucide-react'
// import { selectIsLoggedIn, selectUser, selectIsAdmin } from '../../store/slices/authSlice'
// import { selectCartItemCount, toggleCart } from '../../store/slices/cartSlice'
// import { logout } from '../../store/slices/authSlice'
// import { fetchCart } from '../../store/slices/cartSlice'
// import { fetchWishlist } from '../../store/slices/wishlistSlice'
// import { selectWishlistProducts } from '../../store/slices/wishlistSlice'
// import toast from 'react-hot-toast'

// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * The Navbar is the most important UI component — it's present on
//  * every customer-facing page and contains:
//  *   - Brand logo and name
//  *   - Search bar (triggers product search on Part 8's page)
//  *   - Wishlist icon with count badge
//  *   - Cart icon with item count badge (opens CartDrawer)
//  *   - User menu (login/register links OR profile dropdown)
//  *   - Mobile hamburger menu
//  *
//  * IMPORTANT SIDE EFFECTS:
//  * When the user logs in (isLoggedIn changes to true), we immediately
//  * fetch their cart and wishlist so the badges show accurate counts.
//  */

// export default function Navbar() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const location = useLocation()

//   const isLoggedIn = useSelector(selectIsLoggedIn)
//   const user = useSelector(selectUser)
//   const isAdmin = useSelector(selectIsAdmin)
//   const cartItemCount = useSelector(selectCartItemCount)
//   const wishlistProducts = useSelector(selectWishlistProducts)

//   const [searchQuery, setSearchQuery] = useState('')
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
//   const [isScrolled, setIsScrolled] = useState(false)

//   // Add shadow when user scrolls down
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10)
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   // Fetch cart and wishlist when user logs in
//   useEffect(() => {
//     if (isLoggedIn) {
//       dispatch(fetchCart())
//       dispatch(fetchWishlist())
//     }
//   }, [isLoggedIn, dispatch])

//   // Close mobile menu on route change
//   useEffect(() => {
//     setIsMobileMenuOpen(false)
//     setIsUserMenuOpen(false)
//   }, [location])

//   const handleSearch = (e) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
//       setSearchQuery('')
//     }
//   }

//   const handleLogout = async () => {
//     await dispatch(logout())
//     navigate('/login')
//     toast.success('Logged out successfully')
//   }

//   return (
//     <header className={`
//       sticky top-0 z-40 bg-white transition-shadow duration-300
//       ${isScrolled ? 'shadow-md' : 'shadow-sm'}
//     `}>

//       {/* ── TOP BAR ──────────────────────────────────────────── */}
//       <div className="bg-brand-700 text-white text-xs py-1.5 text-center">
//         Free shipping on orders above ₹2,000 · Wholesale prices available
//       </div>

//       {/* ── MAIN NAVBAR ──────────────────────────────────────── */}
//       <div className="container-page">
//         <div className="flex items-center gap-4 h-16">

//           {/* ── LOGO ───────────────────────────────────────── */}
//           <Link to="/" className="flex items-center gap-2 flex-shrink-0">
//             <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-display font-bold text-lg">LS</span>
//             </div>
//             <div className="hidden sm:block">
//               <p className="font-display font-bold text-gray-900 leading-tight text-lg">
//                 Ecom Store
//               </p>
//               <p className="text-xs text-gray-500 leading-tight">
//                 Premium Collections
//               </p>
//             </div>
//           </Link>

//           {/* ── SEARCH BAR ─────────────────────────────────── */}
//           <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 // placeholder="Search sarees, fabrics, occasions..."
//                 placeholder="Search Products..."
//                 className="
//                   w-full pl-4 pr-12 py-2.5 rounded-full border border-gray-300
//                   text-sm bg-warm-50 focus:bg-white
//                   focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
//                   transition-all duration-200
//                 "
//               />
//               <button
//                 type="submit"
//                 className="
//                   absolute right-1 top-1/2 -translate-y-1/2
//                   w-8 h-8 rounded-full bg-brand-600 text-white
//                   flex items-center justify-center
//                   hover:bg-brand-700 transition-colors
//                 "
//               >
//                 <Search size={14} />
//               </button>
//             </div>
//           </form>

//           {/* ── RIGHT ICONS ────────────────────────────────── */}
//           <div className="flex items-center gap-1 ml-auto">

//             {/* Wishlist */}
//             {isLoggedIn && (
//               <Link
//                 to="/wishlist"
//                 className="relative p-2.5 rounded-lg text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
//               >
//                 <Heart size={22} />
//                 {wishlistProducts.length > 0 && (
//                   <span className="
//                     absolute -top-0.5 -right-0.5 w-4 h-4
//                     bg-saree-600 text-white text-[10px] font-bold
//                     rounded-full flex items-center justify-center
//                   ">
//                     {wishlistProducts.length > 9 ? '9+' : wishlistProducts.length}
//                   </span>
//                 )}
//               </Link>
//             )}

//             {/* Cart */}
//             <button
//               onClick={() => dispatch(toggleCart())}
//               className="relative p-2.5 rounded-lg text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
//             >
//               <ShoppingCart size={22} />
//               {cartItemCount > 0 && (
//                 <span className="
//                   absolute -top-0.5 -right-0.5 w-5 h-5
//                   bg-brand-600 text-white text-[10px] font-bold
//                   rounded-full flex items-center justify-center
//                 ">
//                   {cartItemCount > 99 ? '99+' : cartItemCount}
//                 </span>
//               )}
//             </button>

//             {/* User menu */}
//             {isLoggedIn ? (
//               <div className="relative">

//                 <button
//                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                   className="flex items-center gap-1.5 pl-2 pr-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
//                     <span className="text-brand-700 font-semibold text-sm">
//                       {user?.firstName?.charAt(0)?.toUpperCase()}
//                     </span>
//                   </div>
//                   <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
//                     {user?.firstName}
//                   </span>
//                   <ChevronDown size={14} className="hidden lg:block text-gray-400" />
//                 </button>

//                 {/* Dropdown */}
//                 {isUserMenuOpen && (
//                   <>
//                     {/* Backdrop */}
//                     <div
//                       className="fixed inset-0 z-10"
//                       onClick={() => setIsUserMenuOpen(false)}
//                     />

//                     <div className="
//                       absolute right-0 top-full mt-2 w-52 z-20
//                       bg-white rounded-xl shadow-modal border border-gray-100
//                       animate-fade-in py-1
//                     ">
//                       {/* User info */}
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <p className="font-medium text-gray-900 text-sm truncate">
//                           {user?.firstName} {user?.lastName}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {user?.email}
//                         </p>
//                       </div>

//                       {/* Menu items */}
//                       <Link
//                         to="/profile"
//                         className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-warm-50 hover:text-brand-700 transition-colors"
//                       >
//                         <User size={16} /> My Profile
//                       </Link>

//                       <Link
//                         to="/orders"
//                         className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-warm-50 hover:text-brand-700 transition-colors"
//                       >
//                         <Package size={16} /> My Orders
//                       </Link>

//                       {/* Admin link — only shown to admins */}
//                       {isAdmin && (
//                         <Link
//                           to="/admin/dashboard"
//                           className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-700 hover:bg-brand-50 transition-colors"
//                         >
//                           <Settings size={16} /> Admin Panel
//                         </Link>
//                       )}

//                       <div className="border-t border-gray-100 mt-1 pt-1">
//                         <button
//                           onClick={handleLogout}
//                           className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                         >
//                           <LogOut size={16} /> Logout
//                         </button>
//                       </div>

//                     </div>

//                   </>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <Link
//                   to="/login"
//                   className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors px-3 py-2 rounded-lg hover:bg-brand-50"
//                 >
//                   Login
//                 </Link>

//                 <Link
//                   to="/register"
//                   className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}

//             {/* Mobile menu toggle */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
//             >
//               {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>

//           </div>
//         </div>

//         {/* ── CATEGORY NAV ─────────────────────────────────── */}
//         <nav className="hidden md:flex items-center gap-1 h-10 border-t border-gray-100 overflow-x-auto">
//           {[
//             // { label: 'All Sarees', path: '/products' },
//             // { label: 'Silk Sarees', path: '/products?fabric=Silk' },
//             // { label: 'Cotton Sarees', path: '/products?fabric=Cotton' },
//             // { label: 'Wedding', path: '/products?occasion=Wedding' },
//             // { label: 'Casual', path: '/products?occasion=Casual' },
//             // { label: 'Designer', path: '/products?occasion=Festive' },
//             // { label: 'Featured', path: '/products?featured=true' },

//             { label: 'All Products', path: '/products' },
//             { label: 'Laptops', path: '/products?category=Laptops' },
//             { label: 'Smartphones', path: '/products?category=Smartphones' },
//             { label: 'Headphones', path: '/products?category=Headphones' },
//             { label: 'Keyboards', path: '/products?category=Keyboards' },
//             { label: 'Gaming', path: '/products?type=Gaming' },
//             { label: 'Featured', path: '/products?featured=true' },
//           ].map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className="
//                 flex-shrink-0 px-3 py-1 text-sm text-gray-600
//                 hover:text-brand-700 hover:bg-brand-50
//                 rounded-md transition-colors whitespace-nowrap
//               "
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* ── MOBILE MENU ──────────────────────────────────────── */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden border-t border-gray-100 bg-white animate-slide-up">

//           {/* Mobile search */}
//           <div className="px-4 pt-3 pb-2">
//             <form onSubmit={handleSearch}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search Products..."
//                   className="w-full pl-4 pr-12 py-2.5 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
//                 />
//                 <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center">
//                   <Search size={14} />
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Mobile nav links */}
//           <div className="px-4 pb-4 flex flex-col gap-1">
//             {[
//             //   { label: 'Home', path: '/' },
//             //   { label: 'All Sarees', path: '/products' },
//             //   { label: 'Silk Sarees', path: '/products?fabric=Silk' },
//             //   { label: 'Cotton Sarees', path: '/products?fabric=Cotton' },

//             { label: 'Home', path: '/' },
//             { label: 'All Products', path: '/products' },
//             { label: 'Laptops', path: '/products?category=Laptops' },
//             { label: 'Smartphones', path: '/products?category=Smartphones' },
//             ].map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className="py-2.5 px-3 text-sm text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  Settings,
  ChevronDown,
} from "lucide-react";
import {
  selectIsLoggedIn,
  selectUser,
  selectIsAdmin,
} from "../../store/slices/authSlice";
import { selectCartItemCount, toggleCart } from "../../store/slices/cartSlice";
import { logout } from "../../store/slices/authSlice";
import { fetchCart } from "../../store/slices/cartSlice";
import { fetchWishlist } from "../../store/slices/wishlistSlice";
import { selectWishlistProducts } from "../../store/slices/wishlistSlice";
import toast from "react-hot-toast";
import { categoryApi } from "../../api/categoryApi";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The Navbar is the most important UI component — it's present on
 * every customer-facing page and contains:
 *   - Brand logo and name
 *   - Search bar (triggers product search on Part 8's page)
 *   - Wishlist icon with count badge
 *   - Cart icon with item count badge (opens CartDrawer)
 *   - User menu (login/register links OR profile dropdown)
 *   - Mobile hamburger menu
 *
 * IMPORTANT SIDE EFFECTS:
 * When the user logs in (isLoggedIn changes to true), we immediately
 * fetch their cart and wishlist so the badges show accurate counts.
 */

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const cartItemCount = useSelector(selectCartItemCount);
  const wishlistProducts = useSelector(selectWishlistProducts);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);

  const isWishlistPage = location.pathname === "/wishlist";
  const isCartPage = location.pathname === "/cart";

  // fetching the categories when the component load for the first time
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        // console.log(res);
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const navCategories = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.name] = category.id;
      return acc;
    }, {});
  }, [categories]);

  // console.log(categories);

  // Add shadow when user scrolls down
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch cart and wishlist when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isLoggedIn, dispatch]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <header
      className={`
      sticky top-0 z-40 bg-white transition-shadow duration-300
      ${isScrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.06)]" : ""}
    `}
    >
      {/* ── TOP BAR ──────────────────────────────────────────── */}
      <div className="bg-gray-900 text-gray-300 text-[11px] tracking-wide py-2 text-center">
        Free shipping on orders above ₹2,000 · Wholesale prices available
      </div>

      {/* ── MAIN NAVBAR ──────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-8 lg:px-10">
        <div className="flex items-center gap-6 h-20">
          {/* ── LOGO ───────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white font-sans font-bold text-base tracking-tight">
                LS
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="font-sans font-semibold text-gray-900 leading-tight text-lg tracking-tight">
                Ecom Store
              </p>
              <p className="text-[11px] text-gray-400 leading-tight tracking-wide uppercase">
                Premium Collections
              </p>
            </div>
          </Link>

          {/* ── SEARCH BAR ─────────────────────────────────── */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl hidden md:flex"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // placeholder="Search sarees, fabrics, occasions..."
                placeholder="Search Products..."
                className="
        w-full pl-5 pr-14 py-3.5 rounded-full border border-gray-200
        text-[14px] bg-gray-50 focus:bg-white
        placeholder:text-gray-500
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        hover:border-gray-300
        focus:outline-none focus:ring-2 focus:ring-[#6d6e6b] focus:border-transparent
        transition-all duration-200
      "
              />
              <button
                type="submit"
                className="
        absolute right-2 top-1/2 -translate-y-1/2
        w-9 h-9 rounded-full bg-[#0078D4] text-white
        flex items-center justify-center
        hover:bg-[#106EBE] transition-colors
      "
              >
                <Search size={15} strokeWidth={2} />
              </button>
            </div>
          </form>

          {/* ── RIGHT ICONS ────────────────────────────────── */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Wishlist */}
            {isLoggedIn && (
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Heart
                  size={20}
                  strokeWidth={1.75}
                  // fill={isWishlistPage ? "#DC2626" : "none"}
                  // color={isWishlistPage ? "#DC2626" : "currentColor"}
                />
                {wishlistProducts.length > 0 && (
                  <span
                    className="
                    absolute -top-0.5 -right-0.5 w-4 h-4
                    bg-gray-900 text-white text-[10px] font-semibold
                    rounded-full flex items-center justify-center
                  "
                  >
                    {wishlistProducts.length > 9
                      ? "9+"
                      : wishlistProducts.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart
                size={20}
                strokeWidth={1.75}
                fill={isCartPage ? "currentColor" : "none"}
                className={isCartPage ? "text-black" : ""}
              />

              {cartItemCount > 0 && (
                <span
                  className="
        absolute -top-0.5 -right-0.5 w-5 h-5
        bg-[#0078D4] text-white text-[10px] font-semibold
        rounded-full flex items-center justify-center
      "
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>

            {/* User menu */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
                    {user?.firstName}
                  </span>
                  <ChevronDown
                    size={14}
                    className="hidden lg:block text-gray-400"
                  />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />

                    <div
                      className="
                      absolute right-0 top-full mt-2 w-56 z-20
                      bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100
                      animate-fade-in py-1
                    "
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu items */}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <User size={16} strokeWidth={1.75} /> My Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <Package size={16} strokeWidth={1.75} /> My Orders
                      </Link>

                      {/* Admin link — only shown to admins */}
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#0078D4] font-medium hover:bg-blue-50 transition-colors"
                        >
                          <Settings size={16} strokeWidth={1.75} /> Admin Panel
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} strokeWidth={1.75} /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-sm font-medium bg-[#0078D4] text-white px-5 py-2.5 rounded-full hover:bg-[#106EBE] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={22} strokeWidth={1.75} />
              ) : (
                <Menu size={22} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        {/* ── CATEGORY NAV ─────────────────────────────────── */}
        {/* ── CATEGORY NAV ─────────────────────────────────── */}

        <nav className="hidden md:flex items-center gap-8 h-11 border-t border-gray-100 overflow-x-auto">
          {[
            { label: "All Products", path: "/products" },
            {
              label: "Laptops",
              path: `/products?categoryId=${navCategories.Laptops}`,
            },
            {
              label: "Smartphones",
              path: `/products?categoryId=${navCategories.Smartphones}`,
            },
            {
              label: "Tablets",
              path: `/products?categoryId=${navCategories.Tablets}`,
            },
            {
              label: "Headphones",
              path: `/products?categoryId=${navCategories.Headphones}`,
            },
            {
              label: "Gaming",
              path: `/products?categoryId=${navCategories.Gaming}`,
            },
            // { label: "Featured", path: "/products?featured=true" },
            {
              label: "Keyboards",
              path: `/products?categoryId=${navCategories.Keyboards}`,
            },
          ].map((item) => {
            const isCategoryLink = item.path.includes("categoryId=undefined");
            return (
              <Link
                key={item.label}
                to={isCategoryLink ? "#" : item.path}
                onClick={(e) => isCategoryLink && e.preventDefault()}
                className={`
          flex-shrink-0 relative py-1 text-sm transition-colors whitespace-nowrap
          after:content-[''] after:absolute after:left-0 after:-bottom-[1px]
          after:w-0 after:h-[1.5px] after:bg-[#0078D4] after:transition-all after:duration-200
          ${
            isCategoryLink
              ? "text-gray-300 cursor-default"
              : "text-gray-500 hover:text-gray-900 hover:after:w-full"
          }
        `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-up">
          {/* Mobile search */}
          <div className="px-4 pt-3 pb-2">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Products..."
                  className="w-full pl-4 pr-12 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0078D4] text-white flex items-center justify-center"
                >
                  <Search size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Mobile nav links */}
          <div className="px-4 pb-4 flex flex-col gap-1">
            {[
              //   { label: 'Home', path: '/' },
              //   { label: 'All Sarees', path: '/products' },
              //   { label: 'Silk Sarees', path: '/products?fabric=Silk' },
              //   { label: 'Cotton Sarees', path: '/products?fabric=Cotton' },

              { label: "Home", path: "/" },
              { label: "All Products", path: "/products" },
              {
                label: "Laptops",
                path: `/products?categoryId=${navCategories.Laptops}`,
              },
              {
                label: "Smartphones",
                path: `/products?categoryId=${navCategories.Smartphones}`,
              },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="py-2.5 px-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
