import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

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
  images?: ProductImage[];
}

interface ShopProduct {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  rating: number;
}

type SortOption = 'featured' | 'priceAsc' | 'rating';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

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

  const getRatingForProduct = (id: number) => {
    // Simple deterministic pseudo-rating between 3.0 and 5.0
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

          return {
            id: p.product_id,
            name: p.name,
            price: Number(p.price),
            discountPrice:
              p.discount_price !== null && Number(p.discount_price) < Number(p.price)
                ? Number(p.discount_price)
                : null,
            image: resolveImageUrl(primaryImage?.url),
            rating: getRatingForProduct(p.product_id),
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

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setMinRating(null);
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    // Brand filter: match brand text in product name
    if (selectedBrands.length > 0) {
      list = list.filter((p) =>
        selectedBrands.some((b) => p.name.toLowerCase().includes(b.toLowerCase())),
      );
    }

    // Price range filter on final price
    if (selectedPriceRange) {
      list = list.filter((p) => {
        const price = getFinalPrice(p);
        switch (selectedPriceRange) {
          case 'under-500':
            return price < 500;
          case '500-1000':
            return price >= 500 && price <= 1000;
          case '1000-1500':
            return price > 1000 && price <= 1500;
          case '1500-plus':
            return price > 1500;
          default:
            return true;
        }
      });
    }

    // Rating filter
    if (minRating !== null) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Sorting
    if (sortBy === 'priceAsc') {
      list.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // featured: put discounted first, then by newest id desc
      list.sort((a, b) => {
        const aDiscount = a.discountPrice !== null && a.discountPrice < a.price;
        const bDiscount = b.discountPrice !== null && b.discountPrice < b.price;
        if (aDiscount && !bDiscount) return -1;
        if (!aDiscount && bDiscount) return 1;
        return b.id - a.id;
      });
    }

    return list;
  }, [products, selectedBrands, selectedPriceRange, minRating, sortBy]);

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

      {/* Page Heading & Sorting Chips */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 py-4">
        <div className="flex min-w-72 flex-col gap-1">
          <p className="text-3xl font-black leading-tight tracking-[-0.033em]">All Products</p>
          <p className="text-gray-500 text-sm font-normal leading-normal">
            {loading
              ? 'Loading products...'
              : `${filteredAndSorted.length} product${filteredAndSorted.length === 1 ? '' : 's'} found`}
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setSortBy('featured')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-3 border text-sm font-medium leading-normal ${
              sortBy === 'featured'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-gray-100 text-gray-800 border-transparent'
            }`}
          >
            <span>Sort by: Featured</span>
          </button>
          <button
            type="button"
            onClick={() => setSortBy('priceAsc')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-3 border text-sm font-medium leading-normal ${
              sortBy === 'priceAsc'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-gray-100 text-gray-800 border-transparent'
            }`}
          >
            <span>Price: Low to High</span>
          </button>
          <button
            type="button"
            onClick={() => setSortBy('rating')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-3 border text-sm font-medium leading-normal ${
              sortBy === 'rating'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-gray-100 text-gray-800 border-transparent'
            }`}
          >
            <span>Avg. Customer Review</span>
          </button>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSorted.map((p) => {
                const hasDiscount = p.discountPrice !== null && p.discountPrice < p.price;
                const finalPrice = hasDiscount ? p.discountPrice! : p.price;
                const savings = hasDiscount ? p.price - p.discountPrice! : 0;
                const percent = hasDiscount && p.price > 0 ? Math.round((savings / p.price) * 100) : 0;

                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-orange-500/20"
                  >
                    <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100">
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
                    </div>
                    <div className="px-2 pb-2 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(p.rating)}
                        <span className="text-xs text-gray-500">{p.rating.toFixed(1)}</span>
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
                      <button className="w-full h-12 rounded-xl bg-gray-800 text-white font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
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
          )}
        </div>
      </div>
    </main>
  );
};

export default Shop;