import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../utils/api';
import Toast from '../../components/Toast';

interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

interface Product {
  product_id: number;
  name: string;
  category_id: string;
  price: number;
  discount_price: number | null;
  is_active: boolean;
  stock_quantity: number;
  images?: ProductImage[];
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setToast({ message: 'Failed to load products', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(product.product_id).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return Number(a.price) - Number(b.price);
    if (sortBy === 'stock') return b.stock_quantity - a.stock_quantity;
    return 0;
  });

  const getStatusClass = (product: Product) => {
    if (!product.is_active) return 'bg-gray-100 text-gray-800';
    if (product.stock_quantity === 0) return 'bg-red-100 text-red-800';
    if (product.stock_quantity < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusLabel = (product: Product) => {
    if (!product.is_active) return 'Inactive';
    if (product.stock_quantity === 0) return 'Out of Stock';
    if (product.stock_quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(product => product.product_id !== productId));
      setToast({ message: 'Product deleted successfully', type: 'success' });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      let errorMessage = 'Failed to delete product';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleRequestDeleteProduct = (productId: number) => {
    setToast({
      message: 'Are you sure you want to delete this product?',
      type: 'warning',
      onConfirm: async () => {
        await handleDeleteProduct(productId);
      },
      onCancel: () => {
        setToast(null);
      },
    });
  };

  const handleEditProduct = (product: Product) => {
    navigate('/admin/add-product', { state: { product } });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>

        {/* Toast notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
            onConfirm={toast.onConfirm}
            onCancel={toast.onCancel}
          />
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">

              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
              </select>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                className="px-3 py-2 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 text-sm"
                onClick={() => navigate('/admin/add-product')}
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="text-right py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                      <tr key={product.product_id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-gray-200 rounded-xl w-12 h-12 sm:w-16 sm:h-16 overflow-hidden flex items-center justify-center">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images.find(img => img.is_primary)?.url || product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="material-symbols-outlined text-gray-400 text-2xl">image</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm sm:text-base">{product.name}</div>
                              <div className="text-xs text-gray-500 sm:hidden mt-1">
                                <span className="sm:hidden block mt-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(product)}`}>
                                    {getStatusLabel(product)}
                                  </span>
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">ID: {product.product_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-900 hidden md:table-cell">{product.category_id}</td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 font-medium">${Number(product.price).toFixed(2)}</td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-900">{product.stock_quantity}</td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 hidden sm:table-cell">
                          <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusClass(product)}`}>
                            {getStatusLabel(product)}
                          </span>
                        </td>
                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <button className="p-1.5 sm:p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50">
                              <span className="material-symbols-outlined text-base sm:text-lg">visibility</span>
                            </button>
                            <button
                              className="p-1.5 sm:p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50"
                              onClick={() => handleEditProduct(product)}
                            >
                              <span className="material-symbols-outlined text-base sm:text-lg">edit</span>
                            </button>
                            <button
                              className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50"
                              onClick={() => handleRequestDeleteProduct(product.product_id)}
                            >
                              <span className="material-symbols-outlined text-base sm:text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 sm:py-12 px-4 sm:px-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="material-symbols-outlined text-4xl sm:text-5xl text-gray-300 mb-3 sm:mb-4">inventory_2</span>
                          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1">No products found</h3>
                          <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria or add a new product.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination summary */}
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedProducts.length}</span> of{' '}
              <span className="font-medium">{sortedProducts.length}</span> results
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-md border border-gray-200 text-xs sm:text-sm text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-md bg-orange-500 text-white text-xs sm:text-sm">1</button>
              <button className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-md border border-gray-200 text-xs sm:text-sm text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;