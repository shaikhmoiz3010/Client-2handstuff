import { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  Calendar, 
  Flag, 
  Tags,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

const TaskList = ({ tasks, loading, onEdit, onDelete, pagination, onPageChange }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'badge-warning', label: 'Pending' },
      'in-progress': { class: 'badge-info', label: 'In Progress' },
      completed: { class: 'badge-success', label: 'Completed' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { class: 'badge-success', label: 'Low' },
      medium: { class: 'badge-warning', label: 'Medium' },
      high: { class: 'badge-danger', label: 'High' }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Get started by creating your first task to stay organized.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-t-xl border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tasks ({pagination.total || 0})
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Page {pagination.current} of {pagination.pages}</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4">
                    {task.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>

                {task.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Flag className="w-4 h-4" />
                    <span className="capitalize">{task.priority} priority</span>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tags className="w-4 h-4" />
                      <div className="flex space-x-1">
                        {task.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{task.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="relative ml-4">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === task._id ? null : task._id)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {activeDropdown === task._id && (
                  <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 animate-slide-in">
                    <button
                      onClick={() => {
                        onEdit(task);
                        setActiveDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4 mr-3" />
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        onDelete(task._id);
                        setActiveDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((pagination.current - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.current * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              <button
                onClick={() => onPageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;