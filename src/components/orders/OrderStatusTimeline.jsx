import { Check, X } from 'lucide-react'
import { clsx } from 'clsx'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Visualizes the forward-only state machine from backend Part 16
 * (PENDING → CONFIRMED → SHIPPED → DELIVERED, or CANCELLED at any
 * point before SHIPPED). This is a purely visual representation —
 * matches the ORDER_STATUS_CONFIG mapping we built in Part 1's utils.
 *
 * If status is CANCELLED, we show a distinct red "cancelled" state
 * instead of the normal step progression, since cancellation isn't
 * a STEP in the sequence — it's an exit from it.
 */

const STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

export default function OrderStatusTimeline({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <X size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500">This order has been cancelled</p>
        </div>
      </div>
    )
  }

  const currentIndex = STEPS.indexOf(status)

  return (
    <div className="flex items-center">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isDone = isCompleted || isCurrent

        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                isDone ? 'bg-[#0078D4] text-white' : 'bg-gray-100 text-gray-400'
              )}>
                {isCompleted ? <Check size={14} /> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              <p className={clsx(
                'text-[10px] font-medium mt-1.5 text-center whitespace-nowrap',
                isDone ? 'text-gray-800' : 'text-gray-400'
              )}>
                {step.charAt(0) + step.slice(1).toLowerCase()}
              </p>
            </div>
            {index < STEPS.length - 1 && (
              <div className={clsx(
                'flex-1 h-0.5 mx-1 transition-colors',
                index < currentIndex ? 'bg-[#0078D4]' : 'bg-gray-200'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
