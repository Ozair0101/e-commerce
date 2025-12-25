import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

interface OrderItem {
  order_item_id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

interface Order {
  order_id: number;
  user_id: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | string;
  total_amount: number | string;
  payment_method: string;
  created_at?: string;
  items?: OrderItem[];
}

const UserOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/orders', {
          params: { user_id: user.id },
        });
        const payload = response.data.data || response.data;
        const data: Order[] = payload.data || payload;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching user orders:', err);
        let message = 'Failed to load your orders.';
        if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authLoading, user, navigate]);

  const sortedOrders = useMemo(() => {
    if (!orders || !orders.length) return [] as Order[];
    return [...orders].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [orders]);

  const closeToast = () => {
    setToast(null);
  };

  const handleOpenCancelModal = (order: Order) => {
    setOrderToCancel(order);
    setCancelError(null);
    setCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    if (cancelling) return;
    setCancelModalOpen(false);
    setOrderToCancel(null);
    setCancelError(null);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    try {
      setCancelling(true);
      setCancelError(null);
      await api.delete(`/orders/${orderToCancel.order_id}`);
      setOrders((prev) => prev.filter((o) => o.order_id !== orderToCancel.order_id));
      setCancelModalOpen(false);
      setOrderToCancel(null);
      setToast({ message: 'Order cancelled successfully.', type: 'success' });
    } catch (err: any) {
      console.error('Error cancelling order:', err);
      let message = 'Failed to cancel the order.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setCancelError(message);
    } finally {
      setCancelling(false);
    }
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

  if (authLoading) {
    return (
      <main className="w-full max-w-screen-xl mx-auto px-4 mt-18 sm:px-6 md:px-10 py-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-700">
          <div className="size-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your account...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="w-full max-w-screen-xl mx-auto px-4 mt-18 sm:px-6 md:px-10 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Track all orders you have placed.</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Order History</h2>
          {loading && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              Loading...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-500 font-semibold border-b border-gray-100">
                <th className="px-4 sm:px-6 py-3 uppercase tracking-wider">Order</th>
                <th className="px-4 sm:px-6 py-3 uppercase tracking-wider">Date</th>
                <th className="px-4 sm:px-6 py-3 uppercase tracking-wider text-right">Total</th>
                <th className="px-4 sm:px-6 py-3 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-6 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-gray-500">
                    You have no orders yet.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => {
                  const createdAt = order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : '-';

                  return (
                    <tr
                      key={order.order_id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 cursor-pointer"
                      onClick={() => navigate(`/orders/${order.order_id}`)}
                    >
                      <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span>Order #{order.order_id}</span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            {order.items && order.items.length > 0
                              ? `${order.items.length} item${order.items.length !== 1 ? 's' : ''}`
                              : 'No items info'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{createdAt}</td>
                      <td className="px-4 sm:px-6 py-4 text-right font-semibold text-gray-900">
                        {formatMoney(order.total_amount)}
                      </td>
                      <td
                        className="px-4 sm:px-6 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenCancelModal(order)}
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${statusClass(
                              order.status,
                            )} hover:brightness-95 cursor-pointer`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${statusClass(
                              order.status,
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {cancelModalOpen && orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 text-gray-800">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Cancel order?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel <span className="font-semibold">Order #{orderToCancel.order_id}</span>?
              This action cannot be undone.
            </p>

            {cancelError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {cancelError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={handleCloseCancelModal}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Keep order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs sm:text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                {cancelling ? 'Cancelling...' : 'Cancel order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserOrdersPage;
