import api from './api';

export const productService = {
  // Product CRUD
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/products?${queryParams}`);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getUserProducts: async () => {
    const response = await api.get('/products/my-products');
    return response.data;
  },

  // Wishlist
  addToWishlist: async (productId) => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Reviews
  createReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },

  getReviews: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },

  // Upload
  uploadImages: async (images) => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    const response = await api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};