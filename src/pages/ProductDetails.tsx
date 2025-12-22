import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

interface ProductImage {
  id: number
  url: string
  is_primary: boolean
}

interface ApiProduct {
  product_id: number
  name: string
  price: number
  discount_price: number | null
  stock_quantity: number
  category_id: string
  images?: ProductImage[]
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<ProductImage | null>(null)
  const [quantity, setQuantity] = useState<number>(1)

  const backendOrigin = useMemo(() => {
    try {
      const base = (api.defaults.baseURL as string) || ''
      return base ? new URL(base).origin : window.location.origin
    } catch {
      return window.location.origin
    }
  }, [])

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return ''

    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url)
        const backend = new URL(backendOrigin)

        const isLocalhost = parsed.hostname === 'localhost'
        const hasNoPort = !parsed.port
        const backendHasPort = !!backend.port

        if (isLocalhost && hasNoPort && backendHasPort) {
          return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`
        }

        return url
      } catch {
        return url
      }
    }

    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`
  }

  const getFinalPrice = (p: ApiProduct) => {
    if (p.discount_price !== null && Number(p.discount_price) < Number(p.price)) {
      return Number(p.discount_price)
    }
    return Number(p.price)
  }

  useEffect(() => {
    if (!id) {
      setError('Invalid product ID')
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get(`/products/${id}`)
        const data: ApiProduct = response.data.data || response.data

        if (!isMounted) return

        setProduct(data)

        const primaryImage =
          data.images && data.images.length > 0
            ? data.images.find((img) => img.is_primary) || data.images[0]
            : null
        setActiveImage(primaryImage)
      } catch (err: any) {
        console.error('Error fetching product details:', err)
        let message = 'Failed to load product details.'
        if (err.response?.data?.message) {
          message = err.response.data.message
        }
        if (isMounted) {
          setError(message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  const rating = useMemo(() => {
    if (!product) return 4.5
    const base = 3.5
    const step = (product.product_id % 5) * 0.3
    return Math.min(5, base + step)
  }, [product])

  const images = product?.images || []
  const heroImageUrl = useMemo(() => {
    if (activeImage) return resolveImageUrl(activeImage.url)
    if (images[0]) return resolveImageUrl(images[0].url)
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhZz0gj8arLag2ceEFB9yyWz9WNk3oSGEWmE6v7ElpCZQ-ojwDkoPDyw8qtI-tvg1yxdXhRWkvEtWUAbmWWhgSONjX0mrtaXEjTDZtWTNBZ25u7ykv06EwhjoGEh82Joqck2Y1GP1Xb9Y1PvdQ3py9up7Vkcy5vYNwvRRdIjHKPS_ND1I7L7GM9woxPMOfMBWlU62VUVWEDzdCwbK8fnzXE-amtrE3QnwA2cf-sDWF9VUGN2emCavB2vsDn5aDtPzkFUGLuzGCv7kp'
  }, [activeImage, images])

  const finalPrice = product ? getFinalPrice(product) : null
  const hasDiscount = product && product.discount_price !== null && finalPrice! < Number(product.price)
  const listPrice = product ? Number(product.price) : null
  const savings = hasDiscount && listPrice !== null ? listPrice - finalPrice! : 0
  const percentOff = hasDiscount && listPrice && listPrice > 0 ? Math.round((savings / listPrice) * 100) : 0

  const reviewsCount = useMemo(() => {
    if (!product) return 0
    return 80 + (product.product_id % 50)
  }, [product])

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleIncreaseQty = () => {
    setQuantity((prev) => Math.min(99, prev + 1))
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{error || 'Product not found.'}</p>
      </div>
    )
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
      <header className="bg-white dark:bg-[#1a2c22] border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a className="flex items-center gap-3" href="#">
              <div className="size-8 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Shopazon</span>
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-medium hover:text-primary transition-colors text-primary" href="#">
                Shop Candles
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Featured Deals
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Our Story
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Contact
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 h-10 w-64 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <span className="material-symbols-outlined text-gray-500 text-[20px]">search</span>
              <input
                className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-gray-400 dark:text-white"
                placeholder="Search..."
                type="text"
              />
            </div>
            <button className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            </button>
            <button className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
            <a className="hover:text-primary transition-colors" href="#">
              Home
            </a>
            <span className="mx-2 text-gray-300">/</span>
            <a className="hover:text-primary transition-colors" href="#">
              {product.category_id || 'Products'}
            </a>
            <span className="mx-2 text-gray-300">/</span>
            <a className="hover:text-primary transition-colors" href="#">
              Signature Collection
            </a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-[2rem] overflow-hidden relative group">
                <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                  {hasDiscount && percentOff > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      -{percentOff}% OFF
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Product #{product.product_id}
                  </span>
                </div>
                <img
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  src={heroImageUrl}
                />
                <button className="absolute bottom-4 right-4 size-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {images.length === 0 && (
                  <button className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined">image</span>
                  </button>
                )}
                {images.map((img) => {
                  const url = resolveImageUrl(img.url)
                  const isActive = activeImage ? activeImage.id === img.id : false
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        isActive
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {url ? (
                        <img alt={product.name} className="w-full h-full object-cover" src={url} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-yellow-400 fill-current text-[20px]">star</span>
                    <span className="material-symbols-outlined text-yellow-400 fill-current text-[20px]">star</span>
                    <span className="material-symbols-outlined text-yellow-400 fill-current text-[20px]">star</span>
                    <span className="material-symbols-outlined text-yellow-400 fill-current text-[20px]">star</span>
                    <span className="material-symbols-outlined text-yellow-400/50 text-[20px]">star_half</span>
                  </div>
                  <a
                    className="text-sm font-medium text-slate-500 hover:text-primary underline decoration-slate-300 underline-offset-4"
                    href="#reviews"
                  >
                    {rating.toFixed(1)} ({reviewsCount} Reviews)
                  </a>
                </div>
                <div className="flex items-end gap-3">
                  {finalPrice !== null && (
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      ${finalPrice.toFixed(2)}
                    </span>
                  )}
                  {hasDiscount && listPrice !== null && (
                    <span className="text-xl text-gray-400 line-through decoration-red-400 mb-1">
                      ${listPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-8">
                This product is part of our {product.category_id || 'catalog'} collection. Pricing and availability are updated
                directly from the store backend, so what you see here reflects the latest information.
              </p>

              <div className="space-y-6 mb-8 border-t border-b border-gray-100 dark:border-gray-800 py-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Select Size</span>
                    <a className="text-xs text-primary font-medium hover:underline" href="#">
                      Size Guide
                    </a>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="cursor-pointer relative">
                      <input className="peer sr-only" name="size" type="radio" value="8oz" />
                      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                        <span className="block font-bold text-sm">8 oz</span>
                        <span className="block text-xs text-gray-400 mt-1">~40 hrs</span>
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input defaultChecked className="peer sr-only" name="size" type="radio" value="12oz" />
                      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all shadow-sm ring-1 ring-transparent peer-checked:ring-primary">
                        <span className="block font-bold text-sm">12 oz</span>
                        <span className="block text-xs text-gray-400 mt-1">~60 hrs</span>
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input className="peer sr-only" name="size" type="radio" value="16oz" />
                      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                        <span className="block font-bold text-sm">16 oz</span>
                        <span className="block text-xs text-gray-400 mt-1">~80 hrs</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">Scent Notes</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-slate-700 dark:text-gray-300">
                      French Lavender
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-slate-700 dark:text-gray-300">
                      Driftwood
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-slate-700 dark:text-gray-300">
                      Eucalyptus
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-slate-700 dark:text-gray-300">
                      Sage
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a2c22] h-14">
                  <button className="px-4 h-full text-gray-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <input
                    className="w-12 text-center bg-transparent border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0"
                    type="text"
                    value={quantity}
                    readOnly
                  />
                  <button className="px-4 h-full text-gray-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
                <button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-14 rounded-xl font-bold hover:bg-primary hover:text-slate-900 dark:hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <span>Add to Cart</span>
                </button>
                <button className="size-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2c22] flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
                  <span className={`material-symbols-outlined ${product.stock_quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock_quantity > 0 ? 'check_circle' : 'cancel'}
                  </span>
                  <span>
                    {product.stock_quantity > 0
                      ? `In stock and ready to ship (${product.stock_quantity} available)`
                      : 'Currently out of stock'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
                  <span className="material-symbols-outlined text-blue-500">local_shipping</span>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
                  <span className="material-symbols-outlined text-primary">eco</span>
                  <span>Sustainable, recyclable packaging</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20" id="reviews">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Comments &amp; Ratings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-[#1a2c22] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 sticky top-24">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Write a Review</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Rating</label>
                      <div className="flex gap-1">
                        <button className="group" type="button">
                          <span className="material-symbols-outlined text-yellow-400 text-2xl group-hover:scale-110 transition-transform">
                            star
                          </span>
                        </button>
                        <button className="group" type="button">
                          <span className="material-symbols-outlined text-yellow-400 text-2xl group-hover:scale-110 transition-transform">
                            star
                          </span>
                        </button>
                        <button className="group" type="button">
                          <span className="material-symbols-outlined text-yellow-400 text-2xl group-hover:scale-110 transition-transform">
                            star
                          </span>
                        </button>
                        <button className="group" type="button">
                          <span className="material-symbols-outlined text-yellow-400 text-2xl group-hover:scale-110 transition-transform">
                            star
                          </span>
                        </button>
                        <button className="group" type="button">
                          <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-2xl group-hover:text-yellow-400 transition-colors">
                            star
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Name</label>
                      <input
                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary"
                        placeholder="Your Name"
                        type="text"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Comment</label>
                      <textarea
                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary"
                        placeholder="How was your experience?"
                        rows={4}
                      ></textarea>
                    </div>

                    <button
                      className="w-full bg-primary text-slate-900 font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
                      type="button"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">4.8</span>
                    <div className="flex text-yellow-400 text-sm mt-1">
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current text-yellow-400/50">star_half</span>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 block">Based on 128 reviews</span>
                  </div>
                  <select className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2c22] text-sm text-slate-700 dark:text-gray-300 focus:ring-primary focus:border-primary">
                    <option>Most Recent</option>
                    <option>Highest Rated</option>
                    <option>Lowest Rated</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      JD
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Jane Doe</h4>
                      <span className="text-xs text-gray-400">2 days ago</span>
                    </div>
                    <div className="flex text-yellow-400 text-sm mb-2">
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                      Absolutely love this scent! It's not too overpowering but fills the room nicely. The packaging was also
                      super secure. Will definitely buy again.
                    </p>
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />

                <div className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                      MS
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Mike Smith</h4>
                      <span className="text-xs text-gray-400">1 week ago</span>
                    </div>
                    <div className="flex text-yellow-400 text-sm mb-2">
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[16px] fill-current">
                        star
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                      Great candle for the price. The burn is even, which is rare for some soy candles I've tried. The scent is
                      very relaxing, perfect for bath time.
                    </p>
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />

                <div className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                      EM
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Emily Martinez</h4>
                      <span className="text-xs text-gray-400">3 weeks ago</span>
                    </div>
                    <div className="flex text-yellow-400 text-sm mb-2">
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                      I was skeptical about ordering candles online without smelling them first, but this one exceeded my
                      expectations. It smells like a luxury hotel lobby. The throw is amazing too, I can smell it in the
                      hallway.
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                    Load More Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-[#1a2c22] border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col items-center text-center gap-8">
          <a className="flex items-center gap-3" href="#">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Shopazon</span>
          </a>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary transition-colors" href="#">
              Shipping Info
            </a>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            &copy; 2024 Shopazon Candles. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ProductDetail