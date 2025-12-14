import React from 'react';

interface CarouselProps {
  title: string;
  subtitle: string;
  image: string;
}

const Carousel: React.FC<CarouselProps> = ({ title, subtitle, image }) => {
  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="relative w-full overflow-hidden rounded-lg">
        <div className="flex transition-transform duration-700 ease-in-out">
          <div
            className="relative h-64 min-w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
              <h2 className="text-4xl font-bold">{title}</h2>
              <p className="mt-2 text-lg">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;