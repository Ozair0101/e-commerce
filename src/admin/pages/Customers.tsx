import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

interface Customer {
  id: number;
  name: string;
  email: string;
  role?: string | null;
  created_at?: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/users', { params: { role: 'customer' } });
        const payload = response.data.data || response.data;
        const data: Customer[] = payload.data || payload;
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        let message = 'Failed to load customers.';
        if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Customers</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage all registered customers</p>
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

            {!loading && !error && customers.length === 0 && (
              <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                No customers found.
              </div>
            )}

            {!loading && !error && customers.length > 0 && (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">#{customer.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900">{customer.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">{customer.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
                            {customer.role || 'customer'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                          {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
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

export default CustomersPage;
