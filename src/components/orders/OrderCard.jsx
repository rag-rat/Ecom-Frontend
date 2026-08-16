import { Link, useNavigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getStatusConfig } from "../../utils/orderStatusUtils";
import Badge from "../ui/Badge";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Compact order summary card for the order history LIST. Shows enough
 * to recognize the order at a glance — thumbnails, total, status —
 * without the full detail (that's OrderDetailPage's job).
 */

export default function OrderCard({ order }) {
  const statusConfig = getStatusConfig(order.status);
  const previewItems = order.items.slice(0, 5);

  const navigate = useNavigate();

  return (
    // <Link
    //   to={`/orders/${order.id}`}
    //   className="block bg-white rounded-xl border border-gray-100 p-6 hover:border-[#0078D4] transition-colors hover:shadow-md hover:-translate-y-0.5"
    // >

    <div
      onClick={() => navigate(`/orders/${order.id}`)}
      className="cursor-pointer block bg-white rounded-xl border border-gray-100 p-6 hover:border-[#0078D4] transition-colors hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400">Order Number</p>
          <p className="text-sm font-semibold text-gray-900">
            {order.orderNumber}
          </p>
        </div>
        <Badge variant={statusConfig.badgeVariant}>{statusConfig.label}</Badge>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {previewItems.map((item, i) => (
          <div
            key={i}
            className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0"
          >
            {item.productImage ? (
              <img
                src={item.productImage}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package size={16} />
              </div>
            )}
          </div>
        ))}
        {order.items.length > 5 && (
          <div className="w-14 h-16 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500 flex-shrink-0">
            +{order.items.length - 5}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>

        <div className="flex items-center gap-6">
          {order.status === "PENDING" && (
            <Link
              // to={`/payment/success?orderId=${order.id}&pay=true`}
              to={`/payment/process/${order.id}`}
              onClick={(e) => e.stopPropagation()}
              className="group inline-flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-[#0078D4] transition-colors"
            >
              Complete Payment
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          )}

          <span className="group inline-flex items-center gap-1 text-sm font-medium text-[#0078D4]">
            View Details
            <ChevronRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
}
