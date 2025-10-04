import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    block px-6 py-3 rounded-lg transition-all duration-200
    ${isActive(path) 
      ? 'bg-[#5a6b35] text-white font-medium' 
      : 'text-gray-300 hover:bg-[#4a5a2a] hover:text-white'}
  `;

  return (
    <nav className="w-80 min-h-screen p-8 flex flex-col" style={{ backgroundColor: '#3d4a1f' }}>
      {/* Logo/Brand */}
      <div className="mb-12">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#c4ff61] rounded-lg flex items-center justify-center">
            <span className="text-[#3d4a1f] font-bold text-lg">E</span>
          </div>
          <span className="text-white text-xl font-semibold">Expense Manager</span>
        </Link>
      </div>

      {/* Tagline */}
      <div className="mb-8">
        <h2 className="text-white text-2xl font-bold leading-tight mb-2">
          Expense Tracking<br />Made Simple
        </h2>
        <p className="text-gray-400 text-sm">
          No manual entry required with OCR scanning
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-2">
        <Link to="/dashboard" className={navLinkClass('/dashboard')}>
          Dashboard
        </Link>
        <Link to="/submit" className={navLinkClass('/submit')}>
          Submit Expense
        </Link>
        {(user?.role === 'Admin' || user?.role === 'Manager') && (
          <Link to="/approvals" className={navLinkClass('/approvals')}>
            Approvals
          </Link>
        )}
        {user?.role === 'Admin' && (
          <Link to="/admin" className={navLinkClass('/admin')}>
            Admin Panel
          </Link>
        )}
      </div>

      {/* User Info & Logout */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="mb-4">
          <div className="text-white font-medium">{user?.name}</div>
          <div className="text-gray-400 text-sm">{user?.email}</div>
          <div className="mt-1">
            <span className="inline-block px-2 py-1 text-xs rounded" style={{ backgroundColor: '#5a6b35', color: '#c4ff61' }}>
              {user?.role}
            </span>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full px-4 py-2 rounded-lg text-white border border-gray-600 hover:bg-[#4a5a2a] transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
