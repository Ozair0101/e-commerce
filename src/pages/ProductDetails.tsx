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
          className="material-symbols-outlined !text-base text-[#ff9900]"
          style={icon === 'star_border' ? { fontVariationSettings: '"FILL" 0' } : undefined}
        >
          {icon}
        </span>,
      )
    }
    return <div className="flex gap-0.5 text-primary">{stars}</div>
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
      <main className="px-4 sm:px-6 lg:px-10 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-7xl flex-1">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 p-4">
            <span className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium leading-normal">
              Category
            </span>
            <span className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium leading-normal">
              /
            </span>
            <span className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">
              {product.category_id || 'Products'}
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
                        isActive ? 'border-primary' : 'border-transparent hover:border-primary'
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
              <h1 className="text-text-light dark:text-text-dark tracking-tight text-2xl font-bold leading-tight">
                {product.name}
              </h1>
              <p className="text-blue-500 hover:text-primary text-sm cursor-default">Product ID: {product.product_id}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold">{rating.toFixed(1)}</span>
                {renderStars(rating)}
                <span className="text-blue-500 hover:text-primary text-sm cursor-default">Ratings</span>
              </div>

              <div className="my-4 py-4 border-y border-border-light dark:border-border-dark">
                <div className="flex items-baseline gap-2">
                  {hasDiscount && percent > 0 && (
                    <span className="text-sm -translate-y-1.5 text-red-700 dark:text-red-500">-{percent}%</span>
                  )}
                  <span className="text-3xl font-medium text-red-700 dark:text-red-500">
                    ${finalPrice.toFixed(2)}
                  </span>
                </div>
                {hasDiscount && (
                  <>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                      List Price:{' '}
                      <span className="line-through">${Number(product.price).toFixed(2)}</span>
                    </p>
                    <p className="text-sm mt-1">
                      Save{' '}
                      <span className="font-bold text-green-700 dark:text-green-500">
                        ${savings.toFixed(2)}
                      </span>
                    </p>
                  </>
                )}
              </div>

              <div className="p-4 border border-border-light dark:border-border-dark rounded-xl">
                <p
                  className={`text-lg font-bold ${
                    product.stock_quantity > 0
                      ? 'text-green-700 dark:text-green-500'
                      : 'text-red-700 dark:text-red-500'
                  }`}
                >
                  {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                <p className="text-sm mt-2">
                  Ships from: <span className="font-semibold">PrimeCommerce.com</span>
                </p>
                <p className="text-sm">
                  Sold by: <span className="font-semibold">Your Store</span>
                </p>
                <p className="text-sm mt-1">Available quantity: {product.stock_quantity}</p>

                <div className="mt-4 flex items-center gap-2">
                  <label className="text-sm font-medium" htmlFor="quantity">
                    Qty:
                  </label>
                  <select
                    id="quantity"
                    className="form-select w-20 h-8 text-sm rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark focus:ring-primary focus:border-primary"
                    defaultValue={1}
                  >
                    {[1, 2, 3, 4, 5].map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-primary text-text-light dark:text-background-dark text-base font-medium leading-normal tracking-[0.015em] hover:brightness-90 transition-all"
                  >
                    <span className="truncate">Add to Cart</span>
                  </button>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-orange-300 dark:bg-orange-700 text-text-light dark:text-text-dark text-base font-medium leading-normal tracking-[0.015em] hover:brightness-90 transition-all"
                  >
                    <span className="truncate">Buy Now</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                  <span className="material-symbols-outlined !text-base">lock</span>
                  <span>Secure transaction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simplified product information & reviews placeholder, keeping style */}
          <div className="my-10 border-t border-border-light dark:border-border-dark pt-8">
            <h2 className="text-text-light dark:text-text-dark tracking-light text-xl font-bold">Product information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4 text-sm">
              <div>
                <span className="font-bold w-40 inline-block">Category</span>
                <span>{product.category_id}</span>
              </div>
              <div>
                <span className="font-bold w-40 inline-block">Price</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Local page header (keeps your style, but simpler) */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 lg:px-10 py-3 sticky top-0 z-30 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
                <div className="size-6 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">
                  PrimeCommerce
                </h2>
              </div>
            </div>
          </header>

          {renderBody()}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail