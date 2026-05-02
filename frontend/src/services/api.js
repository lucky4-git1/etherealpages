import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication and authorization errors (expired token usually results in 403 in this Spring config)
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

// API Methods
export const api = {
  // Auth endpoints
  auth: {
    register: (data) => apiClient.post('/api/auth/register', data),
    login: (data) => apiClient.post('/api/auth/login', data),
    googleLogin: (data) => apiClient.post('/api/auth/google', data),
  },

  // Books endpoints
  books: {
    getAll: () => apiClient.get('/api/books'),
    getById: (id) => apiClient.get(`/api/books/${id}`),
    search: (query) => apiClient.get('/api/books/search', { params: { query } }),
    create: (data) => apiClient.post('/api/admin/books', data),
    update: (id, data) => apiClient.put(`/api/admin/books/${id}`, data),
    delete: (id) => apiClient.delete(`/api/admin/books/${id}`),
  },

  // Cart endpoints
  cart: {
    getCart: () => apiClient.get('/api/cart'),
    addItem: (bookId, quantity = 1) => 
      apiClient.post('/api/cart/add', {}, { params: { bookId, quantity } }),
    removeItem: (itemId) => apiClient.delete(`/api/cart/remove/${itemId}`),
  },

  // Wishlist endpoints
  wishlist: {
    getWishlist: () => apiClient.get('/api/wishlist'),
    toggleWishlist: (bookId) => apiClient.post(`/api/wishlist/${bookId}`),
  },

  // Order endpoints
  orders: {
    placeOrder: () => apiClient.post('/api/orders'),
    getUserOrders: () => apiClient.get('/api/orders/user'),
  },
};

export default apiClient;
