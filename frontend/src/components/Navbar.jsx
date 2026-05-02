import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, BookOpen, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-cream/80 backdrop-blur-md border-cream-dark/30 shadow-lg shadow-bronze/5 py-3'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dusty-rose to-lavender shadow-lg shadow-dusty-rose/20 transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-bronze-dark transition-opacity group-hover:opacity-90">
            Ethereal<span className="font-light text-bronze-light">Pages</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="text-bronze hover:text-bronze-dark transition-colors">Home</Link>
          <Link to="/explore" className="text-bronze hover:text-bronze-dark transition-colors">Explore</Link>
          <Link to="/categories" className="text-bronze hover:text-bronze-dark transition-colors">Categories</Link>
          <Link to="/bestsellers" className="text-dusty-rose font-semibold uppercase tracking-tighter hover:text-dusty-rose-dark transition-colors">Bestsellers</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative flex items-center h-full">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearch}
                  className="absolute right-8 top-1/2 -translate-y-1/2"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className="w-full bg-white border border-cream-dark rounded-full py-1.5 pl-4 pr-3 text-sm text-bronze-dark focus:outline-none focus:border-dusty-rose shadow-lg placeholder:text-text-muted"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button 
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
              }} 
              className="text-bronze-light hover:text-bronze-dark transition-colors relative z-10"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <Link to="/wishlist" className="relative text-bronze-light hover:text-dusty-rose transition-colors">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-dusty-rose text-[10px] font-bold text-white shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-bronze-light hover:text-muted-sage transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-muted-sage text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="h-6 w-px bg-cream-dark"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-bronze">Hi, {user.name.split(' ')[0]}</span>
              <button 
                onClick={logout}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-surface-warm px-5 py-2 font-medium text-bronze-dark transition-all duration-300 hover:bg-cream-dark border border-cream-dark/50"
              >
                <span className="relative z-10 text-sm">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-bronze hover:text-bronze-dark transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-dusty-rose px-5 py-2 font-medium text-white transition-all duration-300 hover:bg-dusty-rose-dark hover:shadow-[0_0_20px_rgba(196,150,161,0.3)]"
              >
                <span className="relative z-10 text-sm">Get Started</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-bronze hover:text-bronze-dark"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-cream-dark/30 bg-cream/95 backdrop-blur-lg"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-6">
              <Link to="/" className="text-lg font-medium text-bronze hover:text-bronze-dark" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/explore" className="text-lg font-medium text-bronze hover:text-bronze-dark" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
              <Link to="/categories" className="text-lg font-medium text-bronze hover:text-bronze-dark" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link to="/bestsellers" className="text-lg font-bold text-dusty-rose" onClick={() => setMobileMenuOpen(false)}>Bestsellers</Link>
              <div className="h-px w-full bg-cream-dark"></div>
              {user ? (
                <div className="flex flex-col gap-4">
                  <span className="text-center font-medium text-bronze">Welcome, {user.name}</span>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full rounded-lg border border-cream-dark py-3 text-center font-medium text-bronze hover:bg-surface-warm transition-colors">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login" className="flex-1 rounded-lg border border-cream-dark py-3 text-center font-medium text-bronze" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="flex-1 rounded-lg bg-gradient-to-br from-dusty-rose to-lavender py-3 text-center font-medium text-white shadow-lg" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
