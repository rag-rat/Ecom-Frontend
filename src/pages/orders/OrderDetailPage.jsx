import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Package, MapPin, XCircle } from "lucide-react";
import { orderApi } from "../../api/orderApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDate";
import { getStatusConfig } from "../../utils/orderStatusUtils";
import OrderStatusTimeline from "../../components/orders/OrderStatusTimeline";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Full order detail — matches backend Part 16's OrderResponse DTO
 * exactly: orderNumber, items, shippingAddress (embedded snapshot —
 * always shows what was TRUE at order time, per the backend's design
 * comment), status, subtotal, shippingCharge, totalAmount.
 *
 * CANCEL BUTTON VISIBILITY:
 * Only shown when status is PENDING or CONFIRMED — mirrors backend
 * Part 16's OrderService.cancelOrder() validation exactly. We check
 * this on the frontend purely for UX (hide a button that would fail
 * anyway); the backend is the actual source of truth and re-validates
 * this same rule when the cancel request arrives.
 */

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = () => {
    setLoading(true);
    orderApi
      .getOrderById(orderId)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    setCancelling(true);
    try {
      await orderApi.cancelOrder(orderId, cancelReason.trim());
      toast.success("Order cancelled successfully");
      setCancelModalOpen(false);
      fetchOrder();
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Spinner fullScreen />;

  if (!order) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link
          to="/orders"
          className="text-[#0078D4] font-medium mt-2 inline-block"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  return (
    <div className="container-page py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            to="/orders"
            className="text-xs text-gray-400 hover:text-[#0078D4]"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-xl font-display font-bold text-gray-900 mt-1">
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge variant={statusConfig.badgeVariant}>{statusConfig.label}</Badge>
      </div>

      {/* Status timeline */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <OrderStatusTimeline status={order.status} />
      </div>

      {order.status === "PENDING" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Payment Pending
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Complete your payment to start processing your order.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() =>
              // navigate(`/payment/success?orderId=${order.id}&pay=true`)
              navigate(`/payment/process/${orderId}`)
            }
          >
            Proceed to Payment
          </Button>
        </div>
      )}

      {order.status === "CANCELLED" && order.cancelReason && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-sm text-red-700">
          <span className="font-medium">Cancellation reason:</span>{" "}
          {order.cancelReason}
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-display font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Package size={18} className="text-[#0078D4]" /> Items
        </h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Shipping address */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-display font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-[#0078D4]" /> Shipping Address
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-medium text-gray-800">
              {order.shippingAddress.fullName}
            </p>
            <p>{order.shippingAddress.phoneNumber}</p>
            <p className="mt-1">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 &&
                `, ${order.shippingAddress.addressLine2}`}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-display font-semibold text-gray-900 mb-3">
            Price Details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.shippingCharge === 0
                  ? "FREE"
                  : formatCurrency(order.shippingCharge)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <p className="text-xs text-gray-400 mb-1">Delivery Instructions</p>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {canCancel && (
        <Button
          variant="danger"
          size="lg"
          onClick={() => setCancelModalOpen(true)}
        >
          <XCircle size={16} /> Cancel Order
        </Button>
      )}

      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel this order?"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          Please tell us why you're cancelling. This helps us improve our
          service.
        </p>
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
          placeholder="e.g. Changed my mind, ordered by mistake..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <div className="flex gap-3">
          <Button
            variant="danger"
            size="md"
            loading={cancelling}
            onClick={handleCancel}
          >
            Confirm Cancellation
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setCancelModalOpen(false)}
          >
            Keep Order
          </Button>
        </div>
      </Modal>
    </div>
  );
}
