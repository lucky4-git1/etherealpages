import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/register') setIsLogin(false);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-dusty-rose/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-lavender/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-surface-card/90 backdrop-blur-xl border border-cream-dark/50 rounded-3xl p-8 shadow-2xl shadow-dusty-rose/5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-text-secondary">
              {isLogin ? "Sign in to discover your next adventure" : "Join us and discover infinite worlds"}
            </p>
          </div>

          {error && <div className="bg-dusty-rose/10 border border-dusty-rose/20 text-dusty-rose-dark text-sm p-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-cream mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-cream-dark rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-dusty-rose/50"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-cream mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-cream-dark rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-dusty-rose/50"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-cream">Password</label>
                {isLogin && <a href="#" className="text-xs text-dusty-rose font-medium hover:text-dusty-rose-dark">Forgot password?</a>}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-cream-dark rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-dusty-rose/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-dusty-rose to-lavender hover:opacity-90 text-white font-semibold rounded-xl shadow-lg transition-all mt-6">
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-cream-dark flex-1"></div>
            <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-cream-dark flex-1"></div>
          </div>

          <div className="flex justify-center bg-surface rounded-xl py-2 border border-cream-dark">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Authentication Failed.')}
              theme="outline"
              shape="pill"
            />
          </div>

          <p className="text-center text-sm text-text-secondary mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link onClick={() => setIsLogin(!isLogin)} to={isLogin ? "/register" : "/login"} className="text-dusty-rose font-semibold hover:text-dusty-rose-dark">
              {isLogin ? "Register" : "Sign In"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
