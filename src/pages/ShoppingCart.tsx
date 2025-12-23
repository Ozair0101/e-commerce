import React, { useEffect, useMemo, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface CartProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

interface CartProduct {
  product_id: number;
  name: string;
  price: number;
  discount_price: number | null;
  images?: CartProductImage[];
}

interface CartItem {
  cart_item_id: number;
  product_id: number;
  quantity: number;
  product: CartProduct;
}

interface CartResponse {
  cart_id: number;
  user_id: number;
  items: CartItem[];
}

const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { setCartFromApiPayload } = useCart();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [clearing, setClearing] = useState<boolean>(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState<boolean>(false);
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingForm, setShippingForm] = useState({
    email: user?.email || '',
    first_name: user?.name?.split(' ')[0] || '',
    last_name: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
  });

  const backendOrigin = useMemo(() => {
    try {
      const base = (api.defaults.baseURL as string) || '';
      return base ? new URL(base).origin : window.location.origin;
    } catch {
      return window.location.origin;
    }
  }, []);

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url);
        const backend = new URL(backendOrigin);

        const isLocalhost = parsed.hostname === 'localhost';
        const hasNoPort = !parsed.port;
        const backendHasPort = !!backend.port;

        if (isLocalhost && hasNoPort && backendHasPort) {
          return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }

        return url;
      } catch {
        return url;
      }
    }

    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const getFinalPrice = (p: CartProduct) => {
    if (p.discount_price !== null && Number(p.discount_price) < Number(p.price)) {
      return Number(p.discount_price);
    }
    return Number(p.price);
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/cart', {
        params: { user_id: user.id },
      });

      const payload = response.data;
      const data: CartResponse = payload.data || payload;
      setCart(data);
      setCartFromApiPayload(payload);
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      let message = 'Failed to load cart.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchCart();
    }
  }, [authLoading, user]);

  const items = cart?.items || [];

  const subtotal = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((sum, item) => {
      const price = getFinalPrice(item.product);
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const handleChangeQuantity = async (item: CartItem, quantity: number) => {
    if (!cart || quantity < 1) return;
    try {
      setUpdatingItemId(item.cart_item_id);
      const response = await api.put(`/cart/items/${item.cart_item_id}`, {
        quantity,
      });
      const payload = response.data;
      const data: CartResponse = payload.data || payload;
      setCart(data);
      setCartFromApiPayload(payload);
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    if (!cart) return;
    try {
      setRemovingItemId(item.cart_item_id);
      const response = await api.delete(`/cart/items/${item.cart_item_id}`);
      const payload = response.data;
      const data: CartResponse = payload.data || payload;
      setCart(data);
      setCartFromApiPayload(payload);
    } catch (err) {
      console.error('Error removing cart item:', err);
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!cart) return;
    try {
      setClearing(true);
      const response = await api.delete(`/cart/${cart.cart_id}/clear`);
      const payload = response.data;
      const data: CartResponse = payload?.data || { ...cart, items: [] };
      setCart(data);
      setCartFromApiPayload(payload || data);
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setClearing(false);
    }
  };

  const handleProceedToCheckoutClick = () => {
    if (!items.length || !cart) return;
    setShippingError(null);
    setIsShippingModalOpen(true);
  };

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !cart || !items.length) return;

    try {
      setSubmittingOrder(true);
      setShippingError(null);

      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        variant_id: null,
        quantity: item.quantity,
      }));

      const payload = {
        user_id: user.id,
        payment_method: 'cod',
        items: orderItems,
        from_cart_id: cart.cart_id,
        email: shippingForm.email,
        first_name: shippingForm.first_name,
        last_name: shippingForm.last_name,
        address: shippingForm.address,
        city: shippingForm.city,
        state: shippingForm.state,
        zip_code: shippingForm.zip_code,
        phone: shippingForm.phone,
      };

      const response = await api.post('/orders', payload);
      const data = response.data?.data || response.data;

      setCart({ cart_id: cart.cart_id, user_id: cart.user_id, items: [] });
      setCartFromApiPayload({ data: { ...cart, items: [] } });

      setIsShippingModalOpen(false);
      navigate(`/orders/${data.order_id}`);
    } catch (err: any) {
      let message = 'Failed to place order.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setShippingError(message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (authLoading || (loading && !cart)) {
    return (
      <main className="flex-1 flex items-center justify-center bg-white text-gray-800">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading cart...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 flex items-center mt-18 justify-center bg-white text-gray-800 px-4">
        <div className="max-w-md w-full text-center border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-sm text-gray-600 mb-4">
            Please sign in to view and manage your shopping cart.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
            >
              Go to Login
            </button>
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-screen-xl mx-auto mt-18 px-4 sm:px-6 md:px-10 py-8 bg-white text-gray-800 flex-1">
      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        <Link className="text-gray-500 hover:text-orange-500 font-medium" to="/">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-800 font-medium">Shopping Cart</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-[-0.03em] text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length === 0
              ? 'You have no items in your cart yet.'
              : `You have ${items.length} item${items.length > 1 ? 's' : ''} in your cart.`}
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            disabled={clearing}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">delete_sweep</span>
            {clearing ? 'Clearing...' : 'Clear cart'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600 mb-4">Your cart is currently empty.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 items-start">
          <section className="space-y-4">
            {items.map((item) => {
              const { product } = item;
              const primaryImage =
                product.images && product.images.length > 0
                  ? product.images.find((img) => img.is_primary) || product.images[0]
                  : undefined;
              const imageUrl = resolveImageUrl(primaryImage?.url);
              const finalPrice = getFinalPrice(product);

              return (
                <div
                  key={item.cart_item_id}
                  className="flex gap-4 sm:gap-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm"
                >
                  <Link
                    to={`/product/${product.product_id}`}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="material-symbols-outlined text-3xl">image</span>
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/product/${product.product_id}`}
                          className="text-sm sm:text-base font-semibold text-gray-900 hover:text-orange-500 line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">Product #{product.product_id}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        disabled={removingItemId === item.cart_item_id}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 rounded-full p-1 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {removingItemId === item.cart_item_id ? 'hourglass_top' : 'close'}
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3 mt-1">
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          ${finalPrice.toFixed(2)}
                        </span>
                        {product.discount_price !== null && Number(product.discount_price) < Number(product.price) && (
                          <span className="text-xs text-gray-400 line-through">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-white h-9">
                          <button
                            type="button"
                            onClick={() => handleChangeQuantity(item, item.quantity - 1)}
                            disabled={updatingItemId === item.cart_item_id || item.quantity <= 1}
                            className="px-2 h-full text-gray-500 hover:text-orange-500 disabled:opacity-40"
                          >
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                          </button>
                          <input
                            className="w-10 text-center bg-transparent border-none p-0 text-gray-900 text-sm font-semibold focus:ring-0"
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const next = Number(e.target.value) || 1;
                              handleChangeQuantity(item, next);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleChangeQuantity(item, item.quantity + 1)}
                            disabled={updatingItemId === item.cart_item_id}
                            className="px-2 h-full text-gray-500 hover:text-orange-500 disabled:opacity-40"
                          >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-500">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2 mb-5">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckoutClick}
              className="w-full h-11 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Proceed to Checkout
            </button>

            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="w-full h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Continue Shopping
            </button>
          </aside>
        </div>
      )}
      {isShippingModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-2xl mx-4 shadow-xl relative text-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsShippingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {shippingError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {shippingError}
              </div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmitShipping}>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-3 px-3 transition-colors"
                  placeholder="you@example.com"
                  type="email"
                  name="email"
                  value={shippingForm.email}
                  onChange={handleShippingInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  First Name
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-3 px-3 transition-colors"
                  placeholder="First Name"
                  type="text"
                  name="first_name"
                  value={shippingForm.first_name}
                  onChange={handleShippingInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Last Name
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-3 px-3 transition-colors"
                  placeholder="Last Name"
                  type="text"
                  name="last_name"
                  value={shippingForm.last_name}
                  onChange={handleShippingInputChange}
                  required
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Address
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-3 px-3 transition-colors"
                  placeholder="Street Address, Apt, Suite, etc."
                  type="text"
                  name="address"
                  value={shippingForm.address}
                  onChange={handleShippingInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  City
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-3 px-3 transition-colors"
                  placeholder="City"
                  type="text"
                  name="city"
                  value={shippingForm.city}
                  onChange={handleShippingInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    State
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-3 px-3 transition-colors"
                    name="state"
                    value={shippingForm.state}
                    onChange={handleShippingInputChange}
                    required
                  >
                    <option value="">Select...</option>
                    <option value="CA">CA</option>
                    <option value="NY">NY</option>
                    <option value="TX">TX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    ZIP Code
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 py-3 px-3 transition-colors"
                    placeholder="12345"
                    type="text"
                    name="zip_code"
                    value={shippingForm.zip_code}
                    onChange={handleShippingInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Phone Number
                </label>
                <input
                  className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-primary focus:border-primary py-3"
                  placeholder="(555) 123-4567"
                  type="tel"
                  name="phone"
                  value={shippingForm.phone}
                  onChange={handleShippingInputChange}
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsShippingModalOpen(false)}
                  disabled={submittingOrder}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-orange-500 disabled:opacity-60"
                  disabled={submittingOrder}
                >
                  {submittingOrder ? 'Placing order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ShoppingCart;