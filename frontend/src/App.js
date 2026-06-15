import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStaff from './pages/admin/Staff';
import AdminProjects from './pages/admin/Projects';
import AdminBugs from './pages/admin/Bugs';
import AdminAssign from './pages/admin/Assign';
import AdminMessages from './pages/admin/Messages';
import StaffDashboard from './pages/staff/Dashboard';
import StaffBugs from './pages/staff/Bugs';
import StaffFlow from './pages/staff/Flow';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBug from './pages/customer/Bug';
import CustomerFlow from './pages/customer/Flow';

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/staff" element={<ProtectedRoute role="admin"><AdminStaff /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute role="admin"><AdminProjects /></ProtectedRoute>} />
        <Route path="/admin/bugs" element={<ProtectedRoute role="admin"><AdminBugs /></ProtectedRoute>} />
        <Route path="/admin/assign" element={<ProtectedRoute role="admin"><AdminAssign /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />

        
        <Route path="/staff" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/bugs" element={<ProtectedRoute role="staff"><StaffBugs /></ProtectedRoute>} />
        <Route path="/staff/flow" element={<ProtectedRoute role="staff"><StaffFlow /></ProtectedRoute>} />

        
        <Route path="/customer" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/bug" element={<ProtectedRoute role="customer"><CustomerBug /></ProtectedRoute>} />
        <Route path="/customer/flow" element={<ProtectedRoute role="customer"><CustomerFlow /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
