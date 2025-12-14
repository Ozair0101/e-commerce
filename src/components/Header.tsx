import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center bg-white text-gray-800 border-b border-gray-200">
      <div className="flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-4xl text-orange-500">storefront</span>
          <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-gray-800">Shopazon</h2>
        </div>
        <div className="hidden flex-1 items-center px-4 lg:flex">
          <label className="flex w-full flex-col">
            <div className="flex h-10 w-full flex-1 items-stretch rounded-lg">
              <div className="flex items-center justify-center rounded-l-lg border border-r border-gray-300 bg-gray-100 px-3 text-sm text-gray-600">
                All
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden border-y border-gray-300 bg-white px-4 text-base font-normal leading-normal text-gray-800 placeholder-gray-500 focus:outline-0 focus:ring-0"
                placeholder="Search Shopazon"
              />
              <div className="flex cursor-pointer items-center justify-center rounded-r-lg bg-orange-500 pl-3 pr-4 text-white">
                <span className="material-symbols-outlined text-2xl">search</span>
              </div>
            </div>
          </label>
        </div>
        <div className="flex items-center justify-end gap-4">
          <button className="hidden flex-col items-start rounded px-2 py-1 text-left hover:bg-gray-100 sm:flex">
            <span className="text-xs font-normal text-gray-600">Hello, sign in</span>
            <span className="text-sm font-bold text-gray-800">Account & Lists</span>
          </button>
          <button className="hidden flex-col items-start rounded px-2 py-1 text-left hover:bg-gray-100 sm:flex">
            <span className="text-xs font-normal text-gray-600">Returns</span>
            <span className="text-sm font-bold text-gray-800">& Orders</span>
          </button>
          <button className="flex items-end gap-1 rounded px-2 py-1 hover:bg-gray-100">
            <div className="relative">
              <span className="material-symbols-outlined text-3xl">shopping_cart</span>
              <span className="absolute -right-1 top-0 text-base font-bold text-orange-500">0</span>
            </div>
            <span className="hidden text-sm font-bold text-gray-800 lg:block">Cart</span>
          </button>
        </div>
      </div>
      <div className="flex w-full max-w-7xl items-center gap-6 px-4 pb-2 pt-1 text-sm font-medium">
        <a className="rounded px-1 hover:bg-gray-100 text-gray-700" href="#">Today's Deals</a>
        <a className="rounded px-1 hover:bg-gray-100 text-gray-700" href="#">Electronics</a>
        <a className="rounded px-1 hover:bg-gray-100 text-gray-700" href="#">Books</a>
        <a className="rounded px-1 hover:bg-gray-100 text-gray-700" href="#">Home & Kitchen</a>
        <a className="rounded px-1 hover:bg-gray-100 text-gray-700" href="#">Fashion</a>
      </div>
    </header>
  );
};

export default Header;