import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Categories from './pages/Categories';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Bestsellers from './pages/Bestsellers';
import Wishlist from './pages/Wishlist';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

// Get Google Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
}

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <WishlistProvider>
          <Router>
            <CartProvider>
              <div className="min-h-screen bg-surface text-text-primary flex flex-col font-sans selection:bg-dusty-rose/30 overflow-x-hidden">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/cart" element={<Checkout />} />
                    <Route path="/bestsellers" element={<Bestsellers />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Login />} />
                  </Routes>
                </main>
              </div>
            </CartProvider>
          </Router>
        </WishlistProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
