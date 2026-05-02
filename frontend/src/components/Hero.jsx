import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-dusty-rose/15 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[25rem] h-[25rem] bg-lavender/15 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[50%] left-[50%] w-[20rem] h-[20rem] bg-muted-sage/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Text Content */}
        <div className="flex-1 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card/80 border border-cream-dark/50 backdrop-blur-md mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-muted-sage animate-ping absolute"></span>
              <span className="flex h-2 w-2 rounded-full bg-muted-sage relative"></span>
              <span className="text-xs font-medium text-cream uppercase tracking-wider">Over 10,000+ Premium Books</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            Discover worlds <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dusty-rose to-lavender">
              beyond imagination
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10"
          >
            Curated collections of literary masterpieces, thrilling adventures, and profound knowledge. Your next great journey starts here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/explore"
              className="group flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-dusty-rose text-white font-semibold text-base transition-all hover:scale-105 hover:bg-dusty-rose-dark hover:shadow-[0_0_30px_rgba(196,150,161,0.3)] w-full sm:w-auto"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/bestsellers"
              className="flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-surface-card border border-cream-dark text-white font-medium text-base transition-all hover:bg-surface-warm flex-shrink-0 w-full sm:w-auto shadow-sm"
            >
              View Bestsellers
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 flex items-center justify-center lg:justify-start gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-cream bg-surface-warm overflow-hidden shadow-lg object-cover">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User avatar" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-text-muted font-medium">Loved by 2,500+ readers</p>
            </div>
          </motion.div>
        </div>

        {/* Graphic Content - Floating Books */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
           className="flex-1 w-full relative hidden lg:block"
        >
          <div className="relative w-full max-w-lg mx-auto aspect-square">
            {/* Main Center Feature */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-72 h-96 bg-gradient-to-br from-dusty-rose to-lavender rounded-xl shadow-2xl shadow-dusty-rose/20 border border-white/20 relative overflow-hidden transform -rotate-6 transition-transform hover:rotate-0 hover:scale-105 duration-500">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614544048536-0d28caf77f41?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
                  <div>
                    <h3 className="text-white font-bold text-2xl font-serif leading-tight">The Quantum<br/>Paradox</h3>
                    <p className="text-white/70 mt-2 font-medium">Stella Vance</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Secondary Decor 1 */}
            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -left-4 w-48 h-64 bg-surface-warm rounded-xl shadow-2xl border border-cream-dark transform rotate-12 -z-10"
            ></motion.div>
            
            {/* Secondary Decor 2 */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-10 -right-4 w-56 h-72 bg-gradient-to-b from-muted-sage/40 to-cream rounded-xl shadow-2xl border border-cream-dark transform rotate-[15deg] -z-20"
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
