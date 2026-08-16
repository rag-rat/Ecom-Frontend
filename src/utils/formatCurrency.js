

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Every price display across the app uses this — product cards,
 * cart totals, order summaries, admin dashboard.
 * One function = consistent formatting everywhere.
 *
 * Intl.NumberFormat is the modern, locale-aware JS formatting API —
 * it handles the ₹ symbol, comma separators, and decimal places
 * automatically based on the 'en-IN' (Indian English) locale.
 */

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatCompact = (amount) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}