import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, ArrowLeft, Save, Sparkles, Image as ImageIcon, DollarSign, MapPin, Package, Shield, TrendingUp, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Updated schema with optional description
const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(1000).optional().or(z.literal('')),
  category: z.enum(['textbook', 'notes', 'calculator', 'stationery', 'other']),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  price: z.number().min(0, 'Price must be positive'),
  condition: z.enum(['new', 'like-new', 'good', 'fair']),
  status: z.enum(['available', 'sold', 'reserved']),
  university: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  isNegotiable: z.boolean().default(false),
});

const subcategories = {
  textbook: ['Mathematics', 'Science', 'Engineering', 'Medical', 'Business', 'Arts', 'Law', 'Other'],
  notes: ['Lecture Notes', 'Study Guides', 'Past Papers', 'Summary Sheets'],
  calculator: ['Scientific', 'Graphing', 'Basic', 'Financial'],
  stationery: ['Notebooks', 'Pens', 'Highlighters', 'Binders', 'Other'],
  other: ['Lab Equipment', 'Study Desk', 'Chair', 'Other']
};

const conditionOptions = [
  { value: 'new', label: 'Brand New', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'like-new', label: 'Like New', color: 'bg-blue-100 text-blue-800' },
  { value: 'good', label: 'Good', color: 'bg-amber-100 text-amber-800' },
  { value: 'fair', label: 'Fair', color: 'bg-gray-100 text-gray-800' }
];

