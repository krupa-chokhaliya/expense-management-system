import React from 'react';
import { useAuth } from '../hooks/useAuth';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  // Role-based dashboard routing
  if (user.role === 'Admin') return <AdminDashboard />;
  if (user.role === 'Manager') return <ManagerDashboard />;
  return <EmployeeDashboard />;
};

export default Dashboard;
