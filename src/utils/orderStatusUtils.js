
/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Maps backend order status strings to frontend display values —
 * colour, label, icon name. Used in order history, admin order list,
 * order detail page. Centralising this means changing the colour of
 * "SHIPPED" status only happens in ONE place.
 */

export const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Payment',
    badgeVariant: 'warning',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  CONFIRMED: {
    label: 'Confirmed',
    badgeVariant: 'info',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  SHIPPED: {
    label: 'Shipped',
    badgeVariant: 'brand',
    color: 'text-brand-700',
    bgColor: 'bg-brand-50',
    borderColor: 'border-brand-200',
  },
  DELIVERED: {
    label: 'Delivered',
    badgeVariant: 'success',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeVariant: 'danger',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
}

export const getStatusConfig = (status) =>
  ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.PENDING