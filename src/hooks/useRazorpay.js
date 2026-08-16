import { useCallback } from 'react'
import { paymentApi } from '../api/paymentApi'

/*
 * ═══════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 * ═══════════════════════════════════════════════════════════════
 * Wraps Razorpay's imperative, callback-based Checkout widget behind
 * a clean async function our React components can await, matching
 * the style of every other hook in this project.
 *
 * ═══════════════════════════════════════════════════════════════
 * WHY RAZORPAY'S WIDGET ISN'T A NORMAL REACT COMPONENT
 * ═══════════════════════════════════════════════════════════════
 * The `<script src="https://checkout.razorpay.com/v1/checkout.js">`
 * tag in index.html (Part 1) attaches `window.Razorpay` — a global
 * constructor function, not a React component. Calling `new
 * window.Razorpay(options)` opens Razorpay's OWN popup UI (outside
 * React's control) and communicates back via callback functions we
 * provide in `options`. This is standard for third-party payment
 * widgets — they manage their own UI for PCI-compliance reasons
 * (we never want raw card numbers touching our own React state or
 * network requests).
 *
 * ═══════════════════════════════════════════════════════════════
 * THE TWO-STEP VERIFICATION MATCHING BACKEND PART 17
 * ═══════════════════════════════════════════════════════════════
 *   1. paymentApi.createPaymentOrder(orderId) — backend calls Razorpay's
 *      API to create a payment session, returns razorpayOrderId + keyId
 *   2. Open the widget with those details — customer pays
 *   3. Razorpay's handler callback fires with razorpay_payment_id,
 *      razorpay_order_id, razorpay_signature
 *   4. We forward EXACTLY those three fields to paymentApi.verifyPayment()
 *      — backend recomputes the HMAC signature (Part 17 backend's
 *      verifySignature()) to cryptographically confirm this is real
 * ═══════════════════════════════════════════════════════════════
 */

export default function useRazorpay() {

  /*
   * openCheckout()
   * ─────────────────
   * @param orderId    Our internal order ID (not Razorpay's)
   * @param customerInfo  { name, email, phone } — prefills the widget
   * @returns Promise that resolves with the verified payment response,
   *          or rejects if the customer dismisses the widget or
   *          verification fails.
   */
  
  const openCheckout = useCallback(async (orderId, customerInfo = {}) => {
    // Step 1 — ask backend to create a Razorpay payment session
    const createResponse = await paymentApi.createPaymentOrder(orderId)
    const { razorpayOrderId, amount, currency, keyId } = createResponse.data

    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Payment gateway failed to load. Please refresh and try again.'))
        return
      }

      const options = {
        key: keyId,
        // Razorpay expects amount in paise — same conversion logic as
        // backend Part 17's createPaymentOrder (amount * 100)
        amount: Math.round(amount * 100),
        currency,
        name: 'Ecom Store',
        description: 'Payment for your order',
        order_id: razorpayOrderId,
        prefill: {
          name: customerInfo.name || '',
          email: customerInfo.email || '',
          contact: customerInfo.phone || '',
        },
        theme: {
          color: '#0078D4', // matches our site accent color
        },

        /*
         * handler — Razorpay calls this ONLY on successful payment
         * completion inside the widget. `response` contains the three
         * fields we need to forward for server-side verification.
         */
        handler: async (response) => {
          try {
            const verifyResponse = await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            resolve(verifyResponse.data)
          } catch (verifyError) {
            reject(verifyError)
          }
        },

        modal: {
          /*
           * ondismiss — fires when the customer closes the widget
           * WITHOUT completing payment (clicked the X, pressed Escape,
           * clicked outside). This is a normal cancellation, not an
           * error — we reject with a specific flag so the calling
           * component can distinguish "customer cancelled" from
           * "payment actually failed".
           */
          ondismiss: () => {
            reject({ cancelled: true, message: 'Payment was cancelled' })
          },
        },
      }

      const razorpayInstance = new window.Razorpay(options)

      /*
       * payment.failed event — fires when Razorpay itself rejects the
       * payment (declined card, insufficient funds, etc.) — different
       * from ondismiss (customer closing the widget voluntarily).
       */
      razorpayInstance.on('payment.failed', (response) => {
        reject({
          cancelled: false,
          message: response.error?.description || 'Payment failed. Please try again.',
        })
      })

      razorpayInstance.open()
    })
  }, [])

  return { openCheckout }
}