import React from 'react';
import { Link } from 'react-router-dom';

const Shop: React.FC = () => {
    return (
        <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 py-5">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 py-4">
                <Link className="text-gray-500 hover:text-orange-500 text-sm font-medium leading-normal" to="/">
                    Home
                </Link>
                <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
                <Link className="text-gray-500 hover:text-orange-500 text-sm font-medium leading-normal" to="#">
                    Electronics
                </Link>
                <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
                <span className="text-gray-800 text-sm font-medium leading-normal">Laptops</span>
            </div>
            {/* Page Heading & Sorting Chips */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 py-4">
                <div className="flex min-w-72 flex-col gap-1">
                    <p className="text-3xl font-black leading-tight tracking-[-0.033em]">Laptops & Notebooks</p>
                    <p className="text-gray-500 text-sm font-normal leading-normal">1-24 of over 1,000 results</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 pl-4 pr-3">
                        <p className="text-sm font-medium leading-normal">Sort by: Featured</p>
                        <span className="material-symbols-outlined text-base">expand_more</span>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 pl-4 pr-3">
                        <p className="text-sm font-medium leading-normal">Price: Low to High</p>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 pl-4 pr-3">
                        <p className="text-sm font-medium leading-normal">Avg. Customer Review</p>
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-4">
                {/* Sticky Left Sidebar (Filter Panel) */}
                <aside className="w-full md:w-64 lg:w-72 md:sticky top-24 self-start flex-shrink-0">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-3">Filter by</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <h4 className="font-semibold text-sm">Brand</h4>
                                    <label className="flex items-center gap-2">
                                        <input
                                            className="form-checkbox rounded border-gray-300 bg-transparent text-orange-500 focus:ring-orange-500/50"
                                            type="checkbox"
                                        />
                                        <span>Apple</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            className="form-checkbox rounded border-gray-300 bg-transparent text-orange-500 focus:ring-orange-500/50"
                                            type="checkbox"
                                        />
                                        <span>Dell</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            className="form-checkbox rounded border-gray-300 bg-transparent text-orange-500 focus:ring-orange-500/50"
                                            type="checkbox"
                                        />
                                        <span>HP</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            className="form-checkbox rounded border-gray-300 bg-transparent text-orange-500 focus:ring-orange-500/50"
                                            type="checkbox"
                                        />
                                        <span>Lenovo</span>
                                    </label>
                                </div>
                                <div className="border-t border-gray-200"></div>
                                <div className="flex flex-col gap-2">
                                    <h4 className="font-semibold text-sm">Price</h4>
                                    <Link className="hover:text-orange-500" to="#">
                                        Under $500
                                    </Link>
                                    <Link className="hover:text-orange-500" to="#">
                                        $500 to $1000
                                    </Link>
                                    <Link className="hover:text-orange-500" to="#">
                                        $1000 to $1500
                                    </Link>
                                    <Link className="hover:text-orange-500" to="#">
                                        $1500 & Above
                                    </Link>
                                </div>
                                <div className="border-t border-gray-200"></div>
                                <div className="flex flex-col gap-2">
                                    <h4 className="font-semibold text-sm">Customer Rating</h4>
                                    <Link className="flex items-center gap-1 hover:text-orange-500" to="#">
                                        <div className="flex text-orange-500">
                                            <span className="material-symbols-outlined !text-xl">star</span>
                                            <span className="material-symbols-outlined !text-xl">star</span>
                                            <span className="material-symbols-outlined !text-xl">star</span>
                                            <span className="material-symbols-outlined !text-xl">star</span>
                                            <span className="material-symbols-outlined !text-xl text-gray-300">star</span>
                                        </div>
                                        <span>& Up</span>
                                    </Link>
                                    <Link className="flex items-center gap-1 hover:text-orange-500" to="#">
                                        <div className="flex text-orange-500">
                                            <span className="material-symbols-outlined !text-xl">star</span>
                                            <span className="material-symbols-outlined !text-xl">star</span>
                                            <span className="material-symbols-outlined !text-xl">star</span>
                                            <span className="material-symbols-outlined !text-xl text-gray-300">star</span>
                                            <span className="material-symbols-outlined !text-xl text-gray-300">star</span>
                                        </div>
                                        <span>& Up</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Product Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Product Card 1 */}
                        <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden group">
                            <div className="aspect-square w-full bg-cover bg-center p-4">
                                <img
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    alt="Silver laptop on a wooden surface"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFbupISqNmsMUU2NfKMXr5y9bzqSrSGT1uBKr3-Cy0RaWn3o7nmIqS4PK-Z5ggRVRBZBdCL1NKqEYns_TH8l97cZUEvK1KJOpjKHca4nK-N2rBI_e5lw4q_mY3ab9wdF4GHKU0RcPLZB6Wv7sb-4dokWQilENTThJom_xeATKr-G_4kB84Vggw91SUZssBy7zvHtycVPJ-PCdgHVAevKowG-1plvXANNT_E1yCjwhgzhImv_WE9NPugvJPGwRDXwOLarD0GhJkHhA"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-base leading-snug mb-2 hover:text-orange-500">
                                    <Link to="#">2023 Pro Laptop, M3 Chip, 8GB RAM, 256GB SSD, 13.6-inch Display, Space Gray</Link>
                                </h3>
                                <div className="flex items-center gap-1 mt-auto">
                                    <div className="flex text-orange-500">
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star_half</span>
                                    </div>
                                    <span className="text-sm text-gray-500">(1,258)</span>
                                </div>
                                <div className="text-right mt-2">
                                    <p className="text-xl font-bold">$1,099.00</p>
                                    <p className="text-sm text-gray-500">
                                        List: <span className="line-through">$1,299.00</span>
                                    </p>
                                    <p className="text-sm text-green-600">Save $200.00 (15%)</p>
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-white">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        {/* Product Card 2 */}
                        <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden group">
                            <div className="aspect-square w-full bg-cover bg-center p-4">
                                <img
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    alt="Sleek black gaming laptop with illuminated keyboard"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDK1o3GrG2RUc8PxfuoSWDxIkfcnMyECByMypaEXwhdGr21XewMMc8wVFQwuUDXPdkk0TXqlGK2Cf5lDykoPJ9uMRR46mw63Bb411tv4jRULX5lpvolbl1gkdH29bDOqob9s6_BMW1LjFv5r3wAu7cUVjwr9Zu3H_XEwmuxFqVm0dSaQ9tAZWfnoG7w3r_P0tRerLnWk1OC97dqKW2OA7DqTu9VjGXl4IzaecVdB5dwawNmM7dgfoDgdjCpix3tARSpWq3uBLuIp8"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-base leading-snug mb-2 hover:text-orange-500">
                                    <Link to="#">Gaming Beast X1, Intel Core i7, 16GB RAM, 1TB SSD, RTX 4060, 15.6-inch 144Hz Display</Link>
                                </h3>
                                <div className="flex items-center gap-1 mt-auto">
                                    <div className="flex text-orange-500">
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg text-gray-300">star</span>
                                    </div>
                                    <span className="text-sm text-gray-500">(892)</span>
                                </div>
                                <div className="text-right mt-2">
                                    <p className="text-xl font-bold">$1,449.99</p>
                                    <p className="text-sm text-gray-500">
                                        List: <span className="line-through">$1,599.99</span>
                                    </p>
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-white">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        {/* Product Card 3 */}
                        <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden group">
                            <div className="aspect-square w-full bg-cover bg-center p-4">
                                <img
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    alt="Lightweight ultrabook on a clean white background"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVaoAHf8lyNH3oZpPeMcjmyIO3hPIJr81ZJYWu4qmLVe6MQeB6UcNT-MOwE4twYIERVMicZWEu1GP7XbVPaEK94ejVjynTMnmlZFmo46ObRwexQRe9_93pdq8rfSnHYVxxCiMH4VgRE6Cf9FydycQ6tQ5s2aZxo59vpr6cFg9xjoVQib4YnuqxmTpHJSAoIRTlC6VAfy7pGesZYpYW4suZgmaznhK-Z2SPOHg0OUj2dOdDW8g7GMHDoynkCaC3iCmQa2tZ9fWkNIE"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-base leading-snug mb-2 hover:text-orange-500">
                                    <Link to="#">UltraSlim Notebook, Ryzen 5, 16GB RAM, 512GB SSD, 14-inch Full HD, Silver</Link>
                                </h3>
                                <div className="flex items-center gap-1 mt-auto">
                                    <div className="flex text-orange-500">
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star_half</span>
                                    </div>
                                    <span className="text-sm text-gray-500">(2,310)</span>
                                </div>
                                <div className="text-right mt-2">
                                    <p className="text-xl font-bold">$749.00</p>
                                    <p className="text-sm text-gray-500">
                                        List: <span className="line-through">$899.00</span>
                                    </p>
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-white">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        {/* Repeat Product Cards */}
                        <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden group">
                            <div className="aspect-square w-full bg-cover bg-center p-4">
                                <img
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    alt="Professional series laptop in a business setting"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXrl_6xNpOq99Vb-GjKbJ2yJ3edptRQCje61NzgWPCN-nA65ibNBar6h5UCcZhh2oP7htp2oTbWe3dyk8bthnDO7btS1vLmGdvcVtWKdu0w-7DO6n_aq84RNxnVcP8uRcuKRWYT9-5hSaVPcbBxNcLO_Ulk6fDecPy0dDeYXyJwDnpkbXdt9PCxEpjPgx01yZPs0_V87XG8_zKYNrX3BApKiSyCuOcmXSpi3T6w4Eo3xJ4gjjsK2eFD6njzoUCU36yfGl9mGJpnlk"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-base leading-snug mb-2 hover:text-orange-500">
                                    <Link to="#">Business ProBook 450, Intel Core i5, 8GB RAM, 256GB SSD, 15.6-inch, Windows 11 Pro</Link>
                                </h3>
                                <div className="flex items-center gap-1 mt-auto">
                                    <div className="flex text-orange-500">
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg text-gray-300">star</span>
                                    </div>
                                    <span className="text-sm text-gray-500">(459)</span>
                                </div>
                                <div className="text-right mt-2">
                                    <p className="text-xl font-bold">$899.99</p>
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-white">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden group">
                            <div className="aspect-square w-full bg-cover bg-center p-4">
                                <img
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    alt="A 2-in-1 convertible laptop in tablet mode"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIxfzYZO80y20q2mgvnC4WWjz7YYxa4JgzeKZOKz9DCq0jrk3IQbVtceOzHzdxI-Dlf6jI7k4AOF3hRdUxzel_vkug7QClApEo7zH5RdnkJQrOmHmKJNmeYk7Rhj96Ghmrk51RKkLUdIix8Wi33LCXYcscuOsmmFkTC39T2sp8OSMFnmyLLLpUwKr_mxryFEJEKLhc89TVL-GjYwjugsl9Y0dUIuZlZCeDQTek8URuwkcpZbdJRqGjwyWoq4VHNSErvvygVj6mkEo"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-base leading-snug mb-2 hover:text-orange-500">
                                    <Link to="#">2-in-1 Touchscreen Laptop, Core i7, 16GB RAM, 512GB SSD, 14-inch QHD Display</Link>
                                </h3>
                                <div className="flex items-center gap-1 mt-auto">
                                    <div className="flex text-orange-500">
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star_half</span>
                                    </div>
                                    <span className="text-sm text-gray-500">(671)</span>
                                </div>
                                <div className="text-right mt-2">
                                    <p className="text-xl font-bold">$1,299.00</p>
                                    <p className="text-sm text-gray-500">
                                        List: <span className="line-through">$1,450.00</span>
                                    </p>
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-white">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden group">
                            <div className="aspect-square w-full bg-cover bg-center p-4">
                                <img
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    alt="Apple laptop on a desk with accessories"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5X8M_l3u1SSBgOHUTxP-weURL6b10nuJkSCjUWIQ63fys1z8M9i41QTLqgj48AHTn4Gx2DCoNsfejMwjvO6S6A2CjwznuM8_JfPl3wtIK-fnD16thmeGJH58muLiNPWnkC49M0w8A116WmBIOZEfGhv4CoE9zLvvUzIrotIS74l3I7e23PIAMWJIFPY_qCmJ2P8TGiG-GTIxqPBlKsmoIsUk556p7WBIbms7qxhmwgOi-4hcdZH5qc_8rVvv7PvzEmmxaMDvX6Uo"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-base leading-snug mb-2 hover:text-orange-500">
                                    <Link to="#">2024 Air Laptop, M3 Chip, 8GB RAM, 512GB SSD, 15-inch Display, Midnight</Link>
                                </h3>
                                <div className="flex items-center gap-1 mt-auto">
                                    <div className="flex text-orange-500">
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                        <span className="material-symbols-outlined !text-lg">star</span>
                                    </div>
                                    <span className="text-sm text-gray-500">(540)</span>
                                </div>
                                <div className="text-right mt-2">
                                    <p className="text-xl font-bold">$1,499.00</p>
                                    <p className="text-sm text-green-600">New Release</p>
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-white">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button className="flex items-center justify-center size-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="flex items-center justify-center size-10 rounded-lg bg-orange-500 text-white font-bold">
                            1
                        </button>
                        <button className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 font-medium">
                            2
                        </button>
                        <button className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 font-medium">
                            3
                        </button>
                        <span className="text-gray-500">...</span>
                        <button className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 font-medium">
                            42
                        </button>
                        <button className="flex items-center justify-center size-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Shop;