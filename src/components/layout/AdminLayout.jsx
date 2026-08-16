// import { useState } from 'react'
// import { NavLink, Outlet, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   LayoutDashboard, Package, ShoppingBag, Users,
//   Star, MessageSquare, LogOut, Menu, X, ChevronRight
// } from 'lucide-react'
// import { logout } from '../../store/slices/authSlice'
// import { selectUser } from '../../store/slices/authSlice'
// import toast from 'react-hot-toast'

// /*
//  * WHY THIS FILE EXISTS
//  * --------------------
//  * A completely different layout from PublicLayout — the admin panel
//  * has a sidebar navigation instead of a top navbar, and no footer.
//  * Separating admin and customer layouts keeps both clean and maintainable.
//  *
//  * Uses React Router's <NavLink> (not <Link>) for the sidebar items —
//  * NavLink automatically applies an "active" class when its path matches
//  * the current URL, so the current section is visually highlighted
//  * without any manual activeTab state management.
//  */

// const navItems = [
//   { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { path: '/admin/products', icon: Package, label: 'Products' },
//   { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
//   { path: '/admin/users', icon: Users, label: 'Customers' },
//   { path: '/admin/reviews', icon: Star, label: 'Reviews' },
//   { path: '/admin/chat', icon: MessageSquare, label: 'Support Chat' },
// ]

// export default function AdminLayout() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const user = useSelector(selectUser)
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const handleLogout = async () => {
//     await dispatch(logout())
//     navigate('/login')
//     toast.success('Logged out')
//   }

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full">

//       {/* Logo */}
//       <div className="px-6 py-5 border-b border-gray-100">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold font-display">LS</span>
//           </div>
//           <div>
//             <p className="font-display font-bold text-gray-900 text-sm">Ecom Store</p>
//             <p className="text-[10px] text-brand-600 font-medium">Admin Panel</p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//         {navItems.map(({ path, icon: Icon, label }) => (
//           <NavLink
//             key={path}
//             to={path}
//             onClick={() => setSidebarOpen(false)}
//             className={({ isActive }) => `
//               flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
//               transition-colors duration-150
//               ${isActive
//                 ? 'bg-brand-50 text-brand-700'
//                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//               }
//             `}
//           >
//             <Icon size={18} />
//             {label}
//             <ChevronRight size={14} className="ml-auto opacity-40" />
//           </NavLink>
//         ))}
//       </nav>

//       {/* User + Logout */}
//       <div className="px-3 py-4 border-t border-gray-100">
//         <div className="flex items-center gap-3 px-3 py-2 mb-2">
//           <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
//             <span className="text-brand-700 font-semibold text-sm">
//               {user?.firstName?.charAt(0)}
//             </span>
//           </div>
//           <div className="min-w-0">
//             <p className="text-sm font-medium text-gray-900 truncate">
//               {user?.firstName} {user?.lastName}
//             </p>
//             <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//           </div>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
//         >
//           <LogOut size={18} /> Logout
//         </button>
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen flex bg-warm-50">

//       {/* ── DESKTOP SIDEBAR ──────────────────────────────────── */}
//       <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
//         <SidebarContent />
//       </aside>

//       {/* ── MOBILE SIDEBAR OVERLAY ───────────────────────────── */}
//       {sidebarOpen && (
//         <div className="lg:hidden fixed inset-0 z-40">
//           <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
//           <aside className="absolute left-0 inset-y-0 w-64 bg-white z-50 animate-slide-in-right">
//             <SidebarContent />
//           </aside>
//         </div>
//       )}

//       {/* ── MAIN CONTENT ─────────────────────────────────────── */}
//       <div className="lg:ml-60 flex-1 flex flex-col min-h-screen">

//         {/* Mobile topbar */}
//         <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
//           >
//             <Menu size={20} />
//           </button>
//           <span className="font-display font-semibold text-gray-900">Admin Panel</span>
//         </header>

//         <main className="flex-1 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  User,
  Store,
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import { selectUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * A completely different layout from PublicLayout — the admin panel
 * has a sidebar navigation instead of a top navbar, and no footer.
 * Separating admin and customer layouts keeps both clean and maintainable.
 *
 * Uses React Router's <NavLink> (not <Link>) for the sidebar items —
 * NavLink automatically applies an "active" class when its path matches
 * the current URL, so the current section is visually highlighted
 * without any manual activeTab state management.
 */

const navItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/products", icon: Package, label: "Products" },
  { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/admin/users", icon: Users, label: "Customers" },
  { path: "/admin/reviews", icon: Star, label: "Reviews" },
  { path: "/admin/chat", icon: MessageSquare, label: "Support Chat" },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
    toast.success("Logged out");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0078D4] rounded-md flex items-center justify-center">
            <span className="text-white font-bold font-display text-sm">
              LS
            </span>
          </div>
          <div>
            <p className="font-display font-semibold text-white text-sm tracking-tight">
              Ecom Store
            </p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-colors duration-150
              ${
                isActive
                  ? "bg-blue-500/10 text-[#4CC2FF]"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-30" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      {/* <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#0078D4] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} strokeWidth={1.75} /> Logout
        </button>
      </div> */}

      {/* User Menu */}
      <div className="px-3 py-4 border-t border-gray-800 relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#0078D4] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.charAt(0)?.toUpperCase()}
            </span>
          </div>

          <div className="min-w-0 text-left flex-1">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${
              userMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {userMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
            {/* Profile */}
            <button
              onClick={() => {
                setUserMenuOpen(false);
                navigate("/profile");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <User size={17} />
              My Profile
            </button>

            {/* Visit Store */}
            <button
              onClick={() => {
                setUserMenuOpen(false);
                navigate("/");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Store size={17} />
              Visit Store
            </button>

            <div className="border-t border-gray-700" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* ── DESKTOP SIDEBAR ──────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900 border-r border-gray-800 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ───────────────────────────── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 inset-y-0 w-64 bg-gray-900 z-50 animate-slide-in-right">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-20 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
          <span className="font-display font-semibold text-white">
            Admin Panel
          </span>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
