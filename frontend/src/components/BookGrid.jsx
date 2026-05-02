import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isLiked } = useWishlist();
  
  const inCart = isInCart(book.id);
  const liked = isLiked(book.id);
  const price = typeof book.price === 'number' ? book.price : parseFloat(book.price);
  const defaultImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop';

  const handleWishlistToggle = async () => {
    const result = await toggleWishlist(book.id, book);
    if (result && !result.success && result.message) {
      setToastMsg(result.message);
      setTimeout(() => setToastMsg(''), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(217,70,239,0.3)] hover:border-slate-700"
    >
      {/* Dynamic glow effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${inCart ? 'from-emerald-600/20 to-teal-600/20' : 'from-fuchsia-600/20 to-indigo-600/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none`}
      />
      
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className={`px-3 py-1 text-xs font-semibold bg-slate-950/80 backdrop-blur-md ${inCart ? 'text-emerald-400 border-emerald-500/20' : 'text-fuchsia-300 border-fuchsia-500/20'} rounded-full border shadow-sm`}>
          {book.category || 'Books'}
        </span>
      </div>

      {/* Login toast */}
      {toastMsg && (
        <div className="absolute top-14 right-2 z-30 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-fuchsia-500/30 shadow-lg whitespace-nowrap">
          🔒 {toastMsg}
        </div>
      )}

      {/* Favorite Button */}
      <button 
        onClick={handleWishlistToggle}
        className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md transition-all ${
          liked ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30' : 'bg-slate-950/50 text-slate-400 hover:text-fuchsia-500 hover:bg-slate-900'
        }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
      </button>

      {/* Cover Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-800 z-10">
        <div className="absolute inset-0 bg-slate-900 animate-pulse" />
        <img 
          src={book.imageUrl || defaultImage} 
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          onError={(e) => e.target.src = defaultImage}
        />
        {/* Shadow overlay overlay for image depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow z-10 bg-slate-900">
        <h3 className={`font-bold text-lg text-white mb-1 line-clamp-2 transition-colors ${inCart ? 'group-hover:text-emerald-400' : 'group-hover:text-fuchsia-400'}`}>
          {book.title}
        </h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-1">{book.author || 'Unknown'}</p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/60">
          <span className="text-xl font-bold tracking-tight text-white">
            {formatINR(price)}
          </span>
          <button 
            onClick={() => addToCart(book)}
            disabled={!book.stock || book.stock === 0}
            className={`flex items-center gap-2 ${inCart ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800 hover:bg-fuchsia-600'} disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all min-w-[40px] overflow-hidden group/btn`}
            title={book.stock === 0 ? 'Out of stock' : (inCart ? 'Added to Cart' : 'Add to Cart')}
          >
            {inCart ? (
              <Star className="w-4 h-4 flex-shrink-0 fill-current text-white animate-bounce" />
            ) : (
              <ShoppingCart className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-sm font-medium pr-1 whitespace-nowrap hidden group-hover/btn:block">
              {book.stock === 0 ? 'Out' : (inCart ? 'Added' : 'Add')}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const BookGrid = ({ 
  title = "Trending Now", 
  description = "Explore our most popular reads this week.",
  category = null,
  searchQuery = null,
  limit = 8
}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [category, searchQuery]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${API_URL}/api/books`;
      if (searchQuery) {
        url = `${API_URL}/api/books/search?query=${encodeURIComponent(searchQuery)}`;
      } else if (category) {
        url = `${API_URL}/api/books?category=${encodeURIComponent(category)}`;
      }
      
      const response = await axios.get(url);
      const limitedBooks = limit ? response.data.slice(0, limit) : response.data;
      setBooks(limitedBooks);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Decorative background elements - Made subtler so they stack well */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-slate-400 max-w-xl">
              {description}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/explore" className="group flex items-center gap-2 text-fuchsia-400 font-medium hover:text-fuchsia-300 transition-colors">
              View all books
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">No books available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookGrid;
