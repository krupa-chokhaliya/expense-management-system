import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SubmitExpense from './pages/SubmitExpense';
import Approvals from './pages/Approvals';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { token } = useAuth();
  
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f5f5' }}>
      {token && <Navbar />}
      <div className="flex-1 overflow-auto">
        <div className={token ? "p-8 max-w-7xl mx-auto" : ""}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}> 
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/submit" element={<SubmitExpense />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
