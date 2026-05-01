import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCartItems(response.data || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
      // Fall back to local state
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book) => {
    try {
      setError(null);
      
      if (!user) {
        // Not authenticated - add to local state only
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

      // Call backend API
      const response = await axios.post(
        `${API_URL}/api/cart/add?bookId=${book.id}&quantity=1`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Refresh cart after adding
      await fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
      // Still add to local state as fallback
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

  const removeFromCart = async (itemId, bookId) => {
    try {
      setError(null);

      if (!user) {
        // Not authenticated - remove from local state only
        setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
        return;
      }

      // Call backend API
      await axios.delete(`${API_URL}/api/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Refresh cart after removing
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
      // Still remove from local state as fallback
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

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartCount, 
      cartTotal,
      loading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
};
