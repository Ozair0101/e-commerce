import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return customers;

    return customers.filter((customer) => {
      const haystack = [
        String(customer.id),
        customer.name,
        customer.email,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [customers, searchTerm]);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Customers</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage all registered customers</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none sm:w-56">
                <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, ID"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
                />
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/add-user')}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold shadow-sm hover:bg-orange-600"
              >
                <span className="material-symbols-outlined text-[18px] mr-1">person_add</span>
                Add User
              </button>
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

            {!loading && !error && filteredCustomers.length === 0 && (
              <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                No customers found.
              </div>
            )}

            {!loading && !error && filteredCustomers.length > 0 && (
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
                    {filteredCustomers.map((customer) => (
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
