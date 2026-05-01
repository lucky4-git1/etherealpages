import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/api/wishlist`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setWishlist(response.data || []);
        } catch (error) {
            console.error("Error fetching wishlist", error);
            setError('Failed to load wishlist');
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (bookId, book = null) => {
        if (!user) {
            return { success: false, message: 'Please login to save favorites' };
        }
        try {
            setError(null);
            const response = await axios.post(
                `${API_URL}/api/wishlist/${bookId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            // Update local state
            const isNowLiked = response.data.liked;
            if (isNowLiked && book) {
                // Add to wishlist
                setWishlist(prev => {
                    if (!prev.find(b => b.id === bookId)) {
                        return [...prev, book];
                    }
                    return prev;
                });
            } else {
                // Remove from wishlist
                setWishlist(prev => prev.filter(b => b.id !== bookId));
            }
            
            return { success: true, liked: isNowLiked };
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            setError('Failed to update favorites');
            return { success: false, message: 'Failed to update favorites' };
        }
    };

    const isLiked = (bookId) => {
        return wishlist.some(book => book.id === bookId);
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider value={{ 
            wishlist, 
            toggleWishlist, 
            isLiked,
            clearWishlist,
            loading,
            error
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
