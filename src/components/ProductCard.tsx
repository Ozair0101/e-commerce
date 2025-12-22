import React from 'react';

export interface Product {
  id: string;
  title: string;
  price: string;
  rating: number; // 0-5 half steps allowed via .5
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const full = Math.floor(product.rating);
  const half = product.rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 pb-3 shadow-sm transition-shadow hover:shadow-lg">
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
        style={{ backgroundImage: `url(${product.image})` }}
      />
      <div>
        <p className="text-base font-medium leading-normal text-gray-800">{product.title}</p>
        <div className="flex items-center text-orange-500">
          {Array.from({ length: full }).map((_, i) => (
            <span key={`f-${i}`} className="material-symbols-outlined text-lg">star</span>
          ))}
          {half && <span className="material-symbols-outlined text-lg">star_half</span>}
          {Array.from({ length: empty }).map((_, i) => (
            <span key={`e-${i}`} className="material-symbols-outlined text-lg text-gray-300">star</span>
          ))}
        </div>
        <p className="mt-1 text-right text-lg font-semibold text-gray-800">{product.price}</p>
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-orange-600"
        >
          <span className="truncate">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;