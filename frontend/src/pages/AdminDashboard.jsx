import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Shield,
  TrendingUp,
  Package,
  UserPlus,
  KeyRound,
  MessageSquare
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRegisterWorkerModal, setShowRegisterWorkerModal] = useState(false);
  const [selectedUserForWorker, setSelectedUserForWorker] = useState(null);
  const [editingUserGender, setEditingUserGender] = useState(null);
  const [userGenderValue, setUserGenderValue] = useState('');
  const [editingWorkerGender, setEditingWorkerGender] = useState(null);
  const [workerGenderValue, setWorkerGenderValue] = useState('');
  const [filters, setFilters] = useState({
    bookingStatus: '',
    workerStatus: '',
    userSearch: '',
    workerSearch: '',
    needsProvider: ''
  });
  const [pagination, setPagination] = useState({
    bookings: { page: 1, limit: 20, total: 0 },
    workers: { page: 1, limit: 20, total: 0 },
    users: { page: 1, limit: 20, total: 0 }
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
  
    loadDashboardData();
  }, [
    activeTab,
    filters,
    pagination.bookings.page,
    pagination.workers.page,
    pagination.users.page
  ]);
  

  const checkAdminAccess = async () => {
    // If no token at all, show 404 immediately
    if (!token) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        // Token is genuinely expired or invalid — show 404
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        // Server error (500, 503, etc.) — don't log out, try stored data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.role === 'admin') {
            setUser(parsed);
            setLoading(false);
            return;
          }
        }
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      const userData = await res.json();
      setUser(userData);

      if (userData.role !== 'admin') {
        // Not an admin — show 404 (don't reveal the page exists)
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Admin access check error:', error);
      // Network error — try stored data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.role === 'admin') {
            setUser(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore parse error
        }
      }
      setAccessDenied(true);
      setLoading(false);
    }
  };

  

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'dashboard') {
        const statsRes = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } else if (activeTab === 'bookings') {
        const params = new URLSearchParams({
          page: pagination.bookings.page,
          limit: pagination.bookings.limit,
          ...(filters.bookingStatus && { status: filters.bookingStatus }),
          ...(filters.needsProvider && { needsProvider: filters.needsProvider })
        });
        const bookingsRes = await fetch(`${API_BASE_URL}/api/admin/bookings?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(data.bookings || []);
          setPagination(prev => ({
            ...prev,
            bookings: data.pagination || prev.bookings
          }));
        }
      } else if (activeTab === 'workers') {
        const params = new URLSearchParams({
          page: pagination.workers.page,
          limit: pagination.workers.limit,
          ...(filters.workerStatus && { status: filters.workerStatus }),
          ...(filters.workerSearch && { search: filters.workerSearch }) // ADD THIS
        });
        const workersRes = await fetch(`${API_BASE_URL}/api/admin/workers?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (workersRes.ok) {
          const data = await workersRes.json();
          setWorkers(data.workers || []);
          setPagination(prev => {
            if (JSON.stringify(prev.workers) === JSON.stringify(data.pagination)) {
              return prev;
            }
            return {
              ...prev,
              workers: data.pagination
            };
          });
        }
      } else if (activeTab === 'users') {
        const params = new URLSearchParams({
          page: pagination.users.page,
          limit: pagination.users.limit,
          ...(filters.userSearch && { search: filters.userSearch }) // KEEP THIS
        });
        const usersRes = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data.users || []);
          setPagination(prev => ({
            ...prev,
            users: data.pagination || prev.users
          }));
        }
      } else if (activeTab === 'password-resets') {
        const resetRes = await fetch(`${API_BASE_URL}/api/admin/password-reset-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resetRes.ok) {
          const data = await resetRes.json();
          console.log('Password reset requests:', data.requests); // Debug log
          setPasswordResetRequests(data.requests || []);
        } else {
          console.error('Failed to fetch password reset requests:', resetRes.status);
        }
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerStatusUpdate = async (workerId, status, adminNotes = '') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/workers/${workerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminNotes })
      });

      if (res.ok) {
        alert(`Worker ${status} successfully`);
        loadDashboardData();
        setShowWorkerModal(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to update worker status');
      }
    } catch (error) {
      console.error('Update worker status error:', error);
      alert('Failed to update worker status');
    }
  };

  const handleBookingUpdate = async (bookingId, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        alert('Booking updated successfully');
        loadDashboardData();
        setShowBookingModal(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Update booking error:', error);
      alert('Failed to update booking');
    }
  };

  const handleWorkerSearch = (e) => {
    const searchTerm = e.target.value;
    setFilters(prev => ({ ...prev, workerSearch: searchTerm }));
    
    // Reset to page 1 when searching
    setPagination(prev => ({
      ...prev,
      workers: { ...prev.workers, page: 1 }
    }));
    
    // Trigger backend search by reloading data
    // The useEffect will handle the actual API call
  };
  
  const handleUserSearch = (e) => {
    const searchTerm = e.target.value;
    setFilters(prev => ({ ...prev, userSearch: searchTerm }));
    
    // Reset to page 1 when searching
    setPagination(prev => ({
      ...prev,
      users: { ...prev.users, page: 1 }
    }));
    
    // Trigger backend search by reloading data
  };

  const handleAssignWorker = async (bookingId, workerId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/bookings/assign-worker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId, workerId })
      });

      if (res.ok) {
        alert('Worker assigned successfully');
        loadDashboardData();
        setShowBookingModal(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to assign worker');
      }
    } catch (error) {
      console.error('Assign worker error:', error);
      alert('Failed to assign worker');
    }
  };

  const viewWorkerDetails = async (workerId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/workers/${workerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const worker = await res.json();
        setSelectedWorker(worker);
        setShowWorkerModal(true);
      }
    } catch (error) {
      console.error('View worker error:', error);
    }
  };

  const handleWorkerUpdate = async (workerId, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/workers/${workerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
  
      if (res.ok) {
        alert('Worker updated successfully');
        loadDashboardData();
        setShowWorkerModal(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to update worker');
      }
    } catch (error) {
      console.error('Update worker error:', error);
      alert('Failed to update worker');
    }
  };
  
  const handleRegisterUserAsWorker = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setSelectedUserForWorker(userData);
        setShowRegisterWorkerModal(true);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  const handleSubmitWorkerRegistration = async (userId, formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/register-worker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          ...formData,
          serviceTypes: JSON.stringify(formData.serviceTypes),
          workExperiences: JSON.stringify([]),
          availability: JSON.stringify([])
        })
      });
  
      if (res.ok) {
        alert('Worker registered successfully');
        setShowRegisterWorkerModal(false);
        setSelectedUserForWorker(null);
        loadDashboardData();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to register worker');
      }
    } catch (error) {
      console.error('Register worker error:', error);
      alert('Failed to register worker');
    }
  };

  const viewBookingDetails = async (bookingId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const booking = await res.json();
        setSelectedBooking(booking);
        setShowBookingModal(true);
      }
    } catch (error) {
      console.error('View booking error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      'in-progress': { color: 'bg-purple-100 text-purple-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Show a generic "Page Not Found" for unauthorized / unauthenticated users
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-extrabold text-gray-200 select-none">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h2>
          <p className="text-gray-500 mt-3 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-500 flex-shrink-0" />
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage bookings, workers, and users</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 whitespace-nowrap flex-shrink-0"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg mb-6 overflow-x-auto border border-gray-700">
          <div className="border-b border-gray-700">
            <nav className="flex -mb-px min-w-min sm:min-w-full">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'workers', label: 'Workers', icon: UserCheck },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'password-resets', label: 'Password Resets', icon: KeyRound },
                { id: 'referrals', label: 'Referrals', icon: Gift }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-400 bg-gray-800'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
  <div className="space-y-6">
    {/* Stats Grid - Fully Responsive */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-4 md:p-6 border border-gray-700">
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-xs md:text-sm font-medium text-gray-300 truncate">Total Users</p>
        <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stats.stats.totalUsers}</p>
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>
    </div>
  </div>

  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-4 md:p-6 border border-gray-700">
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-xs md:text-sm font-medium text-gray-300 truncate">Total Workers</p>
        <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stats.stats.totalWorkers}</p>
        <p className="text-xs text-yellow-400 mt-1">{stats.stats.pendingWorkers} pending</p>
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <UserCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>
    </div>
  </div>

  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-4 md:p-6 border border-gray-700">
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-xs md:text-sm font-medium text-gray-300 truncate">Total Bookings</p>
        <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stats.stats.totalBookings}</p>
        <p className="text-xs text-blue-400 mt-1">{stats.stats.pendingBookings} pending</p>
        {stats.stats.bookingsNeedingProvider > 0 && (
          <p className="text-xs text-orange-400 mt-1 font-semibold">{stats.stats.bookingsNeedingProvider} need provider</p>
        )}
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>
    </div>
  </div>

  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-4 md:p-6 border border-gray-700">
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-xs md:text-sm font-medium text-gray-300 truncate">Total Revenue</p>
        <p className="text-2xl md:text-3xl font-bold text-white mt-2">R{(stats.stats.totalRevenue || 0).toLocaleString()}</p>
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>
    </div>
  </div>
</div>


    {/* Recent Bookings - Responsive */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700">
  <div className="p-4 md:p-6 border-b border-gray-700">
    <h2 className="text-base md:text-lg font-semibold text-white">Recent Bookings</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-700 text-xs md:text-sm">
      <thead className="bg-gray-800">
        <tr>
          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Service</th>
          <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
          <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
        </tr>
      </thead>
      <tbody className="bg-gray-900 divide-y divide-gray-800">
        {stats.recentBookings?.map((booking) => (
          <tr key={booking._id} className="hover:bg-gray-800 transition-colors">
            <td className="px-3 md:px-6 py-4 font-mono text-gray-400">{booking._id.slice(-6)}</td>
            <td className="hidden md:table-cell px-6 py-4 text-white">{booking.userId?.name}</td>
            <td className="px-3 md:px-6 py-4 text-gray-300">{booking.serviceType}</td>
            <td className="hidden lg:table-cell px-6 py-4 text-gray-400">{new Date(booking.scheduledDate).toLocaleDateString()}</td>
            <td className="hidden lg:table-cell px-6 py-4 font-medium text-white">R{booking.totalCost}</td>
            <td className="px-3 md:px-6 py-4">{getStatusBadge(booking.status)}</td>
            <td className="px-3 md:px-6 py-4">
              <button onClick={() => viewBookingDetails(booking._id)} className="text-blue-400 hover:text-blue-300">
                <Eye className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  </div>
)}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
  <div className="space-y-6">
    {/* Filters */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-3 sm:p-4 border border-gray-700">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <select
          value={filters.bookingStatus}
          onChange={(e) => setFilters({ ...filters, bookingStatus: e.target.value })}
          className="px-3 sm:px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-xs sm:text-sm flex-1 sm:flex-none text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filters.needsProvider}
          onChange={(e) => setFilters({ ...filters, needsProvider: e.target.value })}
          className="px-3 sm:px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-xs sm:text-sm flex-1 sm:flex-none text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Bookings</option>
          <option value="true">Needs Provider</option>
        </select>
      </div>
    </div>

    {/* Bookings Table */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Service</th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date/Time</th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Worker</th>
              <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-800 transition-colors">
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-gray-400">
                  {booking._id.slice(-6)}
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div>
                    <p className="font-medium">{booking.userId?.name}</p>
                    <p className="text-xs text-gray-400">{booking.userId?.email}</p>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                  {booking.serviceType}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div>
                    <p>{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">{booking.scheduledTime}</p>
                  </div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {booking.assignedWorker?.fullName || (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-900 text-orange-200 rounded text-xs font-semibold border border-orange-700">
                      <AlertCircle className="w-3 h-3" />
                      Needs
                    </span>
                  )}
                </td>
                <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  R{booking.totalCost}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => viewBookingDetails(booking._id)}
                    className="text-blue-400 hover:text-blue-300 p-1 hover:bg-gray-800 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="bg-gray-800 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-700">
        <div className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
          Showing {((pagination.bookings.page - 1) * pagination.bookings.limit) + 1} to{' '}
          {Math.min(pagination.bookings.page * pagination.bookings.limit, pagination.bookings.total)} of{' '}
          {pagination.bookings.total}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPagination({ ...pagination, bookings: { ...pagination.bookings, page: Math.max(1, pagination.bookings.page - 1) } })}
            disabled={pagination.bookings.page === 1}
            className="px-2 sm:px-3 py-1 border border-gray-600 bg-gray-700 rounded text-sm disabled:opacity-50 hover:bg-gray-600 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs sm:text-sm text-gray-300">Page {pagination.bookings.page}</span>
          <button
            onClick={() => setPagination({ ...pagination, bookings: { ...pagination.bookings, page: pagination.bookings.page + 1 } })}
            disabled={pagination.bookings.page >= (pagination.bookings.total / pagination.bookings.limit)}
            className="px-2 sm:px-3 py-1 border border-gray-600 bg-gray-700 rounded text-sm disabled:opacity-50 hover:bg-gray-600 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
  <div className="space-y-6">
    {/* Filters and Search */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-3 sm:p-4 space-y-3 border border-gray-700">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search by name, email, phone, or city..."
      value={filters.workerSearch}
      onChange={handleWorkerSearch}
      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-xs sm:text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
    />
  </div>
  <div className="flex flex-col sm:flex-row gap-3">
    <select
      value={filters.workerStatus}
      onChange={(e) => setFilters({ ...filters, workerStatus: e.target.value })}
      className="px-3 sm:px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-xs sm:text-sm flex-1 text-white focus:border-blue-500 focus:outline-none"
    >
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
    <button
      onClick={() => navigate('/admin/register-worker')}
      className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 whitespace-nowrap flex items-center gap-2 justify-center"
    >
      <UserPlus className="w-4 h-4" />
      <span>Register Worker</span>
    </button>
  </div>
</div>

    {/* Workers Table */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-800">
        <tr>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
          <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
          <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Services</th>
          <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Featured</th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody className="bg-gray-900 divide-y divide-gray-800">
        {workers.map((worker) => (
          <tr key={worker._id} className="hover:bg-gray-800 transition-colors">
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
              <div className="flex items-center gap-3">
                {worker.photoDocument ? (
                  <img
                    src={worker.photoDocument}
                    alt={worker.fullName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-600 flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs sm:text-sm font-bold">
                      {worker.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div>
                  {worker.fullName}
                  <p className="sm:hidden text-xs text-gray-400">{worker.email}</p>
                </div>
              </div>
            </td>
            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {worker.email}
            </td>
            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {worker.phone}
            </td>
            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
              {editingWorkerGender === worker._id ? (
                <div className="flex items-center gap-2">
                  <select
                    value={workerGenderValue}
                    onChange={(e) => setWorkerGenderValue(e.target.value)}
                    className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                    autoFocus
                  >
                    <option value="">Not set</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(`${API_BASE_URL}/api/admin/workers/${worker._id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                          },
                          body: JSON.stringify({ gender: workerGenderValue || null })
                        });
                        if (res.ok) {
                          toast.success('Worker gender updated successfully');
                          setEditingWorkerGender(null);
                          loadDashboardData();
                        } else {
                          toast.error('Failed to update worker gender');
                        }
                      } catch (error) {
                        console.error('Update worker gender error:', error);
                        toast.error('Failed to update worker gender');
                      }
                    }}
                    className="text-green-400 hover:text-green-300 text-xs"
                    title="Save"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setEditingWorkerGender(null);
                      setWorkerGenderValue('');
                    }}
                    className="text-red-400 hover:text-red-300 text-xs"
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    worker.gender === 'Female' ? 'bg-pink-900 text-pink-200 border border-pink-700' :
                    worker.gender === 'Male' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                    worker.gender ? 'bg-gray-700 text-gray-200 border border-gray-600' :
                    'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}>
                    {worker.gender || 'Not set'}
                  </span>
                  <button
                    onClick={() => {
                      setEditingWorkerGender(worker._id);
                      setWorkerGenderValue(worker.gender || '');
                    }}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                    title="Edit gender"
                  >
                    ✏️
                  </button>
                </div>
              )}
            </td>
            <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-300">
              <div className="flex flex-wrap gap-1">
                {worker.serviceTypes?.slice(0, 2).map((service, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-blue-900 text-blue-200 rounded text-xs border border-blue-700">
                    {service}
                  </span>
                ))}
                {worker.serviceTypes?.length > 2 && (
                  <span className="text-xs text-gray-400">+{worker.serviceTypes.length - 2}</span>
                )}
              </div>
            </td>
            <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {worker.city}, {worker.province}
            </td>
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
              {getStatusBadge(worker.status)}
            </td>
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/workers/${worker._id}/featured`, {
                      method: 'PUT',
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    });
                    if (res.ok) {
                      toast.success(worker.featured ? 'Worker unfeatured' : 'Worker featured');
                      loadDashboardData();
                    } else {
                      toast.error('Failed to update featured status');
                    }
                  } catch (error) {
                    console.error('Toggle featured error:', error);
                    toast.error('Failed to update featured status');
                  }
                }}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  worker.featured 
                    ? 'bg-yellow-900 text-yellow-200 border border-yellow-700 hover:bg-yellow-800' 
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
                }`}
                title={worker.featured ? 'Click to unfeature' : 'Click to feature'}
              >
                {worker.featured ? '⭐ Featured' : '☆ Feature'}
              </button>
            </td>
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
              <button
                onClick={() => viewWorkerDetails(worker._id)}
                className="text-blue-400 hover:text-blue-300 p-1 hover:bg-gray-800 rounded"
              >
                <Eye className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  {/* Pagination with black theme */}
  <div className="bg-gray-800 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-700">
    <div className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
      Showing {((pagination.workers.page - 1) * pagination.workers.limit) + 1} to{' '}
      {Math.min(pagination.workers.page * pagination.workers.limit, pagination.workers.total)} of{' '}
      {pagination.workers.total}
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => setPagination({ ...pagination, workers: { ...pagination.workers, page: Math.max(1, pagination.workers.page - 1) } })}
        disabled={pagination.workers.page === 1}
        className="px-2 sm:px-3 py-1 border border-gray-600 bg-gray-700 rounded text-sm disabled:opacity-50 hover:bg-gray-600 text-white"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs sm:text-sm text-gray-300">Page {pagination.workers.page}</span>
      <button
        onClick={() => setPagination({ ...pagination, workers: { ...pagination.workers, page: pagination.workers.page + 1 } })}
        disabled={pagination.workers.page >= (pagination.workers.total / pagination.workers.limit)}
        className="px-2 sm:px-3 py-1 border border-gray-600 bg-gray-700 rounded text-sm disabled:opacity-50 hover:bg-gray-600 text-white"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
  </div>
)}


        {/* Users Tab */}
        {activeTab === 'users' && (
  <div className="space-y-6">
    {/* Search */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-4 border border-gray-700">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={filters.userSearch}
            onChange={handleUserSearch}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>

    {/* Users Table - Black Theme */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Phone</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Gender</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Joined</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                <td className="px-4 md:px-6 py-4 text-sm font-medium text-white">
                  {user.name} {user.lastname}
                  <p className="md:hidden text-xs text-gray-400">{user.email}</p>
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-300">
                  {user.phone}
                </td>
                <td className="px-4 md:px-6 py-4">
                  {editingUserGender === user._id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={userGenderValue}
                        onChange={(e) => setUserGenderValue(e.target.value)}
                        className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                        autoFocus
                      >
                        <option value="">Not set</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/admin/users/${user._id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                              },
                              body: JSON.stringify({ gender: userGenderValue || null })
                            });
                            if (res.ok) {
                              toast.success('Gender updated successfully');
                              setEditingUserGender(null);
                              loadDashboardData();
                            } else {
                              toast.error('Failed to update gender');
                            }
                          } catch (error) {
                            console.error('Update gender error:', error);
                            toast.error('Failed to update gender');
                          }
                        }}
                        className="text-green-400 hover:text-green-300 text-xs"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingUserGender(null);
                          setUserGenderValue('');
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.gender === 'Female' ? 'bg-pink-900 text-pink-200 border border-pink-700' :
                        user.gender === 'Male' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                        user.gender ? 'bg-gray-700 text-gray-200 border border-gray-600' :
                        'bg-gray-800 text-gray-500 border border-gray-700'
                      }`}>
                        {user.gender || 'Not set'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingUserGender(user._id);
                          setUserGenderValue(user.gender || '');
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                        title="Edit gender"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-900 text-purple-200 border border-purple-700' : 'bg-gray-700 text-gray-200 border border-gray-600'
                    }`}>
                      {user.role || 'user'}
                    </span>
                    {user.appliedAsWorker && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200 border border-green-700">
                        Worker
                      </span>
                    )}
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 md:px-6 py-4">
                  {!user.appliedAsWorker && (
                    <button
                      onClick={() => handleRegisterUserAsWorker(user._id)}
                      className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium hover:bg-gray-800 px-2 py-1 rounded"
                    >
                      Register as Worker
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination - Black Theme */}
      <div className="bg-gray-800 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-700">
        <div className="text-sm text-gray-300 text-center md:text-left">
          Showing {((pagination.users.page - 1) * pagination.users.limit) + 1} to{' '}
          {Math.min(pagination.users.page * pagination.users.limit, pagination.users.total)} of{' '}
          {pagination.users.total} users
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPagination({ ...pagination, users: { ...pagination.users, page: pagination.users.page - 1 } })}
            disabled={pagination.users.page === 1}
            className="px-3 py-1 border border-gray-600 bg-gray-700 rounded text-sm disabled:opacity-50 hover:bg-gray-600 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPagination({ ...pagination, users: { ...pagination.users, page: pagination.users.page + 1 } })}
            disabled={pagination.users.page >= pagination.users.pages}
            className="px-3 py-1 border border-gray-600 bg-gray-700 rounded text-sm disabled:opacity-50 hover:bg-gray-600 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Password Reset Requests Tab */}
        {activeTab === 'password-resets' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="px-4 md:px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-blue-400" />
                    Password Reset Requests
                  </h3>
                  <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-medium border border-blue-700">
                    {passwordResetRequests.length} Active
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Send the verification code to users via WhatsApp. Codes are automatically sent to admin phones.
                </p>
              </div>

              {passwordResetRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">No active password reset requests</p>
                  <p className="text-gray-500 text-sm mt-2">All requests have been processed or expired</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Phone</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase bg-gray-800">Verification Code</th>
                        <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Requested</th>
                        <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Expires</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                      {passwordResetRequests.map((request) => {
                        const isExpired = new Date() > new Date(request.expiresAt);
                        const timeRemaining = Math.max(0, Math.floor((new Date(request.expiresAt) - new Date()) / 1000 / 60));
                        
                        return (
                          <tr key={request.userId} className="hover:bg-gray-800 transition-colors">
                            <td className="px-4 md:px-6 py-4 text-sm font-medium text-white">
                              {request.name || 'Unknown User'}
                              <p className="md:hidden text-xs text-gray-400 mt-1">{request.email}</p>
                            </td>
                            <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-300">
                              {request.email}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-sm text-gray-300">
                              {request.phone || 'N/A'}
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              {request.code ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                  <code className="px-4 py-2 bg-gray-800 text-green-400 font-mono text-base font-bold rounded-lg border-2 border-green-600 shadow-lg">
                                    {request.code}
                                  </code>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(request.code);
                                      toast.success('Code copied to clipboard!');
                                    }}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                                    title="Copy code"
                                  >
                                    Copy
                                  </button>
                                </div>
                              ) : (
                                <span className="text-red-400 text-sm font-medium">Code not available</span>
                              )}
                            </td>
                            <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-400">
                              {new Date(request.requestedAt).toLocaleString()}
                            </td>
                            <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-400">
                              {new Date(request.expiresAt).toLocaleString()}
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <div className="flex items-center gap-2">
                                {isExpired ? (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-200 border border-red-700">
                                    Expired
                                  </span>
                                ) : (
                                  <>
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200 border border-yellow-700">
                                      Active
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {timeRemaining}m left
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <ReferralsTab token={token} API_BASE_URL={API_BASE_URL} />
        )}
      </div>

      {/* Worker Details Modal */}
      {showWorkerModal && selectedWorker && (
  <WorkerDetailsModal
    worker={selectedWorker}
    workers={workers}
    onClose={() => {
      setShowWorkerModal(false);
      setSelectedWorker(null);
    }}
    onNavigate={(workerId) => viewWorkerDetails(workerId)}
    onApprove={(adminNotes) => handleWorkerStatusUpdate(selectedWorker._id, 'approved', adminNotes)}
    onReject={(adminNotes) => handleWorkerStatusUpdate(selectedWorker._id, 'rejected', adminNotes)}
    onSetPending={(adminNotes) => handleWorkerStatusUpdate(selectedWorker._id, 'pending', adminNotes)}
    onUpdate={handleWorkerUpdate}
  />
)}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedBooking(null);
          }}
          onUpdate={handleBookingUpdate}
          onAssignWorker={handleAssignWorker}
          workers={workers.filter(w => w.status === 'approved')}
        />
      )}

      {/* Register Worker Modal */}
      {showRegisterWorkerModal && selectedUserForWorker && (
        <RegisterWorkerModal
          user={selectedUserForWorker}
          onClose={() => {
            setShowRegisterWorkerModal(false);
            setSelectedUserForWorker(null);
          }}
          onSubmit={handleSubmitWorkerRegistration}
        />
      )}
    </div>
  );
};

