import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

interface CartProduct {
  product_id: number;
  name: string;
  price: number;
  discount_price: number | null;
}

interface CartItem {
  cart_item_id: number;
  product_id: number;
  quantity: number;
  product: CartProduct;
}

export interface CartResponse {
  cart_id: number;
  user_id: number;
  items: CartItem[];
}

interface CartContextType {
  cart: CartResponse | null;
  itemCount: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  setCartFromApiPayload: (payload: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const itemCount = useMemo(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const setCartFromApiPayload = (payload: any) => {
    if (!payload) return;
    const data: CartResponse = payload.data || payload;
    if (!data || typeof data !== 'object' || !Array.isArray((data as any).items)) return;
    setCart(data);
  };

  const refreshCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get('/cart', { params: { user_id: user.id } });
      setCartFromApiPayload(response.data);
    } catch (err) {
      // silent; header badge is non-critical
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      refreshCart();
    }
    if (!user && !authLoading) {
      setCart(null);
    }
  }, [authLoading, user]);

  const value: CartContextType = {
    cart,
    itemCount,
    loading,
    refreshCart,
    setCartFromApiPayload,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};
