import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, MapPin, ShoppingBag } from 'lucide-react'
import useCart from '../../hooks/useCart'
import { addressApi } from '../../api/addressApi'
import { orderApi } from '../../api/orderApi'
import { formatCurrency } from '../../utils/formatCurrency'
import AddressCard from '../../components/address/AddressCard'
import AddressFormModal from '../../components/address/AddressFormModal'
import OrderSummary from '../../components/cart/OrderSummary'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The final step before payment. Matches backend Part 16's
 * PlaceOrderRequest exactly: { addressId, notes }.
 *
 * WHY WE DON'T RE-VALIDATE STOCK HERE ON THE FRONTEND:
 * The backend's OrderService.placeOrder() (Part 16 backend) does the
 * REAL, atomic stock reservation check inside a @Transactional block.
 * If stock became insufficient between the cart page and this moment,
 * the backend rejects the order with a BusinessException, which we
 * catch and display — we don't duplicate that check here, since only
 * the backend can make it correctly and atomically (race conditions
 * between simultaneous customers can only be resolved server-side).
 *
 * AFTER SUCCESSFUL PLACEMENT:
 * We navigate to a payment page (Part 14) with the newly created
 * orderId, where Razorpay's Checkout widget takes over.
 */


export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalAmount, totalItems, refreshCart, loading: cartLoading } = useCart()

  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)


  const fetchAddresses = () => {
    setAddressesLoading(true)
    addressApi.getAddresses()
      .then((res) => {
        const list = res.data || []
        setAddresses(list)
        // Auto-select the default address, or the first one if no default
        const defaultAddr = list.find((a) => a.defaultIs) || list[0]
        if (defaultAddr) setSelectedAddressId(defaultAddr.id)
      })
      .catch(() => {})
      .finally(() => setAddressesLoading(false))
  }

  // console.log(addresses)

  useEffect(() => {
    fetchAddresses()
  }, [])


  // Redirect to cart if cart is empty and we've finished loading it
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [cartLoading, items, navigate])


  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address')
      return
    }

    setPlacingOrder(true)
    try {
      const response = await orderApi.placeOrder({
        addressId: selectedAddressId,
        notes: notes.trim() || undefined,
      })

      await refreshCart()

      toast.success('Order placed! Redirecting to payment...')
      // navigate(`/payment/success?orderId=${response.data.id}&pay=true`)
      navigate(`/payment/process/${response.data.id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setPlacingOrder(false)
    }
  }


  if (cartLoading || addressesLoading) {
    return <Spinner fullScreen />
  }


  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
        Checkout
      </h1>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          {/* ── SHIPPING ADDRESS ─────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-[#0078D4]" /> Shipping Address
              </h2>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-[#0078D4] hover:text-[#106EBE]"
              >
                <Plus size={14} /> Add New
              </button>
            </div>


            {addresses.length === 0 ? (
              <EmptyState
                icon={<MapPin size={24} />}
                title="No saved addresses"
                description="Add a shipping address to continue"
                action={
                  <Button variant="primary" onClick={() => setModalOpen(true)}>
                    Add Address
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    selectable
                    selected={selectedAddressId === address.id}
                    onSelect={() => setSelectedAddressId(address.id)}
                  />
                ))}
              </div>
            )}

          </div>



          {/* ── ORDER ITEMS REVIEW ───────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-display font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <ShoppingBag size={18} className="text-[#0078D4]" /> Review Items ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.productImage && (
                      <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── DELIVERY NOTES ────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Instructions (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Leave at the door, call before delivery..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
            />
          </div>
        </div>


        {/* ── ORDER SUMMARY ────────────────────────────────────── */}
        <div>
          <OrderSummary subtotal={totalAmount} itemCount={totalItems}>
            <Button
              variant="primary"
              size="full"
              loading={placingOrder}
              disabled={!selectedAddressId || addresses.length === 0}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
            <Link
              to="/cart"
              className="block text-center text-xs text-gray-500 hover:text-gray-700 mt-3"
            >
              ← Back to Cart
            </Link>
          </OrderSummary>
        </div>
      </div>

      <AddressFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        existingAddress={null}
        onSuccess={fetchAddresses}
      />
    </div>
  )
}
