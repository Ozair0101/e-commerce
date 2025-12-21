import React from 'react';
import ProductCard, { type Product } from './ProductCard';

interface TopSellersProps {
  products: Product[];
  loading?: boolean;
}

const TopSellers: React.FC<TopSellersProps> = ({ products, loading }) => {
  return (
    <section>
      <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-800">Our Recent Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 pb-3 shadow-sm animate-pulse h-64"
            >
              <div className="w-full aspect-square rounded-lg bg-gray-100" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
          ))
        ) : products.length > 0 ? (
          products.slice(0, 10).map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No Recent products available.
          </div>
        )}
      </div>
    </section>
  );
};

export default TopSellers;