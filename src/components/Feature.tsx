import React from 'react';
const Feature: React.FC = () => {
    return (
        <main class="flex-grow">
            <!-- Featured Deals Section -->
            <section class="py-12 md:py-20 relative overflow-hidden">
                <!-- Background Decoration -->
                <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-background-light dark:from-background-dark dark:to-[#0c1a12] -z-10"></div>
                <div class="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div class="max-w-[1280px] mx-auto px-4 md:px-8">
                    <!-- Header & Timer -->
                    <div class="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div class="text-center md:text-left">
                            <span class="inline-block px-3 py-1 rounded-full bg-primary/20 text-green-800 dark:text-green-200 text-xs font-bold uppercase tracking-wider mb-2">Limited Time Offer</span>
                            <h1 class="text-3xl md:text-5xl font-bold leading-tight mb-2">Weekly <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Glow-Up</span> Deals</h1>
                            <p class="text-slate-500 dark:text-gray-400 max-w-md">Light up your savings with our hottest candle selections. Grab them before they melt away!</p>
                        </div>
                        <!-- Countdown Timer -->
                        <div class="flex items-center gap-3 bg-white dark:bg-[#1a2c22] p-4 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800">
                            <div class="flex flex-col items-center">
                                <div class="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg mb-1">
                                    <span class="text-2xl font-bold text-slate-900 dark:text-white">04</span>
                                </div>
                                <span class="text-[10px] font-medium uppercase text-gray-500">Hrs</span>
                            </div>
                            <span class="text-xl font-bold text-gray-300 -mt-5">:</span>
                            <div class="flex flex-col items-center">
                                <div class="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg mb-1">
                                    <span class="text-2xl font-bold text-slate-900 dark:text-white">12</span>
                                </div>
                                <span class="text-[10px] font-medium uppercase text-gray-500">Mins</span>
                            </div>
                            <span class="text-xl font-bold text-gray-300 -mt-5">:</span>
                            <div class="flex flex-col items-center">
                                <div class="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg mb-1">
                                    <span class="text-2xl font-bold text-primary">30</span>
                                </div>
                                <span class="text-[10px] font-medium uppercase text-gray-500">Secs</span>
                            </div>
                        </div>
                    </div>
                    <!-- Product Grid/Carousel -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Card 1: Bestseller -->
                        <div class="group bg-white dark:bg-[#1a2c22] rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20">
                            <div class="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                                <!-- Badge -->
                                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    Bestseller
                                </div>
                                <div class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                                    -28%
                                </div>
                                <!-- Image -->
                                <div class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" data-alt="Lavender candle on wooden table with blurred background" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhZz0gj8arLag2ceEFB9yyWz9WNk3oSGEWmE6v7ElpCZQ-ojwDkoPDyw8qtI-tvg1yxdXhRWkvEtWUAbmWWhgSONjX0mrtaXEjTDZtWTNBZ25u7ykv06EwhjoGEh82Joqck2Y1GP1Xb9Y1PvdQ3py9up7Vkcy5vYNwvRRdIjHKPS_ND1I7L7GM9woxPMOfMBWlU62VUVWEDzdCwbK8fnzXE-amtrE3QnwA2cf-sDWF9VUGN2emCavB2vsDn5aDtPzkFUGLuzGCv7kp');"></div>
                                <!-- Quick View Actions (Hover) -->
                                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button class="size-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button class="size-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div class="px-2 pb-2">
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Lavender Driftwood</h3>
                                <div class="flex items-center gap-1 mb-3">
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px] opacity-50">star</span>
                                    <span class="text-xs text-gray-400 ml-1">(128)</span>
                                </div>
                                <div class="flex items-end justify-between mb-4">
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-400 line-through decoration-red-400">$25.00</span>
                                        <span class="text-2xl font-bold text-slate-900 dark:text-white">$18.00</span>
                                    </div>
                                    <span class="text-xs font-medium text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md">Only 3 left!</span>
                                </div>
                                <button class="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-primary hover:text-slate-900 dark:hover:bg-primary transition-all flex items-center justify-center gap-2 group/btn">
                                    <span>Add to Cart</span>
                                    <span class="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">shopping_bag</span>
                                </button>
                            </div>
                        </div>
                        <!-- Card 2: Bundle -->
                        <div class="group bg-white dark:bg-[#1a2c22] rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20">
                            <div class="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                                <div class="absolute top-3 left-3 bg-primary text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    Bundle Deal
                                </div>
                                <div class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                                    -25%
                                </div>
                                <div class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" data-alt="Three colorful citrus candles arranged artistically" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXDjhUB2bQtcSMNXBYoGVf3mIsiO-myCJL2_nBIWz5QNPyuCq38IqjcW_h-s0r5X1wN6nIscwEsNN7WZsTZ-pyYOx88iGDas85wwERdFT5vziz5FnLQ8iRnnV9ePsdSMOfiWyeOBAC_Di5Zfx8VnqU03C9WCBBNZ3XcN540dO9_t7kWqWhzKBjA8_3c1JjtSosOTEIYN22YKAjiHvJM7gmKpFrG0vrGQccN9XETydldkLAb7Srx-qs-flCwGP2K5X9k3ZpjrYhd2G2');"></div>
                                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button class="size-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button class="size-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div class="px-2 pb-2">
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Citrus Summer Trio</h3>
                                <div class="flex items-center gap-1 mb-3">
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="text-xs text-gray-400 ml-1">(42)</span>
                                </div>
                                <div class="flex items-end justify-between mb-4">
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-400 line-through decoration-red-400">$60.00</span>
                                        <span class="text-2xl font-bold text-slate-900 dark:text-white">$45.00</span>
                                    </div>
                                </div>
                                <button class="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-primary hover:text-slate-900 dark:hover:bg-primary transition-all flex items-center justify-center gap-2 group/btn">
                                    <span>View Bundle</span>
                                    <span class="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">layers</span>
                                </button>
                            </div>
                        </div>
                        <!-- Card 3: Clearance -->
                        <div class="group bg-white dark:bg-[#1a2c22] rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20">
                            <div class="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                                <div class="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    Clearance
                                </div>
                                <div class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                                    -40%
                                </div>
                                <div class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" data-alt="Vanilla bean candle with white wax and vanilla pods" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuC32oK4rUnAHFclLdwSQdth-uyUFr-q9jxlVs9uHZZuEetNfzTaSPoxBfd5Abjk61lihGmUKFsRIGWm3tmvBdYUouNchzeBlwUzI2nV0Sj_AqKit5vi1z81labvFpZ9Qh4wn02T6x_9Bwdk3qTs5s0H7GLHMvgmjOtrC8T2Ur0_wEAmVVPkPM9KbOrQquceZ1VyYIpBNViPNrgcwULN-2--_OkZHeFiWCktozGnv_WXFN1cWv-R-twUfnW8snKu1Bb6bQDJ-q1WbCE3');"></div>
                                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button class="size-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button class="size-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div class="px-2 pb-2">
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Vanilla Bean</h3>
                                <div class="flex items-center gap-1 mb-3">
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star_half</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px] opacity-50">star</span>
                                    <span class="text-xs text-gray-400 ml-1">(89)</span>
                                </div>
                                <div class="flex items-end justify-between mb-4">
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-400 line-through decoration-red-400">$20.00</span>
                                        <span class="text-2xl font-bold text-primary">$12.00</span>
                                    </div>
                                </div>
                                <button class="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-primary hover:text-slate-900 dark:hover:bg-primary transition-all flex items-center justify-center gap-2 group/btn">
                                    <span>Add to Cart</span>
                                    <span class="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">shopping_bag</span>
                                </button>
                            </div>
                        </div>
                        <!-- Card 4: New Arrival -->
                        <div class="group bg-white dark:bg-[#1a2c22] rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20">
                            <div class="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                                <div class="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    New Arrival
                                </div>
                                <div class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-2 rounded-full z-10 shadow-sm w-12 h-12 flex items-center justify-center">
                                    -14%
                                </div>
                                <div class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700" data-alt="Dark midnight blue candle emitting soft glow" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBg1Aar9vZaQRsimYrDPb6hOmyRt7rFEkT4otU50klSFsL8PazrdcwYFGJbKrWCadQ1fYI6Jv2GOhJR3TsLR7tRL3ph7Ehh0ZBth5lIkTqZWcakibKeM4xZp1I8YttVE69_xH6cYyDI0pG-jLc4xv8px82aWSHYhe7XSGZa-DWMdhRYgUgHTnHAGEQRqgJ2erkrWX51rk2fgewgoeb4E2ywdIjEXrSo4Ck_14i9CTukPzo2IUNvFZ3JIa8fOEsZtO1-BbrFA1tQ1fKj');"></div>
                                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button class="size-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button class="size-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div class="px-2 pb-2">
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Midnight Musk</h3>
                                <div class="flex items-center gap-1 mb-3">
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                    <span class="text-xs text-gray-400 ml-1">(15)</span>
                                </div>
                                <div class="flex items-end justify-between mb-4">
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-400 line-through decoration-red-400">$28.00</span>
                                        <span class="text-2xl font-bold text-slate-900 dark:text-white">$24.00</span>
                                    </div>
                                </div>
                                <button class="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-primary hover:text-slate-900 dark:hover:bg-primary transition-all flex items-center justify-center gap-2 group/btn">
                                    <span>Add to Cart</span>
                                    <span class="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">shopping_bag</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- Section Footer/Pagination -->
                    <div class="flex justify-center mt-12 gap-4">
                        <button class="size-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-slate-900 transition-all">
                            <span class="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div class="flex gap-2 items-center">
                            <div class="w-3 h-3 rounded-full bg-primary"></div>
                            <div class="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <div class="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                        <button class="size-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-slate-900 transition-all">
                            <span class="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Feature;

