import { useState } from 'react'
import { useSelector } from 'react-redux'
import { User, Lock, MapPin, Star } from 'lucide-react'
import { selectUser } from '../../store/slices/authSlice'
import ProfileInfoTab from './tabs/ProfileInfoTab'
import ChangePasswordTab from './tabs/ChangePasswordTab'
import MyAddressesTab from './tabs/MyAddressesTab'
import MyReviewsTab from './tabs/MyReviewsTab'
import { clsx } from 'clsx'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Tabbed container that switches between the four sub-pages built
 * above. Kept as simple local useState (not URL-synced, unlike
 * ProductListPage's filters in Part 8) — profile tabs aren't the kind
 * of state a customer needs to bookmark or share, so the simpler
 * approach is appropriate here.
 */

const TABS = [
  { key: 'profile', label: 'Profile Info', icon: User },
  { key: 'password', label: 'Change Password', icon: Lock },
  { key: 'addresses', label: 'My Addresses', icon: MapPin },
  { key: 'reviews', label: 'My Reviews', icon: Star },
]


export default function ProfilePage() {
  const user = useSelector(selectUser)
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="container-page py-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-display font-bold text-2xl">
            {user?.firstName?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── SIDEBAR TABS ─────────────────────────────────── */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0',
                  activeTab === key
                    ? 'bg-blue-50 text-[#0078D4]'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>



        {/* ── TAB CONTENT ──────────────────────────────────── */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6">
          {activeTab === 'profile' && <ProfileInfoTab />}
          {activeTab === 'password' && <ChangePasswordTab />}
          {activeTab === 'addresses' && <MyAddressesTab />}
          {activeTab === 'reviews' && <MyReviewsTab />}
        </div>
      </div>
    </div>
  )
}
