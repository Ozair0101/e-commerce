import React from 'react';

export interface Category {
  id: string;
  name: string;
  image: string;
}

const Categories: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <section>
      <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-800">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 pb-3 shadow-sm transition-shadow hover:shadow-lg"
          >
            <div
              className="h-40 w-full rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${c.image})` }}
            />
            <p className="text-base font-medium leading-normal text-gray-800">{c.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;