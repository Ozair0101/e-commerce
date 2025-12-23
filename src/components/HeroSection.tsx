import React from "react";
import heroImage from "../assets/6.jpg";
import customer1 from "../assets/2.jpg";
import customer2 from "../assets/3.jpg";
import customer3 from "../assets/4.jpg";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1440px] px-5 md:px-10 py-8 md:py-16 bg-white">
      <div className="@container">
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-8 flex-1 max-w-2xl text-center lg:text-left items-center lg:items-start">
            <div className="flex flex-col gap-4">
              <span className="text-orange-500 font-bold tracking-wider uppercase text-xs md:text-sm">
                New Season Collection
              </span>
              <h1 className="text-gray-800 text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight">
                Light Up <br />
                <span className="text-orange-500">Your Space.</span>
              </h1>
              <h2 className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
                Celebrate life's special moments with candles as unique as your
                story perfect for baby showers, baptisms, bridal showers, and
                every special occasion.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/shop">
                <button className="h-12 px-8 rounded-full bg-gray-800 hover:bg-orange-500 text-white text-base font-bold transition-all transform hover:scale-105">
                  Shop New Arrivals
                </button>
              </Link>
              <Link to="/shop">
                <button className="h-12 px-8 rounded-full bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 text-base font-bold transition-colors flex items-center justify-center gap-2">
                  <span>View More</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-2">
              <div className="flex -space-x-3">
                <img
                  alt="Customer avatar"
                  className="size-8 rounded-full border-2 border-gray-300 bg-gray-200"
                  src={customer1}
                />
                <img
                  alt="Customer avatar"
                  className="size-8 rounded-full border-2 border-gray-300 bg-gray-200"
                  src={customer2}
                />
                <img
                  alt="Customer avatar"
                  className="size-8 rounded-full border-2 border-gray-300 bg-gray-200"
                  src={customer3}
                />
                <div className="size-8 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-800">
                  4k+
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400 text-sm">
                  <span className="material-symbols-outlined text-[16px] fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-[16px] fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-[16px] fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-[16px] fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-[16px] fill-current">
                    star
                  </span>
                </div>
                <span className="text-gray-600 text-xs">
                  Trusted by 4,000+ customers
                </span>
              </div>
            </div>
          </div>
          {/* Image Content */}
          <div className="flex-1 w-full lg:h-auto relative">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square max-h-[600px] mx-auto">
              {/* Decorative blurred glow behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/20 blur-[100px] rounded-full"></div>
              {/* Main Hero Image */}
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-gray-300 shadow-2xl bg-gray-50 group">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${heroImage})` }}
                ></div>
                {/* Floating Detail Card */}
                {/* <div
                                    className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-gray-300 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-gray-800 font-bold text-sm">Series 7 Smartwatch</span>
                                        <span className="text-orange-500 text-xs font-bold">$399.00</span>
                                    </div>
                                    <button
                                        className="size-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
