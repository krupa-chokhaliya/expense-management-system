import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { listCompanyExpenses } from '../services/expenseService';
import { listUsers } from '../services/authService';
import { adminOverride } from '../services/approvalService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: expenses } = useQuery({ queryKey: ['companyExpenses', 1, 20], queryFn: () => listCompanyExpenses(1, 20) });
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: listUsers });

  const overrideMut = useMutation({
    mutationFn: ({ expenseId, action }) => adminOverride(expenseId, action, 'Admin override'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companyExpenses'] });
      alert('Expense status updated successfully!');
    },
  });

  const stats = {
    totalExpenses: expenses?.total || 0,
    totalUsers: users?.length || 0,
    pending: expenses?.items?.filter(e => e.status === 'Waiting Approval').length || 0,
    approved: expenses?.items?.filter(e => e.status === 'Approved').length || 0,
    rejected: expenses?.items?.filter(e => e.status === 'Rejected').length || 0,
    employees: users?.filter(u => u.role === 'Employee').length || 0,
    managers: users?.filter(u => u.role === 'Manager').length || 0,
  };

  const handleOverride = (expenseId, action) => {
    if (window.confirm(`Are you sure you want to ${action.toLowerCase()} this expense?`)) {
      overrideMut.mutate({ expenseId, action });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#3d4a1f' }}>Admin Dashboard</h1>
        <p className="text-gray-600">{user?.company?.name} - Complete System Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: '#5a6b35' }}>
          <div className="text-white">
            <div className="text-sm mb-2 opacity-80">Total Expenses</div>
            <div className="text-5xl font-bold mb-2">{stats.totalExpenses}</div>
            <div className="text-sm opacity-80">All company claims</div>
          </div>
        </div>

        <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: '#e8ffc4' }}>
          <div className="text-sm mb-2" style={{ color: '#5a6b35' }}>Total Users</div>
          <div className="text-5xl font-bold mb-2" style={{ color: '#3d4a1f' }}>{stats.totalUsers}</div>
          <div className="text-sm" style={{ color: '#5a6b35' }}>{stats.employees} Employees, {stats.managers} Managers</div>
        </div>

        <div className="rounded-2xl p-8 shadow-lg bg-white border-2 border-yellow-400">
          <div className="text-sm mb-2 text-gray-600">Pending Approval</div>
          <div className="text-5xl font-bold mb-2 text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Awaiting review</div>
        </div>

        <div className="rounded-2xl p-8 shadow-lg bg-white border-2 border-green-400">
          <div className="text-sm mb-2 text-gray-600">Approved</div>
          <div className="text-5xl font-bold mb-2 text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-500">{stats.rejected} Rejected</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link 
          to="/admin" 
          className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#5a6b35' }}
        >
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-xl font-semibold mb-2 text-white">Manage Users</h3>
          <p className="text-sm text-white/80">Create employees, assign managers</p>
        </Link>

        <Link 
          to="/admin" 
          className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#e8ffc4' }}
        >
          <div className="text-4xl mb-3">⚙️</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#3d4a1f' }}>Approval Rules</h3>
          <p className="text-sm" style={{ color: '#5a6b35' }}>Configure workflow automation</p>
        </Link>

        <Link 
          to="/approvals" 
          className="rounded-2xl p-6 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border-2"
          style={{ borderColor: '#5a6b35' }}
        >
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#3d4a1f' }}>Review Approvals</h3>
          <p className="text-sm text-gray-600">Pending expense approvals</p>
        </Link>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b" style={{ backgroundColor: '#f8f9fa' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#3d4a1f' }}>Recent Company Expenses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr className="text-left">
                <th className="p-4 font-medium text-gray-700">Employee</th>
                <th className="p-4 font-medium text-gray-700">Date</th>
                <th className="p-4 font-medium text-gray-700">Category</th>
                <th className="p-4 font-medium text-gray-700">Amount</th>
                <th className="p-4 font-medium text-gray-700">Status</th>
                <th className="p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses?.items?.length > 0 ? (
                expenses.items.map((e) => (
                  <tr key={e._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{e.submitter?.name || 'Unknown'}</td>
                    <td className="p-4">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="p-4">{e.category}</td>
                    <td className="p-4 font-medium">{e.amountBase} {e.currencyBase}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        e.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        e.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {e.status === 'Waiting Approval' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleOverride(e._id, 'Approve')}
                            className="px-3 py-1 rounded text-xs font-medium text-white transition"
                            style={{ backgroundColor: '#5a6b35' }}
                            disabled={overrideMut.isLoading}
                          >
                            Override Approve
                          </button>
                          <button 
                            onClick={() => handleOverride(e._id, 'Reject')}
                            className="px-3 py-1 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition"
                            disabled={overrideMut.isLoading}
                          >
                            Override Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No expenses submitted yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
