import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  description: string | null;
  price: number;
  discount_price: number | null;
  is_active: boolean;
  stock_quantity: number;
  category_id: string;
  images?: ProductImage[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const data = response.data.data || response.data;
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        let message = 'Failed to load product details';
        if (error.response?.data?.message) {
          message = error.response.data.message;
        }
        setToast({ message, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const closeToast = () => {
    setToast(null);
  };

  const getStatusLabel = (p: Product) => {
    if (!p.is_active) return 'Inactive';
    if (p.stock_quantity === 0) return 'Out of Stock';
    if (p.stock_quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusClass = (p: Product) => {
    if (!p.is_active) return 'bg-gray-100 text-gray-800';
    if (p.stock_quantity === 0) return 'bg-red-100 text-red-800';
    if (p.stock_quantity < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Breadcrumb and header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="hover:text-orange-500"
              >
                Dashboard
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="hover:text-orange-500"
              >
                Products
              </button>
              <span>/</span>
              <span className="font-medium text-gray-800">
                {product?.name || 'Product details'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {product?.name || 'Product details'}
              </h1>
              {product && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  {getStatusLabel(product)}
                </span>
              )}
            </div>

            {product && (
              <p className="text-xs sm:text-sm text-gray-500">
                Product ID: #{product.product_id} • Category ID: {product.category_id}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back
            </button>
          </div>
        </div>

        {/* Main content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
          </div>
        ) : !product ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-600">
            Product not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: gallery and general info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Gallery */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Product gallery</h2>
                  {product.images && product.images.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {product.images.length} image{product.images.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="aspect-video w-full rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={resolveImageUrl(product.images.find((img) => img.is_primary)?.url || product.images[0].url)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-gray-300">image</span>
                  )}
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {product.images.map((img) => (
                      <div
                        key={img.id}
                        className={`w-20 h-20 rounded-md border overflow-hidden flex-shrink-0 ${
                          img.is_primary
                            ? 'border-orange-500 ring-1 ring-orange-300'
                            : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={resolveImageUrl(img.url)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* General info */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-5">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">General information</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Product name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{product.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Category ID</p>
                    <p className="text-sm sm:text-base text-gray-900">{product.category_id}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Description</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {product.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: pricing, inventory, shipping */}
            <div className="flex flex-col gap-6">
              {/* Pricing */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Pricing</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Base price</span>
                    <span className="font-semibold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  {product.discount_price !== null && (
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Discount price</span>
                      <span className="font-semibold text-green-600">
                        ${Number(product.discount_price).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                        product
                      )}`}
                    >
                      {getStatusLabel(product)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Inventory</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Stock quantity</span>
                    <span className="font-semibold text-gray-900">
                      {product.stock_quantity}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1 text-xs text-gray-500">
                      <span>Stock level</span>
                      <span>
                        {product.stock_quantity === 0
                          ? 'Out of stock'
                          : product.stock_quantity < 10
                          ? 'Low stock'
                          : 'In stock'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${Math.max(
                            5,
                            Math.min(100, product.stock_quantity * 5)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping (placeholder) */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 text-sm">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Shipping</h2>
                <p className="text-gray-500 text-xs">
                  Shipping details are not configured yet for this product.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
