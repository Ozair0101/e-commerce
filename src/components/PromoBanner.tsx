import React from 'react';

const PromoBanner: React.FC<{ title: string; subtitle: string; image: string }> = ({ title, subtitle, image }) => {
  return (
    <div className="p-4">
      <div
        className="flex h-48 w-full flex-col items-center justify-center rounded-lg bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="rounded-lg bg-black/50 p-6 text-center">
          <h3 className="text-3xl font-bold">{title}</h3>
          <p className="mt-2 text-md">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
