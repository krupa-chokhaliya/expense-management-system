import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { listTeamExpenses, listMyExpenses } from '../services/expenseService';
import { myApprovals } from '../services/approvalService';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { data: teamData } = useQuery({ queryKey: ['teamExpenses', 1, 10], queryFn: () => listTeamExpenses(1, 10) });
  const { data: myData } = useQuery({ queryKey: ['myExpenses', 1, 10], queryFn: () => listMyExpenses(1, 10) });
  const { data: approvals } = useQuery({ queryKey: ['myApprovals'], queryFn: myApprovals });

  const pendingCount = approvals?.length || 0;
  const teamCount = teamData?.total || 0;
  const myCount = myData?.total || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#3d4a1f' }}>Manager Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name} - Manage your team's expenses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          to="/approvals" 
          className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#5a6b35' }}
        >
          <div className="text-white">
            <div className="text-sm mb-2 opacity-80">Pending Approvals</div>
            <div className="text-5xl font-bold mb-2">{pendingCount}</div>
            <div className="text-sm opacity-80">Awaiting your review</div>
          </div>
        </Link>

        <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: '#e8ffc4' }}>
          <div className="text-sm mb-2" style={{ color: '#5a6b35' }}>Team Expenses</div>
          <div className="text-5xl font-bold mb-2" style={{ color: '#3d4a1f' }}>{teamCount}</div>
          <div className="text-sm" style={{ color: '#5a6b35' }}>Total team claims</div>
        </div>

        <div className="rounded-2xl p-8 shadow-lg bg-white">
          <div className="text-sm mb-2 text-gray-600">My Expenses</div>
          <div className="text-5xl font-bold mb-2" style={{ color: '#3d4a1f' }}>{myCount}</div>
          <div className="text-sm text-gray-500">Personal claims</div>
        </div>

        <Link 
          to="/submit" 
          className="rounded-2xl p-8 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border-2"
          style={{ borderColor: '#5a6b35' }}
        >
          <div className="text-4xl mb-2">➕</div>
          <div className="font-semibold" style={{ color: '#3d4a1f' }}>Submit Expense</div>
          <div className="text-sm text-gray-600">Create new claim</div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#5a6b35' }}>
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-xl font-semibold mb-2 text-white">Team Management</h3>
          <p className="text-sm text-white/80">Review and approve team expenses</p>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#e8ffc4' }}>
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#3d4a1f' }}>Analytics</h3>
          <p className="text-sm" style={{ color: '#5a6b35' }}>Track team spending patterns</p>
        </div>

        <div className="rounded-2xl p-6 shadow-lg bg-white">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#3d4a1f' }}>Quick Approve</h3>
          <p className="text-sm text-gray-600">Fast-track common expenses</p>
        </div>
      </div>

      {/* Team Expenses Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b" style={{ backgroundColor: '#f8f9fa' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#3d4a1f' }}>Team Expenses</h2>
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
              </tr>
            </thead>
            <tbody>
              {teamData?.items?.length > 0 ? (
                teamData.items.map((e) => (
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No team expenses yet
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

export default ManagerDashboard;
