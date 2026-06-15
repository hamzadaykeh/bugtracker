import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';
import { toast } from 'react-toastify';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', email: '', category: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => API.getStaff().then(r => setStaff(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.createStaff(form);
    if (res.data.success) {
      toast.success('Staff created!');
      setForm({ username: '', password: '', email: '', category: '' });
      setShowForm(false);
      load();
    } else toast.error(res.data.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    const res = await API.deleteUser(id);
    if (res.data.success) { toast.success('Deleted!'); load(); }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="page-body">

          <div className="page-header">
            <h2>Staff Management</h2>
            <button className="btn btn-danger"
              onClick={() => setShowForm(!showForm)}>
              + Add Staff
            </button>
          </div>

          {showForm && (
            <div className="card mb-4 p-4" style={{ width: '100%', borderRadius: 12 }}>
              <h5 className="mb-3">New Staff Member</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {[
                    ['Username', 'username', 'text'],
                    ['Password', 'password', 'password'],
                    ['Email',    'email',    'email'],
                    ['Category', 'category', 'text']
                  ].map(([label, key, type]) => (
                    <div className="col-md-3" key={key}>
                      <label className="form-label">{label}</label>
                      <input className="form-control" type={type}
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        required />
                    </div>
                  ))}
                </div>
                <button className="btn btn-danger mt-3">Create Staff</button>
              </form>
            </div>
          )}

          <div className="data-table" style={{ width: '100%' }}>
            <table className="table table-hover mb-0"
              style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>Username</th>
                  <th style={{ width: '30%' }}>Email</th>
                  <th style={{ width: '25%' }}>Category</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{
                      textAlign: 'center', padding: '50px 0', color: '#8a8fa3'
                    }}>
                      <i className="ti ti-users-off" style={{
                        fontSize: 36, display: 'block', marginBottom: 10
                      }} />
                      No staff members yet.
                    </td>
                  </tr>
                )}
                {staff.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: '#8a8fa3', fontWeight: 600 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: '#6366f1', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0
                        }}>
                          {s.username?.[0]?.toUpperCase()}
                        </div>
                        <strong>{s.username}</strong>
                      </div>
                    </td>
                    <td style={{ color: '#6b7280' }}>{s.email}</td>
                    <td>
                      <span style={{
                        background: '#eff6ff', color: '#1d4ed8',
                        padding: '3px 10px', borderRadius: 20,
                        fontSize: 11, fontWeight: 700
                      }}>
                        {s.category}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(s.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}