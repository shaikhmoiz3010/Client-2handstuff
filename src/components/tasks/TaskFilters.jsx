import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const TaskFilters = ({ filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value) => {
    onFilterChange({ search: value, page: 1 });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ status, page: 1 });
  };

  const handlePriorityChange = (priority) => {
    onFilterChange({ priority, page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({ 
      status: '', 
      priority: '', 
      search: '', 
      page: 1 
    });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input pl-10 pr-4"
            placeholder="Search tasks..."
          />
        </div>

        {/* Filter Toggle and Clear */}
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors duration-200 ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(filters.status || filters.priority) && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(filters.status ? 1 : 0) + (filters.priority ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['', 'pending', 'in-progress', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      filters.status === status
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status === '' ? 'All' : status.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {['', 'low', 'medium', 'high'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => handlePriorityChange(priority)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 capitalize ${
                      filters.priority === priority
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {priority === '' ? 'All' : priority}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              Search: "{filters.search}"
              <button
                onClick={() => handleSearchChange('')}
                className="ml-2 hover:text-blue-600 dark:hover:text-blue-200 transition-colors duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 capitalize">
              Status: {filters.status}
              <button
                onClick={() => handleStatusChange('')}
                className="ml-2 hover:text-yellow-600 dark:hover:text-yellow-200 transition-colors duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.priority && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 capitalize">
              Priority: {filters.priority}
              <button
                onClick={() => handlePriorityChange('')}
                className="ml-2 hover:text-green-600 dark:hover:text-green-200 transition-colors duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;