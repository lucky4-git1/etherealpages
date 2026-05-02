import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, CreditCard, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setOrderError('Cart is empty');
      return;
    }

    try {
      setProcessingOrder(true);
      setOrderError(null);
      
      const response = await api.orders.placeOrder();
      clearCart();
      
      setTimeout(() => {
        navigate('/');
        alert('Order placed successfully! Your books are ready to download.');
      }, 1000);
      
    } catch (error) {
      setOrderError(error.message || 'Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setProcessingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-12 min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-24 h-24 bg-surface-warm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-cream-dark/50">
            <ShoppingCart className="w-10 h-10 text-text-muted" />
          </div>
          <h2 className="text-3xl font-bold text-bronze-dark mb-4">Your cart is empty</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">Looks like you haven't added any books to your cart yet. Discover your next great adventure!</p>
          <Link to="/explore" className="bg-gradient-to-r from-dusty-rose to-lavender text-white font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
            Browse Books
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen container mx-auto px-6">
      <h1 className="text-3xl font-bold text-bronze-dark mb-8">Checkout ({cartCount} items)</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 bg-surface-card p-4 rounded-2xl border border-cream-dark/50 shadow-sm"
            >
              <img 
                src={item.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200'} 
                alt={item.title} 
                className="w-20 h-28 object-cover rounded-lg shadow-md"
                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200'}
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-bronze-dark line-clamp-1">{item.title}</h3>
                <p className="text-sm text-text-muted mb-2">{item.author || 'Unknown'}</p>
                <p className="text-dusty-rose font-semibold">
                  {formatINR(typeof item.price === 'number' ? item.price : parseFloat(item.price))}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-surface rounded-lg border border-cream-dark p-1">
                  <button 
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-bronze-dark transition-colors"
                  >-</button>
                  <span className="w-8 text-center text-bronze-dark font-medium">{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-bronze-dark transition-colors"
                  >+</button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id, item.cartItemId)}
                  className="p-2 text-dusty-rose/80 hover:text-dusty-rose hover:bg-dusty-rose/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-surface-card rounded-2xl border border-cream-dark/50 p-6 sticky top-28 shadow-sm">
            <h3 className="text-xl font-bold text-bronze-dark mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-sm font-medium border-b border-cream-dark/50 pb-6 mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-bronze-dark">{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-muted-sage">Secure Download</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>GST (18%)</span>
                <span className="text-bronze-dark">{formatINR(cartTotal * 0.18)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-bronze font-medium">Total</span>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-dusty-rose to-lavender">
                {formatINR(cartTotal * 1.18)}
              </span>
            </div>

            {orderError && (
              <div className="bg-dusty-rose/10 border border-dusty-rose/20 text-dusty-rose-dark text-sm p-3 rounded-lg mb-4">
                {orderError}
              </div>
            )}

            <button 
              onClick={handlePlaceOrder}
              disabled={processingOrder || !user}
              className="w-full bg-gradient-to-r from-dusty-rose to-lavender hover:from-dusty-rose-dark hover:to-lavender-dark disabled:from-cream-dark disabled:to-cream-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-dusty-rose/20 group"
            >
              <CreditCard className="w-5 h-5 transition-transform group-hover:scale-110" />
              {processingOrder ? 'Processing...' : (user ? 'Proceed to Payment' : 'Login to Checkout')}
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
              <ShieldCheck className="w-4 h-4 text-muted-sage" />
              Secure 256-bit AES encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
