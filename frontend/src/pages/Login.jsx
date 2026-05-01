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
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-400">
              {isLogin ? "Sign in to discover your next adventure" : "Join us and discover infinite worlds"}
            </p>
          </div>

          {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                {isLogin && <a href="#" className="text-xs text-fuchsia-400 font-medium hover:text-fuchsia-300">Forgot password?</a>}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:opacity-90 text-white font-semibold rounded-xl shadow-lg transition-all mt-6">
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <div className="flex justify-center bg-slate-950 rounded-xl py-2 border border-slate-800">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Authentication Failed.')}
              theme="filled_black"
              shape="pill"
            />
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link onClick={() => setIsLogin(!isLogin)} to={isLogin ? "/register" : "/login"} className="text-fuchsia-400 font-semibold hover:text-fuchsia-300">
              {isLogin ? "Register" : "Sign In"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
