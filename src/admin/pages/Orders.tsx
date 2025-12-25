import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

interface OrderUser {
  id: number;
  name: string;
  email: string;
}

interface Order {
  order_id: number;
  user_id: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | string;
  total_amount: number | string;
  payment_method: string;
  created_at?: string;
  first_name?: string;
  last_name?: string;
  user?: OrderUser | null;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/orders');
        const payload = response.data.data || response.data;
        const data: Order[] = payload.data || payload;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        let message = 'Failed to load orders.';
        if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openStatusModal = (order: Order) => {
    setStatusOrder(order);
    setStatusError(null);
    setStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    if (updatingStatus) return;
    setStatusModalOpen(false);
    setStatusOrder(null);
    setStatusError(null);
  };

  const handleChangeStatus = async (nextStatus: 'delivered' | 'cancelled') => {
    if (!statusOrder) return;
    try {
      setUpdatingStatus(true);
      setStatusError(null);
      const response = await api.put(`/orders/${statusOrder.order_id}`, { status: nextStatus });
      const payload = response.data.data || response.data;
      const updated: Order = payload.data || payload;
      setOrders((prev) => prev.map((o) => (o.order_id === updated.order_id ? updated : o)));
      setStatusModalOpen(false);
      setStatusOrder(null);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      let message = 'Failed to update order status.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setStatusError(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const sortedOrders = useMemo(() => {
    if (!orders || !orders.length) return [] as Order[];
    return [...orders].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sortedOrders.filter((order) => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      if (!term) return true;

      const customerName = order.first_name || order.last_name
        ? `${order.first_name || ''} ${order.last_name || ''}`.trim()
        : order.user?.name || `User #${order.user_id}`;

      const haystack = [
        String(order.order_id),
        customerName,
        order.user?.email || '',
        order.status,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [sortedOrders, searchTerm, statusFilter]);

  const getPaymentLabel = (method: string) => {
    const normalized = method.toLowerCase();
    if (normalized === 'cod') return 'Cash on Delivery';
    if (normalized === 'card') return 'Card';
    if (normalized === 'paypal') return 'PayPal';
    return method;
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
    <div className="mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage all customer orders.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order, customer, email, status"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
              />
            </div>
            <div className="sm:w-44">
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {error && (
            <div className="px-6 py-3 text-sm text-red-600 bg-red-50 border-b border-red-100">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 font-semibold border-b border-gray-100">
                  <th className="px-6 py-4 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-right">Total</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const customerName = order.first_name || order.last_name
                      ? `${order.first_name || ''} ${order.last_name || ''}`.trim()
                      : order.user?.name || `User #${order.user_id}`;

                    const createdAt = order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : '-';

                    const total = typeof order.total_amount === 'string'
                      ? Number(order.total_amount)
                      : Number(order.total_amount || 0);

                    const statusClass =
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700';

                    return (
                      <tr
                        key={order.order_id}
                        className="group hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                        onClick={() => navigate(`/admin/orders/${order.order_id}`)}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">#{order.order_id}</td>
                        <td className="px-6 py-4 text-gray-800">{customerName}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{createdAt}</td>
                        <td className="px-6 py-4 text-gray-700 text-sm">{getPaymentLabel(order.payment_method)}</td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">${total.toFixed(2)}</td>
                        <td
                          className="px-6 py-4 text-right"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (order.status === 'pending') {
                              openStatusModal(order);
                            }
                          }}
                        >
                          {order.status === 'pending' ? (
                            <button
                              type="button"
                              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${statusClass} hover:brightness-95 cursor-pointer`}
                            >
                              Pending
                            </button>
                          ) : (
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>
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
        {statusModalOpen && statusOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 text-gray-800">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Update order status</h2>
              <p className="text-sm text-gray-600 mb-4">
                Order <span className="font-semibold">#{statusOrder.order_id}</span> is currently
                <span className="font-semibold"> Pending</span>. Choose what you want to do with this order.
              </p>

              {statusError && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {statusError}
                </div>
              )}

              <div className="flex flex-col gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleChangeStatus('delivered')}
                  disabled={updatingStatus}
                  className="w-full px-4 py-2 rounded-xl bg-green-600 text-white text-xs sm:text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
                >
                  {updatingStatus ? 'Updating...' : 'Mark as Finished (Delivered)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeStatus('cancelled')}
                  disabled={updatingStatus}
                  className="w-full px-4 py-2 rounded-xl bg-red-600 text-white text-xs sm:text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                >
                  {updatingStatus ? 'Updating...' : 'Cancel Order'}
                </button>
              </div>

              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
