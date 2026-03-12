import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContent';
import { useDarkMode } from '../contexts/DarkModeContext';
import { taskService } from '../services/api';
import Header from '../components/layout/Header';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import {
    Plus,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Calendar,
    Target,
    BarChart3,
    Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const { darkMode } = useDarkMode();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({});
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        overdue: 0
    });

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    useEffect(() => {
        calculateStats();
    }, [tasks]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getTasks(filters);
            setTasks(response.data.tasks);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const total = pagination.total || 0;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const pending = tasks.filter(task => task.status === 'pending').length;
        const inProgress = tasks.filter(task => task.status === 'in-progress').length;
        const overdue = tasks.filter(task => 
            task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
        ).length;

        setStats({ total, completed, pending, inProgress, overdue });
    };

    const handleCreateTask = async (taskData) => {
        try {
            await taskService.createTask(taskData);
            toast.success('Task created successfully');
            setShowForm(false);
            fetchTasks();
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            await taskService.updateTask(editingTask._id, taskData);
            toast.success('Task updated successfully');
            setEditingTask(null);
            setShowForm(false);
            fetchTasks();
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await taskService.deleteTask(taskId);
            toast.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            priority: '',
            search: '',
            page: 1,
            limit: 10
        });
    };

    const getCompletionPercentage = () => {
        return stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    };

    const StatCard = ({ icon: Icon, label, value, color, subtitle, trend }) => (
        <div className="group relative">
            <div className="card p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                            {subtitle && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    {trend && (
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${trend.color}`}>
                            {trend.value}
                        </div>
                    )}
                </div>
                {/* Progress bar for completion */}
                {label === 'Completed' && stats.total > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{getCompletionPercentage()}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${getCompletionPercentage()}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const QuickActionButton = ({ icon: Icon, label, onClick, variant = 'outline' }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                variant === 'primary' 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
            }`}
        >
            <Icon className={`w-5 h-5 mr-3 group-hover:scale-110 transition-transform ${
                variant === 'primary' ? 'text-white' : 'text-purple-600 dark:text-purple-400'
            }`} />
            <span className="font-medium text-sm">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Header />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                    Welcome back, <span className="text-purple-600 dark:text-purple-400">{user?.name}</span>!
                                </h1>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                                Here's what's happening with your tasks today. 
                                {stats.completed > 0 && ` You've completed ${stats.completed} tasks so far!`}
                            </p>
                            
                            {/* Daily Progress */}
                            {stats.total > 0 && (
                                <div className="mt-4 max-w-md">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <span>Daily Progress</span>
                                        <span>{getCompletionPercentage()}% Complete</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div 
                                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                            style={{ width: `${getCompletionPercentage()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 lg:mt-0 lg:ml-8">
                            <button
                                onClick={() => {
                                    setEditingTask(null);
                                    setShowForm(true);
                                }}
                                className="group bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                                <span>Create New Task</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Stats Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <BarChart3 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                                    Overview
                                </h2>
                                <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                                    Today
                                </span>
                            </div>

                            <StatCard
                                icon={TrendingUp}
                                label="Total Tasks"
                                value={stats.total}
                                color="text-blue-600 dark:text-blue-400"
                                subtitle="All tasks"
                            />

                            <StatCard
                                icon={CheckCircle}
                                label="Completed"
                                value={stats.completed}
                                color="text-green-600 dark:text-green-400"
                                subtitle={`${getCompletionPercentage()}% done`}
                            />

                            <StatCard
                                icon={Clock}
                                label="In Progress"
                                value={stats.inProgress}
                                color="text-blue-600 dark:text-blue-400"
                                subtitle="Active work"
                            />

                            <StatCard
                                icon={AlertCircle}
                                label="Pending"
                                value={stats.pending}
                                color="text-yellow-600 dark:text-yellow-400"
                                subtitle="Waiting to start"
                            />

                            {stats.overdue > 0 && (
                                <StatCard
                                    icon={Calendar}
                                    label="Overdue"
                                    value={stats.overdue}
                                    color="text-red-600 dark:text-red-400"
                                    subtitle="Needs attention"
                                />
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="card p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Target className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <QuickActionButton
                                    icon={Plus}
                                    label="Add New Task"
                                    onClick={() => {
                                        setEditingTask(null);
                                        setShowForm(true);
                                    }}
                                    variant="primary"
                                />
                                <QuickActionButton
                                    icon={CheckCircle}
                                    label="View Completed"
                                    onClick={() => handleFilterChange({ status: 'completed' })}
                                />
                                <QuickActionButton
                                    icon={Clock}
                                    label="In Progress Tasks"
                                    onClick={() => handleFilterChange({ status: 'in-progress' })}
                                />
                                <QuickActionButton
                                    icon={TrendingUp}
                                    label="View All Tasks"
                                    onClick={clearFilters}
                                />
                            </div>
                        </div>

                        {/* Productivity Tip */}
                        <div className="card p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-start space-x-3">
                                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">
                                        Productivity Tip
                                    </h4>
                                    <p className="text-purple-700 dark:text-purple-300 text-xs mt-1">
                                        {stats.pending > 0 
                                            ? `Start with your ${stats.pending} pending tasks to build momentum!`
                                            : 'Great job! All tasks are in progress or completed.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="xl:col-span-3">
                        {showForm ? (
                            <div className="card p-6 animate-fade-in border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {editingTask ? 'Edit Task' : 'Create New Task'}
                                    </h2>
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <TaskForm
                                    task={editingTask}
                                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditingTask(null);
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <TaskFilters
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                />
                                
                                <div className="card border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-50 to-gray-50 dark:from-purple-900/20 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Your Tasks
                                                {stats.total > 0 && (
                                                    <span className="text-purple-600 dark:text-purple-400 ml-2">
                                                        ({stats.total})
                                                    </span>
                                                )}
                                            </h3>
                                            {stats.total > 0 && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Page {pagination.current} of {pagination.pages}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <TaskList
                                        tasks={tasks}
                                        loading={loading}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        pagination={pagination}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;