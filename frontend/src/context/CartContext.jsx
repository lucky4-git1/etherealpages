import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.cart.getCart();
      
      // Flatten the backend CartItem structure
      const normalizedItems = (response.data || []).map(item => ({
        ...item.book,
        cartItemId: item.id,
        quantity: item.quantity
      }));
      
      setCartItems(normalizedItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book) => {
    try {
      setError(null);
      
      if (!user) {
        setCartItems(prevItems => {
          const existing = prevItems.find(item => item.id === book.id);
          if (existing) {
            return prevItems.map(item => 
              item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...prevItems, { ...book, quantity: 1 }];
        });
        return;
      }

      await api.cart.addItem(book.id, 1);
      await fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
      // Fallback
      setCartItems(prevItems => {
        const existing = prevItems.find(item => item.id === book.id);
        if (existing) {
          return prevItems.map(item => 
            item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevItems, { ...book, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (bookId, cartItemId) => {
    try {
      setError(null);

      if (!user) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
        return;
      }

      const targetId = cartItemId || cartItems.find(item => item.id === bookId)?.cartItemId;

      if (targetId) {
        await api.cart.removeItem(targetId);
      }

      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
      setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
    }
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(null, bookId);
      return;
    }
    setCartItems(prevItems => 
      prevItems.map(item => item.id === bookId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
    return total + (price * (item.quantity || 1));
  }, 0);

  const isInCart = (bookId) => {
    if (!bookId) return false;
    return cartItems.some(item => String(item.id) === String(bookId));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isInCart,
      cartCount, 
      cartTotal,
      loading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
};
