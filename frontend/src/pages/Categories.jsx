import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Science Fiction', count: 124, color: 'from-lavender to-lavender-dark' },
  { name: 'Thriller & Mystery', count: 85, color: 'from-dusty-rose to-dusty-rose-dark' },
  { name: 'Self-Help', count: 210, color: 'from-bronze-light to-bronze' },
  { name: 'Historical Fiction', count: 56, color: 'from-muted-sage to-muted-sage-dark' },
  { name: 'Romance', count: 320, color: 'from-dusty-rose-light to-dusty-rose' },
  { name: 'Biography', count: 94, color: 'from-lavender-light to-lavender' }
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/explore?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-bronze-dark mb-4">Browse by Category</h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-lg">Find your next favorite book by exploring our carefully curated genres.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => handleCategoryClick(cat.name)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-surface-card border border-cream-dark/50 p-8 hover:border-dusty-rose/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <h3 className="text-2xl font-bold text-bronze-dark mb-2">{cat.name}</h3>
            <p className="text-text-secondary font-medium">{cat.count} Books available</p>
            
            <div className={`mt-6 h-1 w-12 bg-gradient-to-r ${cat.color} rounded-full transition-all duration-300 group-hover:w-full`}></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
