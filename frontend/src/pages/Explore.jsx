import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import BookGrid from '../components/BookGrid';

const Explore = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let title = "Explore All Books";
  let description = "Browse our entire collection of premium books. Use the filters to find precisely what you're looking for.";

  if (category) {
    title = `${category} Books`;
    description = `Explore our curated selection of ${category} books.`;
  } else if (search) {
    title = `Search Results for "${search}"`;
    description = `Here's what we found for your search query.`;
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6 mb-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-gradient-to-r from-bronze-dark to-bronze rounded-2xl p-8 border border-cream-dark shadow-xl"
        >
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-cream max-w-2xl text-lg">{description}</p>
        </motion.div>
      </div>
      
      <BookGrid 
        title={category ? "Available Books" : (search ? "Matches" : "All Books")}
        description=""
        category={category}
        searchQuery={search}
        limit={null}
      />
    </div>
  );
};

export default Explore;