// Worker Details Modal Component
// Worker Details Modal Component
const WorkerDetailsModal = ({ worker, workers = [], onClose, onNavigate, onApprove, onReject, onSetPending, onUpdate }) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorker, setEditedWorker] = useState({
    fullName: worker.fullName || '',
    email: worker.email || '',
    phone: worker.phone || '',
    nationality: worker.nationality || '',
    idNumber: worker.idNumber || '',
    city: worker.city || '',
    province: worker.province || '',
    streetAddress: worker.streetAddress || '',
    suburb: worker.suburb || '',
    postalCode: worker.postalCode || '',
    skills: worker.skills || '',
    workExperience: worker.workExperience || '',
    serviceTypes: worker.serviceTypes || []
  });

  // Find current worker index in the list for next/prev navigation
  const currentIndex = workers.findIndex(w => w._id === worker._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < workers.length - 1 && currentIndex !== -1;

  const handleSaveEdit = async () => {
    await onUpdate(worker._id, editedWorker);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 bg-opacity-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mt-20">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {/* Previous Worker Button */}
            <button
              onClick={() => hasPrev && onNavigate(workers[currentIndex - 1]._id)}
              disabled={!hasPrev}
              className={`p-1.5 rounded-lg border transition-colors ${
                hasPrev
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              title="Previous worker"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Worker Details</h2>
              {workers.length > 0 && currentIndex !== -1 && (
                <p className="text-xs text-gray-500">{currentIndex + 1} of {workers.length}</p>
              )}
            </div>
            {/* Next Worker Button */}
            <button
              onClick={() => hasNext && onNavigate(workers[currentIndex + 1]._id)}
              disabled={!hasNext}
              className={`p-1.5 rounded-lg border transition-colors ${
                hasNext
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              title="Next worker"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && worker.status === 'approved' && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedWorker.fullName}
                    onChange={(e) => setEditedWorker({...editedWorker, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-1"
                  />
                ) : (
                  <p className="font-medium text-sm sm:text-base">{worker.fullName}</p>
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedWorker.email}
                    onChange={(e) => setEditedWorker({...editedWorker, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-1"
                  />
                ) : (
                  <p className="font-medium text-sm sm:text-base break-all">{worker.email}</p>
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedWorker.phone}
                    onChange={(e) => setEditedWorker({...editedWorker, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-1"
                  />
                ) : (
                  <p className="font-medium text-sm sm:text-base">{worker.phone}</p>
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Nationality</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedWorker.nationality}
                    onChange={(e) => setEditedWorker({...editedWorker, nationality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-1"
                  />
                ) : (
                  <p className="font-medium text-sm sm:text-base">{worker.nationality}</p>
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">ID Number</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedWorker.idNumber}
                    onChange={(e) => setEditedWorker({...editedWorker, idNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-1"
                  />
                ) : (
                  <p className="font-medium text-sm sm:text-base">{worker.idNumber || 'N/A'}</p>
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Location</p>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <input
                      type="text"
                      placeholder="City"
                      value={editedWorker.city}
                      onChange={(e) => setEditedWorker({...editedWorker, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Province"
                      value={editedWorker.province}
                      onChange={(e) => setEditedWorker({...editedWorker, province: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ) : (
                  <p className="font-medium text-sm sm:text-base">{worker.city}, {worker.province}</p>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {worker.serviceTypes?.map((service, idx) => (
                <span key={idx} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Documents</h3>
            <div className="space-y-3 sm:space-y-4">
              {worker.photoDocument && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Profile Photo</p>
                  <img
                    src={worker.photoDocument}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              {worker.idDocument && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">ID Document</p>
                  <a
                    href={worker.idDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    View ID Document
                  </a>
                </div>
              )}
              {worker.proofOfAddress && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Proof of Address</p>
                  <a
                    href={worker.proofOfAddress}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    View Proof of Address
                  </a>
                </div>
              )}
              {worker.workPermit && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Work Permit</p>
                  <a
                    href={worker.workPermit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    View Work Permit
                  </a>
                </div>
              )}
              {worker.refugeeId && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Refugee ID</p>
                  <a
                    href={worker.refugeeId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    View Refugee ID
                  </a>
                </div>
              )}
              {worker.qualificationsDocuments && worker.qualificationsDocuments.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Qualifications</p>
                  <div className="space-y-2">
                    {worker.qualificationsDocuments.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Qualification {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills & Experience */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Skills & Experience</h3>
            {isEditing ? (
              <textarea
                value={editedWorker.skills}
                onChange={(e) => setEditedWorker({...editedWorker, skills: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                rows={3}
              />
            ) : (
              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{worker.skills || 'No skills provided'}</p>
            )}
            {worker.workExperience && (
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Work Experience</p>
                {isEditing ? (
                  <textarea
                    value={editedWorker.workExperience}
                    onChange={(e) => setEditedWorker({...editedWorker, workExperience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{worker.workExperience}</p>
                )}
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Approval Actions */}
          {worker.status === 'pending' && !isEditing && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Admin Notes</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this worker..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3 sm:mb-4"
                rows={3}
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => onApprove(adminNotes)}
                  className="flex-1 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 font-medium text-sm sm:text-base"
                >
                  Approve Worker
                </button>
                <button
                  onClick={() => onReject(adminNotes)}
                  className="flex-1 bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 font-medium text-sm sm:text-base"
                >
                  Reject Worker
                </button>
              </div>
            </div>
          )}

          {/* Set to Pending Action for Approved Workers */}
          {worker.status === 'approved' && !isEditing && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Status Management</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about why you're setting this worker back to pending..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3 sm:mb-4"
                rows={3}
              />
              <button
                onClick={() => onSetPending(adminNotes)}
                className="w-full bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-yellow-700 font-medium text-sm sm:text-base"
              >
                Set Status to Pending
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// Booking Details Modal Component
const BookingDetailsModal = ({ booking, onClose, onUpdate, onAssignWorker, workers }) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState(booking.assignedWorker?._id || '');
  const [status, setStatus] = useState(booking.status);
  const [notes, setNotes] = useState(booking.notes || '');

  const handleSave = () => {
    const updates = { status, notes };
    if (selectedWorkerId && selectedWorkerId !== booking.assignedWorker?._id) {
      onAssignWorker(booking._id, selectedWorkerId);
    } else {
      onUpdate(booking._id, updates);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium">{booking.userId?.name} {booking.userId?.lastname}</p>
                <p className="text-sm text-gray-500">{booking.userId?.email}</p>
                <p className="text-sm text-gray-500">{booking.userId?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-medium">{booking.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">
                  {new Date(booking.scheduledDate).toLocaleDateString()} @ {booking.scheduledTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="font-medium">R{booking.totalCost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{booking.address?.formattedAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-medium">{booking.payment?.status || 'pending'}</p>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Worker Assignment</h3>
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a worker...</option>
              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.fullName} - {worker.serviceTypes?.join(', ')}
                </option>
              ))}
            </select>
            {booking.assignedWorker && (
              <p className="text-sm text-gray-600 mt-2">
                Currently assigned: {booking.assignedWorker.fullName}
              </p>
            )}
          </div>

          {/* Status Update */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Register Worker Modal Component
const RegisterWorkerModal = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: `${user.name} ${user.lastname}`,
    email: user.email,
    phone: user.phone,
    nationality: 'South African',
    idNumber: '',
    country: 'South Africa',
    province: '',
    city: '',
    streetAddress: '',
    suburb: '',
    postalCode: '',
    serviceTypes: [],
    skills: '',
    workExperience: ''
  });

  const serviceOptions = [
    'Indoor Services',
    'Outdoor Services',
    'Office Cleaning',
    'Event Cleaning',
    'Moving Cleaning',
    'Laundry & Ironing'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(user._id, formData);
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(service)
        ? prev.serviceTypes.filter(s => s !== service)
        : [...prev.serviceTypes, service]
    }));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto lg:mt-20">
      <div className="bg-white rounded-lg max-w-3xl w-full mt-40">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-lg z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Register Worker</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Province</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Suburb</label>
                <input
                  type="text"
                  value={formData.suburb}
                  onChange={(e) => setFormData({...formData, suburb: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Service Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {serviceOptions.map((service) => (
                <label key={service} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.serviceTypes.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills & Experience */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Skills & Experience</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Skills</label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  placeholder="List relevant skills..."
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Work Experience</label>
                <textarea
                  value={formData.workExperience}
                  onChange={(e) => setFormData({...formData, workExperience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={4}
                  placeholder="Describe work experience..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
            >
              Register as Worker
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReferralsTab = ({ token, API_BASE_URL }) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/referrals`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setReferrals(data.referrals || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markPaid = async (referralId, commissionIndex) => {
    await fetch(`${API_BASE_URL}/api/admin/referrals/${referralId}/mark-paid`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ commissionIndex }),
    });
    // Refresh
    const r = await fetch(`${API_BASE_URL}/api/admin/referrals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json();
    setReferrals(data.referrals || []);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: referrals.length },
          { label: "Total Referrals", value: referrals.reduce((s, r) => s + (r.totalReferrals || 0), 0) },
          { label: "Total Earned (agents)", value: `R${referrals.reduce((s, r) => s + (r.totalEarned || 0), 0).toFixed(2)}` },
          { label: "Unpaid Commissions", value: referrals.reduce((s, r) => s + (r.commissions?.filter(c => !c.paid).length || 0), 0) },
        ].map((stat) => (
          <div key={stat.label} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 border border-gray-700 text-center">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Agent table */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-white font-semibold">Referral Partners</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700 text-sm">
            <thead className="bg-gray-800">
              <tr>
                {["Agent", "Code", "Plan", "Clients", "Earned", "Unpaid", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {referrals.map((r) => {
                const unpaid = r.commissions?.filter(c => !c.paid).reduce((s, c) => s + c.commissionAmount, 0) || 0;
                return (
                  <tr key={r._id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-4 text-white">
                      <p className="font-medium">{r.fullName}</p>
                      <p className="text-xs text-gray-400">{r.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-green-400 font-mono text-sm">{r.referralCode}</code>
                    </td>
                    <td className="px-4 py-4 text-gray-300 capitalize text-xs">{r.payoutPreference}</td>
                    <td className="px-4 py-4 text-white font-semibold">{r.totalReferrals || 0}</td>
                    <td className="px-4 py-4 text-white font-semibold">R{(r.totalEarned || 0).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`font-semibold ${unpaid > 0 ? "text-yellow-400" : "text-gray-500"}`}>
                        R{unpaid.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === "active" ? "bg-green-900 text-green-300 border border-green-700" : "bg-gray-700 text-gray-400"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {unpaid > 0 && (
                        <button
                          onClick={() => {
                            const unpaidIndexes = r.commissions
                              .map((c, i) => (!c.paid ? i : null))
                              .filter(i => i !== null);
                            unpaidIndexes.forEach(idx => markPaid(r._id, idx));
                          }}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Mark all paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

