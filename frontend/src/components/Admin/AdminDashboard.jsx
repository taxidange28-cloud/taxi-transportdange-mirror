import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

// Placeholder components for different sections
const DashboardHome = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats Cards */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">1,234</p>
          </div>
          <UsersIcon className="h-12 w-12 text-emerald-500" />
        </div>
        <p className="text-sm text-emerald-600 mt-2">↑ 12% from last month</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Rides</p>
            <p className="text-3xl font-bold text-gray-900">89</p>
          </div>
          <ChartBarIcon className="h-12 w-12 text-blue-500" />
        </div>
        <p className="text-sm text-blue-600 mt-2">↑ 8% from last month</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">$45.2K</p>
          </div>
          <ChartBarIcon className="h-12 w-12 text-amber-500" />
        </div>
        <p className="text-sm text-amber-600 mt-2">↑ 23% from last month</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Issues</p>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </div>
          <Cog6ToothIcon className="h-12 w-12 text-red-500" />
        </div>
        <p className="text-sm text-red-600 mt-2">↓ 5% from last month</p>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {[
          { user: 'John Doe', action: 'Completed ride', time: '5 minutes ago', status: 'success' },
          { user: 'Jane Smith', action: 'New registration', time: '15 minutes ago', status: 'info' },
          { user: 'Mike Johnson', action: 'Payment received', time: '1 hour ago', status: 'success' },
          { user: 'Sarah Williams', action: 'Support ticket opened', time: '2 hours ago', status: 'warning' },
        ].map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{activity.time}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                activity.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                activity.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UserManagement = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
        Add New User
      </button>
    </div>

    {/* Search and Filters */}
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          <option>All Users</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
        </select>
      </div>
    </div>

    {/* Users Table */}
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[
            { name: 'John Doe', email: 'john@example.com', role: 'Driver', status: 'Active', joined: '2026-01-01' },
            { name: 'Jane Smith', email: 'jane@example.com', role: 'Passenger', status: 'Active', joined: '2025-12-28' },
            { name: 'Mike Johnson', email: 'mike@example.com', role: 'Driver', status: 'Inactive', joined: '2025-12-25' },
            { name: 'Sarah Williams', email: 'sarah@example.com', role: 'Passenger', status: 'Active', joined: '2025-12-20' },
          ].map((user, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3" />
                  <div className="font-medium text-gray-900">{user.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.joined}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-emerald-600 hover:text-emerald-900 mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Statistics = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-gray-900">Statistics & Analytics</h2>

    {/* Date Range Selector */}
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <label className="text-sm font-medium text-gray-700">Date Range:</label>
        <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
        <span className="text-gray-500">to</span>
        <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors">
          Apply Filter
        </button>
      </div>
    </div>

    {/* Charts and Statistics */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ride Statistics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
            <span className="text-gray-700">Total Rides</span>
            <span className="text-2xl font-bold text-emerald-600">3,456</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <span className="text-gray-700">Completed Rides</span>
            <span className="text-2xl font-bold text-blue-600">3,234</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
            <span className="text-gray-700">Cancelled Rides</span>
            <span className="text-2xl font-bold text-amber-600">222</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Statistics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="text-gray-700">Total Revenue</span>
            <span className="text-2xl font-bold text-green-600">$145,234</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
            <span className="text-gray-700">Average Ride Value</span>
            <span className="text-2xl font-bold text-purple-600">$42.15</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
            <span className="text-gray-700">Monthly Growth</span>
            <span className="text-2xl font-bold text-indigo-600">+23%</span>
          </div>
        </div>
      </div>
    </div>

    {/* Top Performers */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Drivers</h3>
      <div className="space-y-3">
        {[
          { name: 'John Doe', rides: 145, rating: 4.9, revenue: '$6,234' },
          { name: 'Mike Johnson', rides: 132, rating: 4.8, revenue: '$5,678' },
          { name: 'Robert Brown', rides: 128, rating: 4.7, revenue: '$5,423' },
        ].map((driver, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-emerald-600">#{index + 1}</span>
              <div>
                <p className="font-medium text-gray-900">{driver.name}</p>
                <p className="text-sm text-gray-600">{driver.rides} rides • ⭐ {driver.rating}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-emerald-600">{driver.revenue}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'User Management', path: '/admin/users', icon: UsersIcon },
    { name: 'Statistics', path: '/admin/statistics', icon: ChartBarIcon },
  ];

  const handleLogout = () => {
    // Add logout logic here
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear authentication tokens/session
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-emerald-700">
            <h1 className="text-2xl font-bold">Taxi Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-emerald-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-emerald-100 hover:bg-emerald-700 hover:text-white transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Admin User</span>
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
