import React from 'react';

export interface Product {
  id: string;
  title: string;
  price: string;
  rating: number; // 0-5 half steps allowed via .5
  image: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const full = Math.floor(product.rating);
  const half = product.rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 pb-3 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
        style={{ backgroundImage: `url(${product.image})` }}
      />
      <div>
        <p className="text-base font-medium leading-normal">{product.title}</p>
        <div className="flex items-center text-[#ff9900]">
          {Array.from({ length: full }).map((_, i) => (
            <span key={`f-${i}`} className="material-symbols-outlined text-lg">star</span>
          ))}
          {half && <span className="material-symbols-outlined text-lg">star_half</span>}
          {Array.from({ length: empty }).map((_, i) => (
            <span key={`e-${i}`} className="material-symbols-outlined text-lg text-gray-300">star</span>
          ))}
        </div>
        <p className="mt-1 text-right text-lg font-semibold">{product.price}</p>
        <button className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#ff9900] text-gray-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-yellow-600">
          <span className="truncate">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
