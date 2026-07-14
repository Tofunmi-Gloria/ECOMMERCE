import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  }, [user]);

  const addToCart = async (productId, variantId, quantity = 1) => {
    const { data } = await api.post('/cart/add', { productId, variantId, quantity });
    setCart(data);
  };

  const updateQuantity = async (productId, variantId, quantity) => {
    const { data } = await api.put('/cart/update', { productId, variantId, quantity });
    setCart(data);
  };

  const removeFromCart = async (productId, variantId) => {
    const { data } = await api.delete(`/cart/remove/${productId}`, { params: { variantId } });
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await api.delete('/cart/clear');
    setCart(data);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const totalAmount = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);