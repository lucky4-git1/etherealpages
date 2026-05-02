import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Star } from 'lucide-react';
import BookGrid from '../components/BookGrid';

const Bestsellers = () => {
  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6 mb-12">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative overflow-hidden bg-gradient-to-br from-surface-card via-surface-card to-cream rounded-3xl p-10 border border-cream-dark/50 shadow-2xl shadow-dusty-rose/5"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-dusty-rose/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted-sage/10 border border-muted-sage/20 text-muted-sage-dark text-xs font-bold uppercase tracking-widest mb-6">
                <TrendingUp className="w-3 h-3" />
                Updated Today
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-4">
                Bestsellers
                <Trophy className="w-8 h-8 text-amber-500" />
              </h1>
              <p className="text-text-secondary max-w-2xl text-lg">
                The most read, most loved, and most discussed books in our collection this month. 
                Discover what the world is reading right now.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-surface/50 backdrop-blur-md border border-cream-dark/50 p-6 rounded-2xl text-center min-w-[120px] shadow-sm">
                <div className="text-2xl font-bold text-white">#1</div>
                <div className="text-xs text-text-muted uppercase font-bold mt-1">Thriller</div>
              </div>
              <div className="bg-surface/50 backdrop-blur-md border border-cream-dark/50 p-6 rounded-2xl text-center min-w-[120px] shadow-sm">
                <div className="text-2xl font-bold text-white">Top 10</div>
                <div className="text-xs text-text-muted uppercase font-bold mt-1">Sci-Fi</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <BookGrid />
    </div>
  );
};

export default Bestsellers;
