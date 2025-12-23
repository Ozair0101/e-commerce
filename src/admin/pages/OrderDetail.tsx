import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

interface OrderUser {
  id: number;
  name: string;
  email: string;
}

interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

interface Product {
  product_id: number;
  name: string;
  price: number | string;
  discount_price?: number | string | null;
  images?: ProductImage[];
}

interface OrderItem {
  id?: number;
  order_item_id?: number;
  order_id: number;
  product_id: number;
  variant_id?: number | null;
  quantity: number;
  price_at_purchase: number | string;
  product?: Product;
}

interface Order {
  order_id: number;
  user_id: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | string;
  total_amount: number | string;
  payment_method: string;
  created_at?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  user?: OrderUser | null;
  items?: OrderItem[];
}

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/orders/${orderId}`);
        const payload = response.data.data || response.data;
        const data: Order = payload.data || payload;
        setOrder(data);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        let message = 'Failed to load order details.';
        if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatMoney = (value: number | string | undefined) => {
    const n = typeof value === 'string' ? Number(value) : Number(value || 0);
    return `$${n.toFixed(2)}`;
  };

  const statusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading || !order) {
    return (
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        {error ? (
          <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-5 text-center">
            <p className="text-sm text-red-600 mb-3 font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Go Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading order details...</p>
          </div>
        )}
      </div>
    );
  }

  const customerName = order.first_name || order.last_name
    ? `${order.first_name || ''} ${order.last_name || ''}`.trim()
    : order.user?.name || `User #${order.user_id}`;

  const createdAt = order.created_at
    ? new Date(order.created_at).toLocaleString()
    : '-';

  const items = order.items || [];

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <button
                type="button"
                onClick={() => navigate('/admin/orders')}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back to Orders</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_id}</h1>
            <p className="text-sm text-gray-600 mt-1">Placed on {createdAt}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${statusClass(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order & Customer Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-orange-500">local_shipping</span>
                Shipping Information
              </h2>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <p className="font-semibold">{customerName}</p>
                  <p className="text-gray-500 text-xs">Customer</p>
                </div>
                {order.email && (
                  <div>
                    <p>{order.email}</p>
                    <p className="text-gray-500 text-xs">Email</p>
                  </div>
                )}
                {order.phone && (
                  <div>
                    <p>{order.phone}</p>
                    <p className="text-gray-500 text-xs">Phone</p>
                  </div>
                )}
                {(order.address || order.city || order.state || order.zip_code) && (
                  <div>
                    <p>{order.address}</p>
                    <p>{[order.city, order.state, order.zip_code].filter(Boolean).join(', ')}</p>
                    <p className="text-gray-500 text-xs mt-1">Shipping Address</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-orange-500">receipt_long</span>
                Order Summary
              </h2>
              <dl className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Order ID</dt>
                  <dd className="font-medium">#{order.order_id}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Customer ID</dt>
                  <dd className="font-medium">{order.user_id}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Payment Method</dt>
                  <dd className="font-medium uppercase">{order.payment_method}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
                  <dt className="text-gray-900 font-semibold">Total Amount</dt>
                  <dd className="text-lg font-bold text-gray-900">{formatMoney(order.total_amount)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Items */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-orange-500">shopping_bag</span>
                Order Items
              </h2>
              <span className="text-xs text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-gray-500 font-semibold border-b border-gray-100">
                    <th className="px-5 py-3 uppercase tracking-wider">Product</th>
                    <th className="px-5 py-3 uppercase tracking-wider text-center">Qty</th>
                    <th className="px-5 py-3 uppercase tracking-wider text-right">Price</th>
                    <th className="px-5 py-3 uppercase tracking-wider text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-6 text-center text-gray-500">
                        No items found for this order.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const product = item.product;
                      const price = typeof item.price_at_purchase === 'string'
                        ? Number(item.price_at_purchase)
                        : Number(item.price_at_purchase || 0);
                      const subtotal = price * item.quantity;

                      return (
                        <tr key={item.order_item_id || `${item.order_id}-${item.product_id}`} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                                {product && product.images && product.images.length > 0 ? (
                                  <img
                                    src={product.images[0].url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="material-symbols-outlined text-gray-300">image</span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{product?.name || `Product #${item.product_id}`}</p>
                                <p className="text-xs text-gray-500">ID: {item.product_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center text-gray-800 font-medium">{item.quantity}</td>
                          <td className="px-5 py-3 text-right text-gray-800">{formatMoney(price)}</td>
                          <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatMoney(subtotal)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
