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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'success' | 'failed' | 'refunded'>('all');
  const [refundingId, setRefundingId] = useState<number | null>(null);
  const [refundError, setRefundError] = useState<string | null>(null);

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

  const filteredPayments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return sortedPayments.filter((payment) => {
      // Status filter
      if (statusFilter !== 'all' && payment.status !== statusFilter) {
        return false;
      }

      if (!term) return true;

      const customerName = payment.order?.user?.name || '';
      const customerEmail = payment.order?.user?.email || '';

      const haystack = [
        String(payment.payment_id),
        String(payment.order_id),
        customerName,
        customerEmail,
        payment.status,
        payment.payment_provider || '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [sortedPayments, searchTerm, statusFilter]);

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

  const handleRefund = async (payment: Payment) => {
    if (payment.status !== 'success') return;

    const confirm = window.confirm(
      `Are you sure you want to refund payment #${payment.payment_id} for order #${payment.order_id}?`
    );
    if (!confirm) return;

    try {
      setRefundingId(payment.payment_id);
      setRefundError(null);

      const response = await api.post(`/payments/${payment.payment_id}/refund`);
      const payload = response.data.data || response.data;
      const updated: Payment = payload.data || payload;

      setPayments((prev) => prev.map((p) => (p.payment_id === updated.payment_id ? updated : p)));
    } catch (err: any) {
      console.error('Error refunding payment:', err);
      let message = 'Failed to refund payment.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setRefundError(message);
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Payments</h1>
              <p className="text-sm text-gray-500 mt-0.5">Review all order payments, latest first.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none">
                <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by payment, order, customer, email"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
                />
              </div>
              <div className="sm:w-40">
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
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

            {refundError && !loading && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">
                {refundError}
              </div>
            )}

            {!loading && !error && filteredPayments.length === 0 && (
              <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                No payments found.
              </div>
            )}

            {!loading && !error && filteredPayments.length > 0 && (
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
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredPayments.map((payment) => {
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
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            {payment.status === 'success' ? (
                              <button
                                type="button"
                                onClick={() => handleRefund(payment)}
                                disabled={refundingId === payment.payment_id}
                                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                              >
                                {refundingId === payment.payment_id ? 'Refunding...' : 'Refund'}
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
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
