import React from 'react';

const Feature: React.FC = () => {
    return (
        <main className="flex-grow">
            {/* Featured Deals Section */}
            <section className="py-12 md:py-20 relative overflow-hidden bg-white">
                {/* Background Decoration */}
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    {/* Header & Timer */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div className="text-center md:text-left">
                            <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-wider mb-2">Limited Time Offer</span>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 text-gray-800">Weekly <span className="text-orange-500">Glow-Up</span> Deals</h1>
                            <p className="text-gray-600 max-w-md">Light up your savings with our hottest candle selections. Grab them before they melt away!</p>
                        </div>
                        {/* Countdown Timer */}
                        <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-200">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg mb-1">
                                    <span className="text-2xl font-bold text-gray-800">04</span>
                                </div>
                                <span className="text-[10px] font-medium uppercase text-gray-500">Hrs</span>
                            </div>
                            <span className="text-xl font-bold text-gray-300 -mt-5">:</span>
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg mb-1">
                                    <span className="text-2xl font-bold text-gray-800">12</span>
                                </div>
                                <span className="text-[10px] font-medium uppercase text-gray-500">Mins</span>
                            </div>
                            <span className="text-xl font-bold text-gray-300 -mt-5">:</span>
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg mb-1">
                                    <span className="text-2xl font-bold text-orange-500">30</span>
                                </div>
                                <span className="text-[10px] font-medium uppercase text-gray-500">Secs</span>
                            </div>
                        </div>
                    </div>
                    {/* Product Grid/Carousel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Card 1: Bestseller */}
                        <div className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-orange-500/20">
                            <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100">
                                {/* Badge */}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    Bestseller
                                </div>
                                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                                    -28%
                                </div>
                                {/* Image */}
                                <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhZz0gj8arLag2ceEFB9yyWz9WNk3oSGEWmE6v7ElpCZQ-ojwDkoPDyw8qtI-tvg1yxdXhRWkvEtWUAbmWWhgSONjX0mrtaXEjTDZtWTNBZ25u7ykv06EwhjoGEh82Joqck2Y1GP1Xb9Y1PvdQ3py9up7Vkcy5vYNwvRRdIjHKPS_ND1I7L7GM9woxPMOfMBWlU62VUVWEDzdCwbK8fnzXE-amtrE3QnwA2cf-sDWF9VUGN2emCavB2vsDn5aDtPzkFUGLuzGCv7kp')" }}></div>
                                {/* Quick View Actions (Hover) */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors">Lavender Driftwood</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px] opacity-50">star</span>
                                    <span className="text-xs text-gray-400 ml-1">(128)</span>
                                </div>
                                <div className="flex items-end justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400 line-through decoration-red-400">$25.00</span>
                                        <span className="text-2xl font-bold text-gray-800">$18.00</span>
                                    </div>
                                    <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-md">Only 3 left!</span>
                                </div>
                                <button className="w-full h-12 rounded-xl bg-gray-800 text-white font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                                    <span>Add to Cart</span>
                                    <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">shopping_bag</span>
                                </button>
                            </div>
                        </div>
                        {/* Card 2: Bundle */}
                        <div className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-orange-500/20">
                            <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100">
                                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    Bundle Deal
                                </div>
                                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                                    -25%
                                </div>
                                <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXDjhUB2bQtcSMNXBYoGVf3mIsiO-myCJL2_nBIWz5QNPyuCq38IqjcW_h-s0r5X1wN6nIscwEsNN7WZsTZ-pyYOx88iGDas85wwERdFT5vziz5FnLQ8iRnnV9ePsdSMOfiWyeOBAC_Di5Zfx8VnqU03C9WCBBNZ3XcN540dO9_t7kWqWhzKBjA8_3c1JjtSosOTEIYN22YKAjiHvJM7gmKpFrG0vrGQccN9XETydldkLAb7Srx-qs-flCwGP2K5X9k3ZpjrYhd2G2')" }}></div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors">Citrus Summer Trio</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="text-xs text-gray-400 ml-1">(42)</span>
                                </div>
                                <div className="flex items-end justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400 line-through decoration-red-400">$60.00</span>
                                        <span className="text-2xl font-bold text-gray-800">$45.00</span>
                                    </div>
                                </div>
                                <button className="w-full h-12 rounded-xl bg-gray-800 text-white font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                                    <span>View Bundle</span>
                                    <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">layers</span>
                                </button>
                            </div>
                        </div>
                        {/* Card 3: Clearance */}
                        <div className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-orange-500/20">
                            <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100">
                                <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    Clearance
                                </div>
                                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                                    -40%
                                </div>
                                <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC32oK4rUnAHFclLdwSQdth-uyUFr-q9jxlVs9uHZZuEetNfzTaSPoxBfd5Abjk61lihGmUKFsRIGWm3tmvBdYUouNchzeBlwUzI2nV0Sj_AqKit5vi1z81labvFpZ9Qh4wn02T6x_9Bwdk3qTs5s0H7GLHMvgmjOtrC8T2Ur0_wEAmVVPkPM9KbOrQquceZ1VyYIpBNViPNrgcwULN-2--_OkZHeFiWCktozGnv_WXFN1cWv-R-twUfnW8snKu1Bb6bQDJ-q1WbCE3')" }}></div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors">Vanilla Bean</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star_half</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px] opacity-50">star</span>
                                    <span className="text-xs text-gray-400 ml-1">(89)</span>
                                </div>
                                <div className="flex items-end justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400 line-through decoration-red-400">$20.00</span>
                                        <span className="text-2xl font-bold text-orange-500">$12.00</span>
                                    </div>
                                </div>
                                <button className="w-full h-12 rounded-xl bg-gray-800 text-white font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                                    <span>Add to Cart</span>
                                    <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">shopping_bag</span>
                                </button>
                            </div>
                        </div>
                        {/* Card 4: New Arrival */}
                        <div className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-orange-500/20">
                            <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100">
                                <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    New Arrival
                                </div>
                                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                                    -14%
                                </div>
                                <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBg1Aar9vZaQRsimYrDPb6hOmyRt7rFEkT4otU50klSFsL8PazrdcwYFGJbKrWCadQ1fYI6Jv2GOhJR3TsLR7tRL3ph7Ehh0ZBth5lIkTqZWcakibKeM4xZp1I8YttVE69_xH6cYyDI0pG-jLc4xv8px82aWSHYhe7XSGZa-DWMdhRYgUgHTnHAGEQRqgJ2erkrWX51rk2fgewgoeb4E2ywdIjEXrSo4Ck_14i9CTukPzo2IUNvFZ3JIa8fOEsZtO1-BbrFA1tQ1fKj')" }}></div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors">Midnight Musk</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span className="text-xs text-gray-400 ml-1">(15)</span>
                                </div>
                                <div className="flex items-end justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400 line-through decoration-red-400">$28.00</span>
                                        <span className="text-2xl font-bold text-gray-800">$24.00</span>
                                    </div>
                                </div>
                                <button className="w-full h-12 rounded-xl bg-gray-800 text-white font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                                    <span>Add to Cart</span>
                                    <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">shopping_bag</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Section Footer/Pagination */}
                    <div className="flex justify-center mt-12 gap-4">
                        <button className="size-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="flex gap-2 items-center">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                        </div>
                        <button className="size-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all">
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Feature;