const statusOptions = [
  { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800', icon: '🟢' },
  { value: 'sold', label: 'Sold', color: 'bg-red-100 text-red-800', icon: '🔴' },
  { value: 'reserved', label: 'Reserved', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' }
];

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(productSchema)
  });

  const selectedCategory = watch('category');
  const selectedCondition = watch('condition');
  const selectedStatus = watch('status');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Track form changes
  useEffect(() => {
    const subscription = watch(() => setIsChanged(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      const productData = response.data.data.product;
      
      // Check if user is authorized to edit
      if (productData.seller._id !== user?._id && user?.role !== 'admin') {
        toast.error('You are not authorized to edit this product');
        navigate(`/products/${id}`);
        return;
      }
      
      setProduct(productData);
      setImages(productData.images || []);
      
      // Set form values
      reset({
        title: productData.title,
        description: productData.description || '',
        category: productData.category,
        subcategory: productData.subcategory,
        price: productData.price,
        condition: productData.condition,
        status: productData.status || 'available',
        university: productData.university || '',
        location: productData.location,
        isNegotiable: productData.isNegotiable || false,
      });
      
      setIsChanged(false);
      
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + newImages.length - deletedImages.length;
    
    if (totalImages + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Create preview URLs
    const newImagePreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true
    }));

    setNewImages([...newImages, ...newImagePreviews]);
    setIsChanged(true);
  };

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      const imageToRemove = newImages[index];
      URL.revokeObjectURL(imageToRemove.preview);
      setNewImages(newImages.filter((_, i) => i !== index));
    } else {
      const imageToDelete = images[index];
      setDeletedImages([...deletedImages, imageToDelete]);
      setImages(images.filter((_, i) => i !== index));
    }
    setIsChanged(true);
  };

  const restoreImage = (imageUrl) => {
    setImages([...images, imageUrl]);
    setDeletedImages(deletedImages.filter(img => img !== imageUrl));
    setIsChanged(true);
  };

  const uploadNewImages = async () => {
    if (newImages.length === 0) return [];

    try {
      setUploading(true);
      const formData = new FormData();
      newImages.forEach(({ file }) => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data.data?.urls || response.data.urls || [];
    } catch (error) {
      toast.error('Failed to upload new images');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Upload new images
      const uploadedUrls = await uploadNewImages();
      
      // Combine existing images (excluding deleted) with new images
      const allImages = [
        ...images.filter(img => !deletedImages.includes(img)),
        ...uploadedUrls
      ];

      if (allImages.length === 0) {
        toast.error('At least one image is required');
        return;
      }

      const productData = {
        ...data,
        description: data.description || '',
        images: allImages,
        specifications: JSON.stringify({})
      };

      const response = await api.patch(`/products/${id}`, productData);
      toast.success('Product updated successfully!');
      
      // Clean up object URLs
      newImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
      
      navigate(`/products/${id}`);
      
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update product';
      
      // Handle description requirement if backend still requires it
      if (errorMsg.toLowerCase().includes('description')) {
        toast.error('Description is currently required. Please add at least 10 characters.');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleReset = () => {
    if (product) {
      reset({
        title: product.title,
        description: product.description || '',
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        condition: product.condition,
        status: product.status || 'available',
        university: product.university || '',
        location: product.location,
        isNegotiable: product.isNegotiable || false,
      });
      setImages(product.images || []);
      setNewImages([]);
      setDeletedImages([]);
      setIsChanged(false);
      toast.success('Changes reset');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading product details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(`/products/${id}`)}
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Product</span>
            </button>
            
            {isChanged && (
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Changes</span>
              </button>
            )}
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-5 py-2 rounded-full mb-4 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">EDIT LISTING</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-2">
              Update Your Listing
            </h1>
            <p className="text-gray-600">Make changes to your product information</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 md:p-8 border border-white/60"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none placeholder-gray-500"
                  placeholder="e.g., Calculus 2 Textbook - 10th Edition"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.title.message}</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description {product?.description ? '' : '(Optional)'}
                  </label>
                  <span className="text-xs text-gray-500">Max 1000 characters</span>
                </div>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none placeholder-gray-500 resize-none"
                  placeholder="Describe your item in detail..."
                  maxLength={1000}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Category & Details */}
            <div className="space-y-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Category & Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="textbook">Textbook</option>
                    <option value="notes">Notes</option>
                    <option value="calculator">Calculator</option>
                    <option value="stationery">Stationery</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    {...register('subcategory')}
                    className="w-full px-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {subcategories[selectedCategory]?.map(sub => (
                      <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (Rs) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      {...register('price', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Negotiable Price
                  </label>
                  <div className="flex items-center h-full">
                    <label className="inline-flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          {...register('isNegotiable')}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Accept offers
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Condition Selection */}
            <div className="space-y-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/30">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Condition *</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {conditionOptions.map((condition) => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => setValue('condition', condition.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedCondition === condition.value
                        ? `border-amber-500 ${condition.color} ring-2 ring-offset-2 ring-amber-400 scale-105 shadow-lg`
                        : 'border-gray-200 hover:border-amber-300 hover:shadow bg-white'
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{condition.label}</span>
                        {selectedCondition === condition.value && (
                          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/30">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-amber-600" />
                Status *
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setValue('status', status.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedStatus === status.value
                        ? `${status.color} ring-2 ring-offset-2 ring-amber-400 scale-105 shadow-lg`
                        : 'border-gray-200 hover:border-amber-300 hover:shadow bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{status.icon}</span>
                      <span className="font-bold">{status.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location & University */}
            <div className="space-y-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Location Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="w-full px-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none placeholder-gray-500"
                    placeholder="e.g., Main Campus, Delhi"
                  />
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    University/Institution
                  </label>
                  <input
                    {...register('university')}
                    type="text"
                    className="w-full px-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none placeholder-gray-500"
                    placeholder="Your university name (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Image Management - Premium Style */}
            <div className="space-y-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Product Images *</h2>
                    <p className="text-sm text-gray-600">Manage your product images</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-amber-700">
                  {(images.length - deletedImages.length + newImages.length)}/5 images
                </div>
              </div>

              {/* Current Images */}
              {images.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Current Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-xl border-2 border-amber-200 bg-gray-50">
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index, false)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deleted Images (Restore) */}
              {deletedImages.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Removed Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {deletedImages.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => restoreImage(img)}
                        className="relative group"
                      >
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-red-300 opacity-60 group-hover:opacity-100 transition-opacity">
                          <img
                            src={img}
                            alt={`Removed ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2 py-1 rounded-lg">
                            Restore
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">New Images to Upload</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {newImages.map(({ preview }, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-xl border-2 border-green-200 bg-gray-50">
                          <img
                            src={preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Zone */}
              {images.length - deletedImages.length + newImages.length < 5 && (
                <label className="block">
                  <div className="mt-4 flex justify-center px-6 pt-8 pb-8 border-3 border-dashed border-amber-300 rounded-2xl hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-300 cursor-pointer group">
                    <div className="space-y-4 text-center">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-800">Add More Images</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG up to 5MB • Max 5 images total
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </label>
              )}

              {uploading && (
                <div className="flex items-center justify-center space-x-3 p-4 bg-amber-50 rounded-xl">
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-amber-700">Uploading images...</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-amber-200 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate(`/products/${id}`)}
                className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || uploading || !isChanged}
                className="flex-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white py-3.5 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default EditProduct;