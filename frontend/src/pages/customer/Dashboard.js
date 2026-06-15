import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';

export default function CustomerDashboard() {
  const [bugs, setBugs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.getBugsByCustomer(user.id).then(r => setBugs(r.data));
  }, []);

  const stats = [
    {
      label: 'My Bugs',
      value: bugs.length,
      icon: 'ti-bug',
      color: '#e63946',
      bg: '#fff0f0'
    },
    {
      label: 'Open',
      value: bugs.filter(b => b.status === 'open').length,
      icon: 'ti-alert-triangle',
      color: '#d97706',
      bg: '#fef9ee'
    },
    {
      label: 'Resolved',
      value: bugs.filter(b => b.status === 'resolved').length,
      icon: 'ti-circle-check',
      color: '#15803d',
      bg: '#f0fdf4'
    },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="customer" />
      <div className="main-content">
        <div className="page-body">

          
          <div className="page-header">
            <h2>Customer Dashboard</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14
              }}>
                {user.username?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>
                Welcome, <strong style={{ color: '#0d1117' }}>{user.username}</strong>
              </span>
            </div>
          </div>

          
          <div className="row g-3 mb-4">
            {stats.map((s, i) => (
              <div className="col-md-4" key={s.label}
                style={{ animationDelay: `${i * 0.07}s` }}>
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

            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #f0f2f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h5 style={{
                margin: 0,
                fontSize: 13.5,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <i className="ti ti-list" style={{ color: '#8a8fa3' }} />
                My Bug Reports
              </h5>
              <a href="/customer/bug"
                style={{
                  fontSize: 12.5,
                  color: '#e63946',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}>
                <i className="ti ti-plus" style={{ fontSize: 14 }} />
                Report New Bug
              </a>
            </div>

            <table className="table table-hover mb-0"
              style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Ticket</th>
                  <th style={{ width: '20%' }}>Project</th>
                  <th style={{ width: '22%' }}>Category</th>
                  <th style={{ width: '16%' }}>Status</th>
                  <th style={{ width: '20%' }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {bugs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{
                      textAlign: 'center',
                      padding: '60px 0',
                      color: '#8a8fa3'
                    }}>
                      <i className="ti ti-bug-off" style={{
                        fontSize: 40,
                        display: 'block',
                        marginBottom: 12
                      }} />
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        No bugs reported yet
                      </div>
                      <div style={{ fontSize: 12 }}>
                        Click <strong>Report Bug</strong> in the sidebar to submit your first bug
                      </div>
                    </td>
                  </tr>
                )}
                {bugs.map(bug => (
                  <tr key={bug.id}>
                    <td><code>{bug.ticket_number}</code></td>
                    <td style={{ color: '#6b7280' }}>{bug.project_name}</td>
                    <td style={{ color: '#6b7280' }}>{bug.error_category}</td>
                    <td>
                      <span className={`badge-status badge-${bug.status}`}>
                        {bug.status}
                      </span>
                    </td>
                    <td style={{ color: '#8a8fa3', fontSize: 12.5 }}>
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