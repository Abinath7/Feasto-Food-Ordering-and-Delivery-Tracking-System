import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/menu', label: 'Manage Menu', icon: '🍽️' },
    { path: '/admin/orders', label: 'Manage Orders', icon: '📦' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="bg-white rounded-lg shadow-md mb-6 p-2">
          <div className="flex gap-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  location.pathname === item.path
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
