import React from 'react';
import ProductCard, { type Product } from './ProductCard';

const TopSellers: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <section>
      <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-800">Top Sellers</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 p-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default TopSellers;