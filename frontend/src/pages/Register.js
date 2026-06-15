import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', email: '', role: 'customer', category: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.auth({ action: 'register', ...form });
      if (res.data.success) {
        toast.success('Registered! Please login.');
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Connection error.');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="text-center">Create Account</h2>
        <p className="subtitle text-center">Register as a Customer</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input className="form-control" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input className="form-control" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input className="form-control" type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn-primary-custom btn" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <div className="text-center mt-3">
          <small>Already have an account? <Link to="/login">Login here</Link></small>
        </div>
      </div>
    </div>
  );
}