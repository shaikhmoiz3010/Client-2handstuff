import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Sparkles, DollarSign, MapPin, BookOpen, Package, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

// Updated schema with description as optional
const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(1000).optional(), // Made optional
  category: z.enum(['textbook', 'notes', 'calculator', 'stationery', 'other']),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  price: z.number().min(0, 'Price must be positive'),
  condition: z.enum(['new', 'like-new', 'good', 'fair']),
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
  { value: 'new', label: 'Brand New', color: 'bg-emerald-100 text-emerald-800', description: 'Never used, original packaging' },
  { value: 'like-new', label: 'Like New', color: 'bg-blue-100 text-blue-800', description: 'Used once or twice, excellent condition' },
  { value: 'good', label: 'Good', color: 'bg-amber-100 text-amber-800', description: 'Normal wear, fully functional' },
  { value: 'fair', label: 'Fair', color: 'bg-gray-100 text-gray-800', description: 'Visible wear but works well' }
];

function CreateProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: 'textbook',
      condition: 'good',
      isNegotiable: false,
      university: user?.university || '',
      location: user?.location || ''
    }
  });

  const selectedCategory = watch('category');
  const selectedCondition = watch('condition');

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const response = await api.post('/upload/images', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const uploadedUrls = response.data.data?.urls || 
                          response.data.urls || 
                          response.data.data?.images || 
                          [];
      
      if (uploadedUrls.length === 0) {
        toast.error('No image URLs returned from server');
        return;
      }
      
      setImages([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
      
    } catch (error) {
      console.error('Upload error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
      setImagePreviews(imagePreviews.slice(0, -files.length));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      const productData = {
        ...data,
        images: images,
        specifications: JSON.stringify({})
      };

      const response = await api.post('/products', productData);
      toast.success('Product listed successfully!');
      
      navigate(`/products/${response.data.data.product._id}`);
      
      reset();
      setImages([]);
      setImagePreviews([]);
      
    } catch (error) {
      console.error('Create product error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 md:p-8 border border-white/60"
        >
          {/* Premium Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-5 py-2 rounded-full mb-4 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">CREATE LISTING</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-2">
              Sell Your Study Materials
            </h1>
            <p className="text-gray-600">Reach thousands of students looking for affordable study materials</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow">
                  <Info className="w-5 h-5 text-white" />
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
                    <span>{errors.title.message}</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description *
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
                  <Package className="w-5 h-5 text-white" />
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
                    className="w-full px-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23d97706%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3 bg-[length:24px]"
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">Select Condition *</h3>
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
                      <p className="text-xs text-gray-600 mt-2">{condition.description}</p>
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

            {/* Image Upload - Premium Style */}
            <div className="space-y-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Product Images *</h2>
                    <p className="text-sm text-gray-600">High-quality images sell faster</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-amber-700">
                  {images.length}/5 images
                </div>
              </div>

              {/* Upload Zone */}
              <label className="block">
                <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-3 border-dashed border-amber-300 rounded-2xl hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-300 cursor-pointer group">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Upload Images</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Drag & drop or <span className="text-amber-700 font-medium">browse</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG up to 5MB • Max 5 images
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                      disabled={uploading || images.length >= 5}
                    />
                  </div>
                </div>
              </label>

              {uploading && (
                <div className="flex items-center justify-center space-x-3 p-4 bg-amber-50 rounded-xl">
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-amber-700">Uploading images...</span>
                </div>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Uploaded Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-xl border-2 border-amber-200 bg-gray-50">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {images[index] && (
                          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2 py-1 rounded-lg flex items-center space-x-1">
                            <span className="text-xs">✓</span>
                            <span>Uploaded</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {images.length === 0 && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                  <p className="text-sm text-red-700 font-medium flex items-center">
                    <span className="mr-2">⚠️</span>
                    At least one image is required to create listing
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-amber-200">
              <button
                type="submit"
                disabled={isSubmitting || uploading || images.length === 0}
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Listing...</span>
                  </div>
                ) : (
                  'Publish Listing'
                )}
              </button>
              
              <p className="text-center text-sm text-gray-600 mt-4">
                By publishing, you agree to our terms and conditions
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default CreateProduct;