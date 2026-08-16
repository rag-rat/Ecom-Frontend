
import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CreditCard } from 'lucide-react'
import useRazorpay from '../../hooks/useRazorpay'
import { selectUser } from '../../store/slices/authSlice'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The page CheckoutPage (Part 12) redirects to right after placing an
 * order. Its ONLY job is to trigger the Razorpay widget automatically
 * on mount and route to success/failure based on the outcome.
 *
 * WHY A SEPARATE PAGE INSTEAD OF TRIGGERING FROM CheckoutPage DIRECTLY?
 * Keeps CheckoutPage focused on address/cart review. This page has a
 * single, clear responsibility: "orchestrate this one payment attempt."
 * It also gives us a clean retry point — if the customer's order stays
 * PENDING (payment abandoned), we can link back here from OrderDetailPage
 * to retry payment without re-doing checkout.rtg
 *
 * useRef guards against React StrictMode's double-invoke in development,
 * which would otherwise open the Razorpay widget TWICE on mount.
 */

export default function PaymentProcessingPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const { openCheckout } = useRazorpay()

  const [status, setStatus] = useState('initiating') // initiating | error
  const [errorMessage, setErrorMessage] = useState('')
  const hasTriggered = useRef(false)

  const triggerPayment = async () => {
    setStatus('initiating')
    setErrorMessage('')
    try {
      await openCheckout(orderId, {
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        email: user?.email,
      })
      // Verification succeeded — navigate to success page
      navigate(`/payment/success?orderId=${orderId}`, { replace: true })
    } catch (err) {
      if (err.cancelled) {
        navigate(`/payment/failure?orderId=${orderId}&reason=cancelled`, { replace: true })
      } else {
        setStatus('error')
        setErrorMessage(err.message || 'Something went wrong processing your payment')
      }
    }
  }

  useEffect(() => {
    if (hasTriggered.current) return
    hasTriggered.current = true
    triggerPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'error') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <CreditCard size={28} className="text-red-500" />
          </div>
          <h1 className="text-lg font-display font-semibold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={triggerPayment}>
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => navigate('/orders')}>
              View Orders
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
      <Spinner size="lg" />
      <p className="text-gray-600 text-sm font-medium">Opening secure payment window...</p>
      <p className="text-gray-400 text-xs">Please don't close this page</p>
    </div>
  )
}