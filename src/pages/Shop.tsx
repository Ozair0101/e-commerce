import React, { useEffect, useMemo, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

interface ApiProduct {
  product_id: number;
  name: string;
  price: number;
  discount_price: number | null;
  average_rating?: number | null;
  reviews_count?: number;
  images?: ProductImage[];
}

interface ShopProduct {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  rating: number;
  ratingCount: number;
}

type SortOption = 'featured';

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCartFromApiPayload } = useCart();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const backendOrigin = useMemo(() => {
    try {
      const base = (api.defaults.baseURL as string) || '';
      return base ? new URL(base).origin : window.location.origin;
    } catch {
      return window.location.origin;
    }
  }, []);

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url);
        const backend = new URL(backendOrigin);

        const isLocalhost = parsed.hostname === 'localhost';
        const hasNoPort = !parsed.port;
        const backendHasPort = !!backend.port;

        if (isLocalhost && hasNoPort && backendHasPort) {
          return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }

        return url;
      } catch {
        return url;
      }
    }

    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const getFallbackRatingForProduct = (id: number) => {
    // Simple deterministic pseudo-rating between 3.0 and 5.0 used only when no reviews exist yet
    const base = 3;
    const step = (id % 5) * 0.5;
    return Math.min(5, base + step);
  };

  const getFinalPrice = (p: ShopProduct) => {
    if (p.discountPrice !== null && p.discountPrice < p.price) {
      return p.discountPrice;
    }
    return p.price;
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/cart/items', {
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      });
      setCartFromApiPayload(response.data);
    } catch (err) {
      console.error('Error adding item to cart:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/products');
        const data: ApiProduct[] = response.data.data || response.data;

        if (!isMounted) return;

        const mapped: ShopProduct[] = data.map((p) => {
          const primaryImage =
            p.images && p.images.length > 0
              ? p.images.find((img) => img.is_primary) || p.images[0]
              : undefined;

          const hasRealRating = typeof p.average_rating === 'number' && !Number.isNaN(Number(p.average_rating));
          const rating = hasRealRating
            ? Number(p.average_rating)
            : getFallbackRatingForProduct(p.product_id);

          return {
            id: p.product_id,
            name: p.name,
            price: Number(p.price),
            discountPrice:
              p.discount_price !== null && Number(p.discount_price) < Number(p.price)
                ? Number(p.discount_price)
                : null,
            image: resolveImageUrl(primaryImage?.url),
            rating,
            ratingCount: typeof p.reviews_count === 'number' ? p.reviews_count : 0,
          };
        });

        setProducts(mapped);
      } catch (err: any) {
        console.error('Error fetching products for shop page:', err);
        let message = 'Failed to load products.';
        if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [backendOrigin]);

  // Debounce search input so we don't refilter on every keystroke
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }, 250);

    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const priceBounds = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 0 };
    }
    const prices = products.map((p) => getFinalPrice(p));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    // Text search by product name
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term));
    }

    // Max price filter using final price (after discount)
    const effectiveMax =
      maxPriceFilter !== null && maxPriceFilter > 0
        ? maxPriceFilter
        : priceBounds.max;

    if (products.length > 0 && priceBounds.max > 0) {
      list = list.filter((p) => getFinalPrice(p) <= effectiveMax + 1e-6);
    }

    // Featured sorting: discounted first, then newest (by id desc)
    list.sort((a, b) => {
      const aDiscount = a.discountPrice !== null && a.discountPrice < a.price;
      const bDiscount = b.discountPrice !== null && b.discountPrice < b.price;
      if (aDiscount && !bDiscount) return -1;
      if (!aDiscount && bDiscount) return 1;
      return b.id - a.id;
    });

    return list;
  }, [products, searchTerm, maxPriceFilter, priceBounds]);

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filteredAndSorted.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i += 1) {
      const diff = rating - i;
      let icon = 'star_border';
      if (diff >= 0) {
        icon = 'star';
      } else if (diff > -1) {
        icon = 'star_half';
      }
      stars.push(
        <span key={i} className={`material-symbols-outlined !text-lg ${icon === 'star_border' ? 'text-gray-300' : ''}`}>
          {icon}
        </span>,
      );
    }
    return <div className="flex text-orange-500">{stars}</div>;
  };

  return (
    <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 py-5">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 py-4">
        <Link className="text-gray-500 hover:text-orange-500 text-sm font-medium leading-normal" to="/">
          Home
        </Link>
        <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
        <span className="text-gray-800 text-sm font-medium leading-normal">Shop</span>
      </div>

      {/* Page Heading, Search & Price Range */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 py-4">
        <div className="flex min-w-72 flex-col gap-1">
          <p className="text-3xl font-black leading-tight tracking-[-0.033em]">All Products</p>
          <p className="text-gray-500 text-sm font-normal leading-normal">
            {loading
              ? 'Loading products...'
              : `${filteredAndSorted.length} product${filteredAndSorted.length === 1 ? '' : 's'} found`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pl-9 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
              search
            </span>
          </div>
          {products.length > 0 && priceBounds.max > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm">
              <span className="font-medium text-gray-700">Max price:</span>
              <div className="flex items-center gap-2 w-full sm:w-56">
                <span className="text-gray-500 text-xs">
                  ${priceBounds.min.toFixed(0)}
                </span>
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={1}
                  value={
                    maxPriceFilter !== null && maxPriceFilter > 0
                      ? maxPriceFilter
                      : priceBounds.max
                  }
                  onChange={(e) => {
                    setMaxPriceFilter(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-orange-500"
                />
                <span className="text-gray-900 text-xs font-semibold whitespace-nowrap">
                  $
                  {(
                    maxPriceFilter !== null && maxPriceFilter > 0
                      ? maxPriceFilter
                      : priceBounds.max
                  ).toFixed(0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        {/* Product Grid */}
        <div className="flex-1">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[2rem] p-3 shadow-sm border border-gray-200 animate-pulse h-full"
                >
                  <div className="aspect-square w-full rounded-[1.5rem] bg-gray-100 mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              No products match the selected filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pageItems.map((p) => {
                  const hasDiscount = p.discountPrice !== null && p.discountPrice < p.price;
                  const finalPrice = hasDiscount ? p.discountPrice! : p.price;
                  const savings = hasDiscount ? p.price - p.discountPrice! : 0;
                  const percent = hasDiscount && p.price > 0 ? Math.round((savings / p.price) * 100) : 0;

                  return (
                    <div
                      key={p.id}
                      className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-orange-500/20"
                    >
                      <Link
                        to={`/product/${p.id}`}
                        className="block relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100"
                      >
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                          Product
                        </div>
                        {hasDiscount && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                            -{percent}%
                          </div>
                        )}
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <span className="material-symbols-outlined text-4xl">image</span>
                          </div>
                        )}
                      </Link>
                      <div className="px-2 pb-2 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors line-clamp-2">
                          <Link to={`/product/${p.id}`} className="hover:text-orange-500">
                            {p.name}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          {renderStars(p.rating)}
                          <span className="text-xs text-gray-500">
                            {p.rating.toFixed(1)}{p.ratingCount ? ` (${p.ratingCount})` : ''}
                          </span>
                        </div>
                        <div className="flex items-end justify-between mb-4">
                          <div className="flex flex-col items-start">
                            {hasDiscount && (
                              <span className="text-sm text-gray-400 line-through decoration-red-400">
                                ${p.price.toFixed(2)}
                              </span>
                            )}
                            <span className="text-2xl font-bold text-gray-800">
                              ${finalPrice.toFixed(2)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-green-600 mt-1">
                                Save ${savings.toFixed(2)}{percent > 0 ? ` (${percent}% )` : ''}
                              </span>
                            )}
                          </div>
                          {hasDiscount && (
                            <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                              On Sale
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(p.id)}
                          className="w-full h-12 rounded-xl bg-gray-800 text-white font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <span>Add to Cart</span>
                          <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">
                            shopping_bag
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={safePage === 1}
                    className="flex items-center justify-center size-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    const isActive = page === safePage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`flex items-center justify-center min-w-9 px-2 h-9 rounded-lg text-sm font-medium ${{
                          true: isActive,
                        }['true'] ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={safePage === totalPages}
                    className="flex items-center justify-center size-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Shop;