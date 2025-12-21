import React, { createContext, useState, useContext, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { productService } from '../services/productService';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const useProductsContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch all products with filters
  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(filters);
      setProducts(data.data.products);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      toast.error('Failed to load products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured products (newest)
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({ 
        limit: 8, 
        sort: '-createdAt',
        status: 'available'
      });
      setFeaturedProducts(data.data.products);
      return data;
    } catch (err) {
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch trending products (most viewed)
  const fetchTrendingProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({ 
        limit: 4, 
        sort: '-views',
        status: 'available'
      });
      setTrendingProducts(data.data.products);
      return data;
    } catch (err) {
      console.error('Error fetching trending products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's own products
  const fetchUserProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getUserProducts();
      setUserProducts(data.data.products);
      return data;
    } catch (err) {
      console.error('Error fetching user products:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new product
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      const data = await productService.createProduct(productData);
      toast.success('Product created successfully!');
      
      // Update user products list
      const updatedUserProducts = await productService.getUserProducts();
      setUserProducts(updatedUserProducts.data.products);
      
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create product';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      const data = await productService.updateProduct(id, productData);
      toast.success('Product updated successfully!');
      
      // Update products list
      setProducts(prev => prev.map(p => 
        p._id === id ? { ...p, ...productData } : p
      ));
      
      // Update user products list
      if (userProducts.length > 0) {
        const updatedUserProducts = await productService.getUserProducts();
        setUserProducts(updatedUserProducts.data.products);
      }
      
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update product';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully!');
      
      // Remove from products list
      setProducts(prev => prev.filter(p => p._id !== id));
      
      // Remove from user products list
      setUserProducts(prev => prev.filter(p => p._id !== id));
      
      // Remove from featured and trending if present
      setFeaturedProducts(prev => prev.filter(p => p._id !== id));
      setTrendingProducts(prev => prev.filter(p => p._id !== id));
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete product';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (id) => {
    try {
      setLoading(true);
      const data = await productService.getProduct(id);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch product';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Wishlist operations
  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getWishlist();
      setWishlist(data.data.wishlist);
      return data;
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWishlist = async (productId) => {
    try {
      await productService.addToWishlist(productId);
      toast.success('Added to wishlist!');
      
      // Update wishlist state
      const updatedWishlist = await productService.getWishlist();
      setWishlist(updatedWishlist.data.wishlist);
      
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add to wishlist';
      toast.error(errorMsg);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await productService.removeFromWishlist(productId);
      toast.success('Removed from wishlist!');
      
      // Update wishlist state
      setWishlist(prev => prev.filter(item => item.product._id !== productId));
      
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(errorMsg);
      throw err;
    }
  };

  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlist.some(item => item.product._id === productId);
    
    if (isInWishlist) {
      await removeFromWishlist(productId);
      return false;
    } else {
      await addToWishlist(productId);
      return true;
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product._id === productId);
  };

  // Upload images
  const uploadImages = async (images) => {
    try {
      setLoading(true);
      const data = await productService.uploadImages(images);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload images';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query, filters = {}) => {
    try {
      setLoading(true);
      const data = await productService.getProducts({
        search: query,
        ...filters,
        status: 'available'
      });
      setProducts(data.data.products);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Search failed';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear products
  const clearProducts = () => {
    setProducts([]);
    setError(null);
  };

  const value = {
    products,
    featuredProducts,
    trendingProducts,
    userProducts,
    wishlist,
    loading,
    error,
    fetchProducts,
    fetchFeaturedProducts,
    fetchTrendingProducts,
    fetchUserProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    uploadImages,
    searchProducts,
    clearProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};