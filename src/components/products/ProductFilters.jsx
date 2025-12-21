import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

const ProductFilters = ({ filters, onFilterChange, onReset, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { value: 'textbook', label: 'Textbooks' },
    { value: 'notes', label: 'Notes' },
    { value: 'calculator', label: 'Calculators' },
    { value: 'stationery', label: 'Stationery' },
    { value: 'other', label: 'Other' }
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const statuses = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'reserved', label: 'Reserved' }
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-views', label: 'Most Viewed' },
    { value: '-rating', label: 'Highest Rated' }
  ];

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    if (onClose) onClose();
  };

  const handleResetLocal = () => {
    const resetFilters = {
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      status: 'available',
      university: '',
      location: '',
      search: '',
      sort: '-createdAt',
      page: 1,
      limit: 12
    };
    setLocalFilters(resetFilters);
    onReset();
    if (onClose) onClose();
  };

  const hasActiveFilters = Object.entries(localFilters).some(([key, value]) => 
    value && !['page', 'limit', 'sort', 'status'].includes(key) && value !== 'available'
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Filters</h3>
            <p className="text-sm text-gray-600">Refine your search</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Active Filters Clear */}
      {hasActiveFilters && (
        <div className="mb-6 flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
          <span className="text-sm font-medium text-amber-700">Active filters</span>
          <button
            onClick={handleResetLocal}
            className="text-sm font-medium text-amber-700 hover:text-amber-900 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Sort Options */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Sort By
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange('sort', option.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                localFilters.sort === option.value
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category - Grid Style */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleChange('category', localFilters.category === category.value ? '' : category.value)}
              className={`px-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                localFilters.category === category.value
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-amber-600 shadow'
                  : 'bg-white border-gray-300 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition - Grid Style */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Condition
        </label>
        <div className="grid grid-cols-2 gap-3">
          {conditions.map((condition) => (
            <button
              key={condition.value}
              onClick={() => handleChange('condition', localFilters.condition === condition.value ? '' : condition.value)}
              className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                localFilters.condition === condition.value
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-amber-600 shadow'
                  : 'bg-white border-gray-300 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              {condition.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Price Range (Rs)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Status - Grid Style */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => handleChange('status', status.value)}
              className={`px-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                localFilters.status === status.value
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-amber-600 shadow'
                  : 'bg-white border-gray-300 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Location
        </label>
        <input
          type="text"
          placeholder="Enter location"
          value={localFilters.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        />
      </div>

      {/* University */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          University
        </label>
        <input
          type="text"
          placeholder="Enter university"
          value={localFilters.university}
          onChange={(e) => handleChange('university', e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleResetLocal}
          className="flex-1 px-2 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-all"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white py-1 rounded-lg font-semibold shadow hover:shadow-lg transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;