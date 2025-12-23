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

  const sortedOrders = useMemo(() => {
    if (!orders || !orders.length) return [] as Order[];
    return [...orders].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [orders]);

  const getPaymentLabel = (method: string) => {
    const normalized = method.toLowerCase();
    if (normalized === 'cod') return 'Cash on Delivery';
    if (normalized === 'card') return 'Card';
    if (normalized === 'paypal') return 'PayPal';
    return method;
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage all customer orders.</p>
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
                ) : sortedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  sortedOrders.map((order) => {
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
                        : order.status === 'paid'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'shipped'
                        ? 'bg-indigo-100 text-indigo-700'
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
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
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
  );
};

export default OrdersPage;
