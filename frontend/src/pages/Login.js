import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.auth({ action: 'login', ...form });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Login successful!');
        navigate(`/${res.data.user.role}`);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Connection error. Make sure XAMPP is running.');
    }
    setLoading(false);
  };

  return (
  <div className="login-page">
    <div className="login-bg-grid" />
    <div className="login-bg-orb login-bg-orb-1" />
    <div className="login-bg-orb login-bg-orb-2" />
    <div className="login-bg-ring" />

    <div className="login-card">
      <div className="login-logo-row">
        <div className="login-icon-box">
          <i className="ti ti-bug" aria-hidden="true" />
        </div>
        <div className="login-brand">
          <h2>BugTracker</h2>
          <p>Sign in to your workspace</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            <i className="ti ti-user" style={{ marginRight: 5, verticalAlign: -2 }} />
            Username
          </label>
          <input
            className="form-control"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">
            <i className="ti ti-lock" style={{ marginRight: 5, verticalAlign: -2 }} />
            Password
          </label>
          <input
            className="form-control"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            required
          />
        </div>
        <button className="btn-primary-custom" type="submit" disabled={loading}>
          {loading
            ? <><i className="ti ti-loader" style={{ animation: 'spinSlow 1s linear infinite' }} /> Signing in...</>
            : <><i className="ti ti-login" /> Sign In</>
          }
        </button>
      </form>

        <hr />
        <div className="text-center" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          New customer?{' '}
          <a href="/register">Create account</a>
        </div>
        <div className="login-hint">
          Default admin — <code>admin</code> / <code>password</code>
        </div>
      </div>
    </div>
  );
}