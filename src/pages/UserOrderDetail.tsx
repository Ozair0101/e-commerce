import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

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

const UserOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  const backendOrigin = (() => {
    try {
      const base = (api.defaults.baseURL as string) || '';
      return base ? new URL(base).origin : window.location.origin;
    } catch {
      return window.location.origin;
    }
  })();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

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
  }, [authLoading, user, orderId, navigate]);

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url);
        const backend = new URL(backendOrigin);

        const isLocalhost = parsed.hostname === 'localhost';
        const hasNoPort = !parsed.port;
        const backendHasPort = !!backend.port;

        if (isLocalhost && hasNoPort && backendHasPort) {
          return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }

        return url;
      } catch {
        return url;
      }
    }

    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

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

  if (authLoading || loading || !order) {
    return (
      <main className="w-full max-w-screen-xl mx-auto px-4 mt-18 sm:px-6 md:px-10 py-10 flex items-center justify-center">
        {error ? (
          <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-5 text-center">
            <p className="text-sm text-red-600 mb-3 font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to My Orders
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-700">
            <div className="size-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading order details...</p>
          </div>
        )}
      </main>
    );
  }

  const createdAt = order.created_at
    ? new Date(order.created_at).toLocaleString()
    : '-';

  const items = order.items || [];

  const customerName = order.first_name || order.last_name
    ? `${order.first_name || ''} ${order.last_name || ''}`.trim()
    : user?.name || `User #${order.user_id}`;

  return (
    <main className="w-full max-w-screen-xl mx-auto px-4 mt-18 sm:px-6 md:px-10 py-8">
      <div className="flex flex-col gap-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        {/* Header / breadcrumb */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back to My Orders</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_id}</h1>
            <p className="text-sm text-gray-600 mt-1">Placed on {createdAt}</p>
          </div>
          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${statusClass(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping & summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-orange-500">local_shipping</span>
                Shipping information
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
                    <p className="text-gray-500 text-xs mt-1">Shipping address</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-orange-500">receipt_long</span>
                Order summary
              </h2>
              <dl className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Order ID</dt>
                  <dd className="font-medium">#{order.order_id}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Payment method</dt>
                  <dd className="font-medium uppercase">{order.payment_method}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
                  <dt className="text-gray-900 font-semibold">Total</dt>
                  <dd className="text-lg font-bold text-gray-900">{formatMoney(order.total_amount)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Items */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-orange-500">shopping_bag</span>
                Items in this order
              </h2>
              <span className="text-xs text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-500 text-sm">
                  No items found for this order.
                </div>
              ) : (
                items.map((item) => {
                  const product = item.product;
                  const price = typeof item.price_at_purchase === 'string'
                    ? Number(item.price_at_purchase)
                    : Number(item.price_at_purchase || 0);
                  const subtotal = price * item.quantity;

                  const primaryImage =
                    product && product.images && product.images.length > 0
                      ? product.images.find((img) => img.is_primary) || product.images[0]
                      : undefined;
                  const imageUrl = resolveImageUrl(primaryImage?.url);

                  return (
                    <div
                      key={item.order_item_id || `${item.order_id}-${item.product_id}`}
                      className="px-5 py-4 flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product?.name || `Product #${item.product_id}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-gray-300">image</span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {product?.name || `Product #${item.product_id}`}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-sm">
                        <span className="text-gray-700">{formatMoney(price)}</span>
                        <span className="font-semibold text-gray-900">{formatMoney(subtotal)}</span>
                        {order.status === 'pending' && (
                          <div className="flex gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(item);
                                setEditQuantity(item.quantity);
                                setEditError(null);
                              }}
                              className="px-2 py-1 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (!order || !item.order_item_id) return;
                                try {
                                  setRemovingItemId(item.order_item_id);
                                  const response = await api.delete(`/orders/${order.order_id}/items/${item.order_item_id}`);
                                  const payload = response.data.data || response.data;
                                  const updated: Order = payload.data || payload;
                                  setOrder(updated);
                                  setToast({ message: 'Item removed from order.', type: 'success' });
                                } catch (err: any) {
                                  console.error('Error removing order item:', err);
                                } finally {
                                  setRemovingItemId(null);
                                }
                              }}
                              disabled={removingItemId === item.order_item_id}
                              className="px-2 py-1 rounded-lg border border-red-200 text-[11px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              {removingItemId === item.order_item_id ? 'Removing...' : 'Delete'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {editingItem && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 text-gray-800">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Edit item quantity</h2>
            <p className="text-sm text-gray-600 mb-4">
              {editingItem.product?.name || `Product #${editingItem.product_id}`}
            </p>

            {editError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {editError}
              </div>
            )}

            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={editQuantity}
              onChange={(e) => setEditQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-full mb-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-2.5 px-3 transition-colors"
            />

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  if (savingEdit) return;
                  setEditingItem(null);
                  setEditError(null);
                }}
                disabled={savingEdit}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!order || !editingItem?.order_item_id) return;
                  try {
                    setSavingEdit(true);
                    setEditError(null);
                    const response = await api.put(`/orders/${order.order_id}/items/${editingItem.order_item_id}`, {
                      quantity: editQuantity,
                    });
                    const payload = response.data.data || response.data;
                    const updated: Order = payload.data || payload;
                    setOrder(updated);
                    setEditingItem(null);
                    setToast({ message: 'Item updated successfully.', type: 'success' });
                  } catch (err: any) {
                    console.error('Error updating order item quantity:', err);
                    let message = 'Failed to update item.';
                    if (err.response?.data?.message) {
                      message = err.response.data.message;
                    }
                    setEditError(message);
                  } finally {
                    setSavingEdit(false);
                  }
                }}
                disabled={savingEdit}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs sm:text-sm font-semibold hover:bg-orange-500 disabled:opacity-60"
              >
                {savingEdit ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserOrderDetail;
