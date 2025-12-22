import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import Toast from '../../components/Toast';

interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

interface Category {
  category_id: number;
  name: string;
  description?: string | null;
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
  category?: Category;
  images?: ProductImage[];
}

interface ProductReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

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

    // Handle absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url);
        const backend = new URL(backendOrigin);

        // If the image URL points to localhost with no port, but our API has a port (e.g. :8000),
        // normalize it to use the backend origin so assets are served from the correct host:port.
        const isLocalhost = parsed.hostname === 'localhost';
        const hasNoPort = !parsed.port;
        const backendHasPort = !!backend.port;

        if (isLocalhost && hasNoPort && backendHasPort) {
          return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }

        return url;
      } catch {
        // If URL parsing fails, just fall back to the original URL
        return url;
      }
    }

    // Relative URL: prepend backend origin (includes correct port)
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const data = response.data.data || response.data;
        setProduct(data);

        if (data && data.images && data.images.length > 0) {
          const primary = data.images.find((img: ProductImage) => img.is_primary);
          setActiveImageId(primary ? primary.id : data.images[0].id);
        } else {
          setActiveImageId(null);
        }
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

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        setReviewsLoading(true);
        const response = await api.get(`/products/${id}/reviews`, {
          params: { per_page: 100 },
        });

        const payload = response.data.data || response.data;
        const data: ProductReview[] = payload.data || payload;
        setReviews(data || []);
      } catch (error) {
        console.error('Error fetching product reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchReviews();
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

  const handleDeleteReview = async (reviewId: number) => {
    if (!id) return;
    try {
      setDeletingReviewId(reviewId);
      await api.delete(`/products/${id}/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setToast({ message: 'Review deleted successfully', type: 'success' });
    } catch (error: any) {
      console.error('Error deleting review:', error);
      let message = 'Failed to delete review';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      setToast({ message, type: 'error' });
    } finally {
      setDeletingReviewId(null);
    }
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
                Product ID: #{product.product_id} • Category: {product.category?.name || `ID: ${product.category_id}`}
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
                    (() => {
                      const fallbackMain =
                        product.images.find((img) => img.is_primary) || product.images[0];
                      const mainImage =
                        (activeImageId
                          ? product.images.find((img) => img.id === activeImageId)
                          : fallbackMain) || fallbackMain;

                      return (
                        <img
                          src={resolveImageUrl(mainImage.url)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      );
                    })()
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-gray-300">image</span>
                  )}
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {product.images.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setActiveImageId(img.id)}
                        className={`w-20 h-20 rounded-md border overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          img.id === activeImageId || (!activeImageId && img.is_primary)
                            ? 'border-orange-500 ring-1 ring-orange-300'
                            : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={resolveImageUrl(img.url)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
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
                    <p className="text-sm sm:text-base text-gray-900">{product.category?.name || `ID: ${product.category_id}`}</p>
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

            {/* Right side: pricing, inventory, shipping, reviews */}
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

              {/* Product reviews */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Customer reviews</h2>
                  {reviewsLoading ? (
                    <span className="text-xs text-gray-500">Loading...</span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {reviews.length === 0 ? 'No reviews yet' : `${reviews.length} review${reviews.length > 1 ? 's' : ''}`}
                    </span>
                  )}
                </div>

                {reviews.length === 0 && !reviewsLoading && (
                  <p className="text-xs text-gray-500">There are no reviews for this product yet.</p>
                )}

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {reviews.map((review) => {
                    const initials = review.name
                      .split(' ')
                      .filter((p) => p.length > 0)
                      .slice(0, 2)
                      .map((p) => p[0].toUpperCase())
                      .join('') || 'U';

                    const created = new Date(review.created_at);
                    const createdLabel = Number.isNaN(created.getTime())
                      ? ''
                      : created.toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        });

                    return (
                      <div
                        key={review.id}
                        className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                      >
                        <div className="flex-shrink-0">
                          <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-semibold">
                            {initials}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-gray-900 truncate">{review.name}</span>
                              {createdLabel && (
                                <span className="text-[10px] text-gray-400">{createdLabel}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[14px]">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`material-symbols-outlined text-[14px] ${
                                    star <= review.rating ? 'text-orange-500' : 'text-gray-300'
                                  }`}
                                >
                                  {star <= review.rating ? 'star' : 'star_border'}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 whitespace-pre-line break-words">
                            {review.comment}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={deletingReviewId === review.id}
                          className="ml-2 flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          title="Delete review"
                        >
                          <span className="material-symbols-outlined text-base">
                            {deletingReviewId === review.id ? 'hourglass_top' : 'delete'}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
