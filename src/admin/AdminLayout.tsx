import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Categories', href: '/admin/categories', icon: 'category' },
    { name: 'Products', href: '/admin/products', icon: 'inventory_2' },
    { name: 'Orders', href: '/admin/orders', icon: 'shopping_bag' },
    { name: 'Customers', href: '/admin/customers', icon: 'group' },
    { name: 'Payments', href: '/admin/payments', icon: 'credit_card' },
    { name: 'Analytics', href: '#', icon: 'bar_chart' },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-800" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'" }}>
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0 border-r border-gray-200 bg-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col gap-4 p-6 h-full">
          {/* Logo */}
          <a href="/">
            <div className="flex gap-3 items-center mb-6">
              <span className="material-symbols-outlined text-4xl text-orange-500">storefront</span>
              <div className="flex flex-col">
                <h1 className="text-gray-800 text-lg font-bold leading-tight tracking-tight">Shopazon</h1>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Admin Panel</p>
              </div>
            </div>
          </a>
          
          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.href || 
                  (item.href === '/admin/categories' && location.pathname.startsWith('/admin/add-category'))
                    ? 'bg-orange-50 text-orange-600 font-medium' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  {item.icon}
                </span>
                <p className="text-sm">{item.name}</p>
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto">
            <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors mb-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>settings</span>
              <p className="text-sm font-medium">Settings</p>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight hidden sm:block">
              {location.pathname.includes('categories') && !location.pathname.includes('add-category') && 'Categories'}
              {location.pathname.includes('add-category') && 'Add Category'}
              {location.pathname.includes('products') && !location.pathname.includes('add-product') && 'Products'}
              {location.pathname.includes('add-product') && 'Add Product'}
              {location.pathname.includes('orders') && 'Orders'}
              {location.pathname.includes('customers') && 'Customers'}
              {location.pathname.includes('payments') && 'Payments'}
              {location.pathname.includes('dashboard') && 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2.5 w-80 focus-within:ring-2 focus-within:ring-orange-500/50 transition-shadow">
              <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
              <input 
                className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder-gray-400 text-gray-800 ml-2" 
                placeholder="Search orders, products..." 
                type="text" 
              />
            </div>
            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
              <button className="flex items-center gap-3 pl-2 pr-1 rounded-full hover:bg-gray-50 transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">Admin User</p>
                  <p className="text-xs text-gray-500 mt-0.5">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  AU
                </div>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;