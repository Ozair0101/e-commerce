import React from 'react';

export interface TrendItem {
  id: string;
  title: string;
  image: string;
}

const TrendingRow: React.FC<{ items: TrendItem[] }> = ({ items }) => {
  return (
    <section>
      <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-800">Trending Products</h2>
      <div className="flex overflow-x-auto p-4 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex h-full min-w-60 flex-1 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 pb-3 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div>
                <p className="text-base font-medium leading-normal text-gray-800">{item.title}</p>
                <a className="text-orange-500 text-sm font-normal leading-normal hover:text-orange-600" href="#">Shop now</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingRow;