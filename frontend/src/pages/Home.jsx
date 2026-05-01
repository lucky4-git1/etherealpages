import React from 'react';
import Hero from '../components/Hero';
import BookGrid from '../components/BookGrid';

const Home = () => {
  return (
    <>
      <Hero />
      <div className="relative">
        <BookGrid 
          title="Trending Now" 
          description="Explore our most popular reads this week across all categories."
          limit={8}
        />
        
        <BookGrid 
          title="Science Fiction & Fantasy" 
          description="Journey to other worlds and expand your imagination."
          category="Science Fiction"
          limit={4}
        />
        
        <BookGrid 
          title="Timeless Classics" 
          description="The foundational stories that shaped literature."
          category="Classic"
          limit={4}
        />
        
        <BookGrid 
          title="Mystery & Thriller" 
          description="Gripping tales that will keep you on the edge of your seat."
          category="Thriller & Mystery"
          limit={4}
        />
      </div>
    </>
  );
};

export default Home;
