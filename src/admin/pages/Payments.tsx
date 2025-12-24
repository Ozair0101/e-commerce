import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';

interface PaymentOrderUser {
  id: number;
  name: string;
  email: string;
}

interface PaymentOrder {
  order_id: number;
  user?: PaymentOrderUser | null;
}

interface Payment {
  payment_id: number;
  order_id: number;
  status: 'pending' | 'success' | 'failed' | 'refunded' | string;
  amount: number | string;
  transaction_id?: string | null;
  payment_provider?: string | null;
  created_at?: string;
  order?: PaymentOrder | null;
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/payments');
        const payload = response.data.data || response.data;
        const data: Payment[] = payload.data || payload;
        setPayments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching payments:', err);
        let message = 'Failed to load payments.';
        if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const sortedPayments = useMemo(() => {
    if (!payments || !payments.length) return [] as Payment[];
    return [...payments].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime; // latest first
    });
  }, [payments]);

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' };
      case 'success':
        return { label: 'Success', className: 'bg-green-100 text-green-700' };
      case 'failed':
        return { label: 'Failed', className: 'bg-red-100 text-red-700' };
      case 'refunded':
        return { label: 'Refunded', className: 'bg-purple-100 text-purple-700' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-700' };
    }
  };

  const formatMethod = (provider?: string | null) => {
    if (!provider) return '-';
    const p = provider.toLowerCase();
    if (p === 'cod') return 'Cash on Delivery';
    if (p === 'card') return 'Card';
    if (p === 'paypal') return 'PayPal';
    return provider;
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Payments</h1>
              <p className="text-sm text-gray-500 mt-0.5">Review all order payments, latest first.</p>
            </div>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
              </div>
            )}

            {error && !loading && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && sortedPayments.length === 0 && (
              <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                No payments found.
              </div>
            )}

            {!loading && !error && sortedPayments.length > 0 && (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Payment ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Method</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {sortedPayments.map((payment) => {
                      const statusMeta = formatStatus(payment.status);
                      const amount = typeof payment.amount === 'string'
                        ? Number(payment.amount)
                        : Number(payment.amount || 0);
                      const createdAt = payment.created_at
                        ? new Date(payment.created_at).toLocaleString()
                        : '-';

                      const customerName = payment.order?.user
                        ? payment.order.user.name || `User #${payment.order.user.id}`
                        : '-';

                      return (
                        <tr key={payment.payment_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">#{payment.payment_id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-800">Order #{payment.order_id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-700">{customerName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-700">{formatMethod(payment.payment_provider)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-gray-900">${amount.toFixed(2)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusMeta.className.replace('bg-', 'border-')}`}>
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">{createdAt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
