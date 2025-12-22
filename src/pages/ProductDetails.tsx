import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

  const renderStars = (value: number) => {
    const stars = []
    for (let i = 1; i <= 5; i += 1) {
      const diff = value - i
      let icon = 'star_border'
      if (diff >= 0) icon = 'star'
      else if (diff > -1) icon = 'star_half'
      stars.push(
        <span
          key={i}
          className="material-symbols-outlined !text-base text-orange-500"
          style={icon === 'star_border' ? { fontVariationSettings: '"FILL" 0' } : undefined}
        >
          {icon}
        </span>,
      )
    }
    return <div className="flex gap-0.5 text-orange-500">{stars}</div>
  }

  const renderBody = () => {
    if (loading) {
      return (
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500" />
        </div>
      )
    }

    if (error || !product) {
      return (
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-sm text-gray-500">{error || 'Product not found.'}</p>
        </div>
      )
    }

    const finalPrice = getFinalPrice(product)
    const hasDiscount = product.discount_price !== null && finalPrice < Number(product.price)
    const savings = hasDiscount ? Number(product.price) - finalPrice : 0
    const percent = hasDiscount && product.price > 0 ? Math.round((savings / Number(product.price)) * 100) : 0

    const images = product.images || []

    return (
      <main className="w-full flex-1 flex justify-center bg-white py-6">
        <div className="flex flex-col w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10">

          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 py-4">
            <Link className="text-gray-500 hover:text-orange-500 text-sm font-medium leading-normal" to="/">
              Home
            </Link>
            <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
            <span className="text-gray-800 text-sm font-medium leading-normal">Shop</span>
            <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
            <span className="text-gray-800 text-sm font-medium leading-normal line-clamp-1 max-w-xs sm:max-w-sm md:max-w-md">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left: Images */}
            <div className="lg:col-span-6 flex flex-col md:flex-row gap-4">
              <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto pb-2 md:pb-0">
                {images.length === 0 && (
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gray-100 text-gray-300">
                    <span className="material-symbols-outlined text-2xl">image</span>
                  </div>
                )}
                {images.map((img) => {
                  const url = resolveImageUrl(img.url)
                  const isActive = activeImage ? activeImage.id === img.id : false
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 flex-shrink-0 rounded-lg border-2 overflow-hidden ${
                        isActive ? 'border-orange-500' : 'border-transparent hover:border-orange-500'
                      }`}
                    >
                      {url ? (
                        <img
                          src={url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                          <span className="material-symbols-outlined text-2xl">image</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="w-full flex-1 order-1 md:order-2">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl aspect-square"
                  data-alt={product.name}
                  style={{
                    backgroundImage: activeImage
                      ? `url(${resolveImageUrl(activeImage.url)})`
                      : images[0]
                        ? `url(${resolveImageUrl(images[0].url)})`
                        : 'none',
                  }}
                >
                  {!activeImage && images.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                      <span className="material-symbols-outlined text-5xl">image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-200 flex flex-col gap-4">
                <div>
                  <h1 className="text-gray-900 tracking-tight text-2xl font-bold leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-orange-500 text-xs sm:text-sm cursor-default mt-1">
                    Product ID: {product.product_id}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-sm sm:text-base">{rating.toFixed(1)}</span>
                    {renderStars(rating)}
                    <span className="text-gray-500 text-xs sm:text-sm cursor-default">Ratings</span>
                  </div>
                </div>

                <div className="py-3 border-y border-gray-200">
                  <div className="flex items-baseline gap-2">
                    {hasDiscount && percent > 0 && (
                      <span className="text-xs sm:text-sm -translate-y-1 text-red-600 bg-red-50 rounded-full px-2 py-0.5 font-semibold">
                        -{percent}%
                      </span>
                    )}
                    <span className="text-3xl font-semibold text-gray-900">
                      ${finalPrice.toFixed(2)}
                    </span>
                  </div>
                  {hasDiscount && (
                    <>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        List Price:{' '}
                        <span className="line-through">${Number(product.price).toFixed(2)}</span>
                      </p>
                      <p className="text-xs sm:text-sm mt-1 text-green-700">
                        Save{' '}
                        <span className="font-bold">
                          ${savings.toFixed(2)}
                        </span>
                        {percent > 0 ? ` (${percent}% )` : ''}
                      </p>
                    </>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-3">
                  <div>
                    <p
                      className={`text-sm sm:text-base font-bold ${
                        product.stock_quantity > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                    <p className="text-xs sm:text-sm mt-1">
                      Ships from: <span className="font-semibold">PrimeCommerce.com</span>
                    </p>
                    <p className="text-xs sm:text-sm">
                      Sold by: <span className="font-semibold">Your Store</span>
                    </p>
                    <p className="text-xs sm:text-sm mt-1">Available quantity: {product.stock_quantity}</p>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <label className="text-xs sm:text-sm font-medium" htmlFor="quantity">
                      Qty:
                    </label>
                    <select
                      id="quantity"
                      className="form-select w-20 h-8 text-xs sm:text-sm rounded-lg bg-white border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                      defaultValue={1}
                    >
                      {[1, 2, 3, 4, 5].map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      type="button"
                      className="w-full h-11 rounded-full bg-gray-800 text-white text-sm sm:text-base font-semibold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                    >
                      <span className="truncate">Add to Cart</span>
                      <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">
                        shopping_bag
                      </span>
                    </button>
                    <button
                      type="button"
                      className="w-full h-11 rounded-full bg-white text-gray-900 border border-gray-300 text-sm sm:text-base font-semibold hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="truncate">Buy Now</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-500">
                    <span className="material-symbols-outlined !text-base">lock</span>
                    <span>Secure transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simplified product information & reviews placeholder, keeping style */}
          <div className="my-10 border-t border-gray-200 pt-8">
            <h2 className="text-gray-900 tracking-light text-xl font-bold">Product information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4 text-sm">
              <div>
                <span className="font-bold w-40 inline-block text-gray-700">Category</span>
                <span className="text-gray-700">{product.category_id}</span>
              </div>
              <div>
                <span className="font-bold w-40 inline-block text-gray-700">Price</span>
                <span className="text-gray-700">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex h-full grow flex-col">{renderBody()}</div>
      </div>
    </div>
  )
}

export default ProductDetail