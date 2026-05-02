import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">My Wishlist</h1>
          <p className="text-text-secondary">You have {wishlist.length} items saved for later</p>
        </header>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-surface-card/50 rounded-3xl border border-cream-dark/50 border-dashed"
          >
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-surface-warm text-text-muted mb-6">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Save books you're interested in so you can easily find them later and add them to your cart.
            </p>
            <Link to="/explore" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-dusty-rose text-white font-semibold hover:bg-dusty-rose-dark transition-colors">
              Browse Books <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((book) => (
              <motion.div 
                layout
                key={book.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-6 p-4 bg-surface-card border border-cream-dark/50 rounded-2xl hover:border-dusty-rose/30 transition-colors shadow-sm"
              >
                <div className="w-32 h-44 flex-shrink-0 rounded-lg overflow-hidden border border-cream-dark/50">
                  <img src={book.imageUrl || book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white leading-tight mb-1">{book.title}</h3>
                    <button onClick={() => toggleWishlist(book.id)} className="text-dusty-rose hover:text-dusty-rose-dark p-1">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <p className="text-sm text-text-muted mb-4">{book.author}</p>
                  <p className="text-lg font-bold text-white mb-4">{formatINR(book.price)}</p>
                  <div className="mt-auto flex gap-2">
                    <button 
                      onClick={() => addToCart(book)}
                      className="flex-1 px-4 py-2 bg-dusty-rose text-white text-sm font-bold rounded-lg hover:bg-dusty-rose-dark transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
