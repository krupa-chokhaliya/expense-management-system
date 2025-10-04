import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseList from '../components/ExpenseList';
import { useAuth } from '../hooks/useAuth';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#3d4a1f' }}>Welcome Back, {user?.name}</h1>
        <p className="text-gray-600">Manage your expenses efficiently</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          to="/submit" 
          className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
          style={{ backgroundColor: '#5a6b35' }}
        >
          <div className="text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Submit Expense</h3>
            <p className="text-sm text-white/80">Create a new claim with OCR</p>
          </div>
        </Link>

        <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: '#e8ffc4' }}>
          <div className="text-2xl font-bold mb-2" style={{ color: '#3d4a1f' }}>Quick Scan</div>
          <p className="text-sm mb-4" style={{ color: '#5a6b35' }}>Upload receipt instantly</p>
          <div className="text-4xl">📸</div>
        </div>

        <div className="rounded-2xl p-8 shadow-lg bg-white">
          <div className="text-gray-600 text-sm mb-2">Pending Approval</div>
          <div className="text-4xl font-bold" style={{ color: '#3d4a1f' }}>-</div>
          <div className="text-sm text-gray-500 mt-2">Awaiting review</div>
        </div>

        <div className="rounded-2xl p-8 shadow-lg bg-white">
          <div className="text-gray-600 text-sm mb-2">Approved This Month</div>
          <div className="text-4xl font-bold" style={{ color: '#5a6b35' }}>-</div>
          <div className="text-sm text-gray-500 mt-2">Total approved</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#e8ffc4' }}>
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#3d4a1f' }}>Instant Processing</h3>
          <p className="text-sm" style={{ color: '#5a6b35' }}>OCR scans receipts in seconds</p>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#5a6b35' }}>
          <div className="text-5xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold mb-2 text-white">Multi-Currency</h3>
          <p className="text-sm text-white/80">Auto-convert to base currency</p>
        </div>

        <div className="rounded-2xl p-6 shadow-lg bg-white">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#3d4a1f' }}>Smart Approvals</h3>
          <p className="text-sm text-gray-600">Automated workflow routing</p>
        </div>
      </div>

      {/* Expense List */}
      <ExpenseList />
    </div>
  );
};

export default EmployeeDashboard;
