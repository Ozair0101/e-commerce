import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="w-full max-w-[1440px] px-5 md:px-10 py-8 md:py-16 bg-white">
            <div className="@container">
                <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-20 items-center">
                    {/* Text Content */}
                    <div
                        className="flex flex-col gap-8 flex-1 max-w-2xl text-center lg:text-left items-center lg:items-start">
                        <div className="flex flex-col gap-4">
                            <span className="text-orange-500 font-bold tracking-wider uppercase text-xs md:text-sm">New Season
                                Collection</span>
                            <h1
                                className="text-gray-800 text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight">
                                Upgrade Your <br /><span className="text-orange-500">Daily Drive.</span>
                            </h1>
                            <h2
                                className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Experience the new standard in lifestyle essentials. Premium quality, unbeatable prices,
                                and lighting-fast delivery straight to your door.
                            </h2>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                className="h-12 px-8 rounded-full bg-gray-800 hover:bg-orange-500 text-white text-base font-bold transition-all transform hover:scale-105">
                                Shop New Arrivals
                            </button>
                            <button
                                className="h-12 px-8 rounded-full bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 text-base font-bold transition-colors flex items-center justify-center gap-2">
                                <span>View Deals</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-6 mt-2">
                            <div className="flex -space-x-3">
                                <img alt="Customer avatar"
                                    className="size-8 rounded-full border-2 border-gray-300 bg-gray-200"
                                    data-alt="Portrait of a smiling young woman"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtjbL5z0n5jzk7D_cAB6WxQRzwMRE6XjHzNUEwzRm8pB-4uZ8s54-XsQaaBwMgPz_CQP49bRRF85ru2qiPJiSob4LvqXHQ4tLepc4tAmJLIfnq6OaOix2WuRFAjgVuj3xC4SOHqlsr-N0N3h4tiIe60hFysGiudnbOJZAyz0t-y17EGH02bnvtB_xypGzaBXcEeMoQg4UPAHmnAIaCd5Svx21-QMaxYTQ6kK6-ARCQOhakXR3CTzvveO9JDsazqHQGQeHCCoBm8rDS" />
                                <img alt="Customer avatar"
                                    className="size-8 rounded-full border-2 border-gray-300 bg-gray-200"
                                    data-alt="Portrait of a man with glasses"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkaaMYWZGstP8vLKq-77fsp37YHV-3afU9uWadyQMnzQ6J8OHmVywOrQA2wBOZsD0CBsgIMZwMwvR75s59GLZyGAv30dFGodhXq3TYnoUGiu9f6v0n1JbvNzuo_mxBMq85hg8sfmd8mBx9JHjY6YdszYpV99Mo9pGAAWWsWxl4ynaRWav3wxJOYC3eCJSz-Xfb3M0xwHZNtZc7KA4TGTIN3prj7fhupIDEfUaDy1u-bCBr4XAFLQYvL2yV2-dIRCw7-nUbcUd_Xcfz" />
                                <img alt="Customer avatar"
                                    className="size-8 rounded-full border-2 border-gray-300 bg-gray-200"
                                    data-alt="Portrait of a smiling man"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8L2cZAIoYX2DaX_IDt15thuxjEyhWLu80io_5MeS_Q6Oj4Ewvuv9uyyzYoyB4tutl_s-ddBgMobnOuNf3jnmWqFCY3d2FelvrGn6ckG3RYn1zmUypqsJG4yi3_d6bZBntrUF3DoqXGdEjbHn_D4G10tJnTsW_kfZAPc8jz2xGmVxkt012nFmUa_W39dkq1hMVlbWLDTbEefKvhNXgK6VHek57Wjik16gOfzNo-N4uzqlPUwKTHJNegzzG1z86WBfl2sthUyqXuGZz" />
                                <div
                                    className="size-8 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-800">
                                    4k+</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-400 text-sm">
                                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                </div>
                                <span className="text-gray-600 text-xs">Trusted by 4,000+ customers</span>
                            </div>
                        </div>
                    </div>
                    {/* Image Content */}
                    <div className="flex-1 w-full lg:h-auto relative">
                        <div
                            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square max-h-[600px] mx-auto">
                            {/* Decorative blurred glow behind image */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/20 blur-[100px] rounded-full">
                            </div>
                            {/* Main Hero Image */}
                            <div
                                className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-gray-300 shadow-2xl bg-gray-50 group">
                                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                                    data-alt="Modern white smartwatch and accessories on a sleek surface"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjwq6fDnnswyrBViyULi5IA6tf2RUXLDSg5sj4eyzyWrkTS1pJQIc7XQp4sLPTlZTjW5f4bEeP1Z9HAv1ACa88Ths2tNyApQnz0k7ZBiKFXgSKNzmY2WYVKlZMOnafRGa-E0riZDKYv3mP2bIdOempTfCn4oryxSfro6OGtqYYVPR-ok59a7l1u9qI1-9Ux4HMSzXQ2DXGkT8ajjE4qPCfI-9sjZteFHJHMXg_lfxp9rRd0MVtN6vrPFBNGNNd8p2w7ZqrCozUC5lg");' }}>
                                </div>
                                {/* Floating Detail Card */}
                                <div
                                    className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-gray-300 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-gray-800 font-bold text-sm">Series 7 Smartwatch</span>
                                        <span className="text-orange-500 text-xs font-bold">$399.00</span>
                                    </div>
                                    <button
                                        className="size-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;