import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

interface Product {
  product_id: number;
  name: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  images?: ProductImage[];
}

const Feature: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

    // Handle absolute URLs
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

    // Relative URL: prepend backend origin (includes correct port)
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/featured-products');
        const data: Product[] = response.data.data || response.data;

        if (!isMounted) return;

        const discounted = data
          .filter((p) => p.discount_price !== null && Number(p.discount_price) < Number(p.price))
          .slice(0, 4);

        setProducts(discounted);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        if (isMounted) {
          setError('Failed to load featured deals.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = products;

  return (
    <main className="flex-grow">
      {/* Featured Deals Section */}
      <section className="py-12 md:py-20 relative overflow-hidden bg-white">
        {/* Background Decoration */}
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          {/* Header & Timer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-wider mb-2">Limited Time Offer</span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 text-gray-800">Weekly <span className="text-orange-500">Glow-Up</span> Deals</h1>
              <p className="text-gray-600 max-w-md">Light up your savings with our hottest candle selections. Grab them before they melt away!</p>
            </div>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && cards.length === 0 && (
              <>
                {Array.from({ length: 4 }).map((_, idx) => (
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
              </>
            )}
            {!loading && error && cards.length === 0 && (
              <div className="md:col-span-2 lg:col-span-4 text-center text-sm text-gray-500 py-10">
                {error}
              </div>
            )}
            {!loading && !error && cards.length === 0 && (
              <div className="md:col-span-2 lg:col-span-4 text-center text-sm text-gray-500 py-10">
                No discounted products available right now.
              </div>
            )}
            {cards.map((product) => {
              const hasDiscount =
                product.discount_price !== null && Number(product.discount_price) < Number(product.price);
              const primaryImage =
                product.images && product.images.length > 0
                  ? product.images.find((img) => img.is_primary) || product.images[0]
                  : undefined;
              const discountPercent = hasDiscount
                ? Math.round(
                    ((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100,
                  )
                : 0;

              return (
                <div
                  key={product.product_id}
                  className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-orange-500/20"
                >
                  <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100">
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                      Deal
                    </div>
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                        -{discountPercent}%
                      </div>
                    )}
                    {primaryImage ? (
                      <img
                        src={resolveImageUrl(primaryImage.url)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-end justify-between mb-4">
                      <div className="flex flex-col">
                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through decoration-red-400">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-gray-800">
                          $
                          {hasDiscount && product.discount_price !== null
                            ? Number(product.discount_price).toFixed(2)
                            : Number(product.price).toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                        {product.stock_quantity > 0
                          ? product.stock_quantity <= 5
                            ? `Only ${product.stock_quantity} left!`
                            : 'In stock'
                          : 'Out of stock'}
                      </span>
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
          {/* Section Footer/Pagination */}
          <div className="flex justify-center mt-12 gap-4">
            <button className="size-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            </div>
            <button className="size-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Feature;