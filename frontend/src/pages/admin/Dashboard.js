import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';

export default function AdminDashboard() {
  const [bugs, setBugs] = useState([]);
  const [staff, setStaff] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.getAllBugs().then(r => setBugs(r.data));
    API.getStaff().then(r => setStaff(r.data));
    API.getProjects().then(r => setProjects(r.data));
  }, []);

  const counts = {
    open:     bugs.filter(b => b.status === 'open').length,
    assigned: bugs.filter(b => b.status === 'assigned').length,
    resolved: bugs.filter(b => b.status === 'resolved').length,
  };

  const stats = [
    { label: 'Total Bugs',    value: bugs.length,     icon: 'ti-bug',            color: '#e63946', bg: '#fff0f0' },
    { label: 'Open Bugs',     value: counts.open,     icon: 'ti-alert-triangle', color: '#d97706', bg: '#fef9ee' },
    { label: 'Assigned',      value: counts.assigned, icon: 'ti-git-branch',     color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Resolved',      value: counts.resolved, icon: 'ti-circle-check',   color: '#15803d', bg: '#f0fdf4' },
    { label: 'Staff Members', value: staff.length,    icon: 'ti-users',          color: '#6366f1', bg: '#f5f3ff' },
    { label: 'Projects',      value: projects.length, icon: 'ti-folder',         color: '#0369a1', bg: '#f0f9ff' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="page-body">

          <div className="page-header">
            <h2>Admin Dashboard</h2>
          </div>

          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            {stats.map((s, i) => (
              <div className="col-md-4" key={s.label}
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="card-stat">
                  <div className="icon" style={{ background: s.bg }}>
                    <i className={`ti ${s.icon}`} style={{ color: s.color }} />
                  </div>
                  <div className="info">
                    <h3 style={{ color: s.color }}>{s.value}</h3>
                    <p>{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <div className="data-table" style={{ width: '100%' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f2f5' }}>
              <h5 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>
                Recent Bugs
              </h5>
            </div>
            <table className="table table-hover mb-0"
              style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Project</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bugs.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{
                      textAlign: 'center', padding: '50px 0', color: '#8a8fa3'
                    }}>
                      <i className="ti ti-bug-off" style={{
                        fontSize: 36, display: 'block', marginBottom: 10
                      }} />
                      No bugs reported yet.
                    </td>
                  </tr>
                )}
                {bugs.slice(0, 10).map(bug => (
                  <tr key={bug.id}>
                    <td><code>{bug.ticket_number}</code></td>
                    <td>{bug.project_name}</td>
                    <td>{bug.customer_name}</td>
                    <td>{bug.error_category}</td>
                    <td>
                      <span className={`badge-status badge-${bug.status}`}>
                        {bug.status}
                      </span>
                    </td>
                    <td style={{ color: '#8a8fa3' }}>
                      {new Date(bug.created_at).toLocaleDateString()}
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