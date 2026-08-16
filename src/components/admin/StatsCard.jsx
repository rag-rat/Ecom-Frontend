import { clsx } from 'clsx'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Reused across dashboard's 4 top metric cards. Each shows an icon,
 * a value, a label, and optionally a trend indicator.
 */

export default function StatsCard({ icon: Icon, label, value, color = 'brand' }) {
  const colorClasses = {
    brand: 'bg-[#0078D4]/10 text-[#4CC2FF] border border-[#0078D4]/20',
    green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <div className={clsx('w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0', colorClasses[color])}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-xl font-display font-bold text-white truncate">{value}</p>
        </div>
      </div>
    </div>
  )
}
