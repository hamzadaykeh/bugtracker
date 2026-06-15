import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';

export default function StaffDashboard() {
  const [bugs, setBugs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.getBugsByStaff(user.id).then(r => setBugs(r.data));
  }, []);

  const stats = [
    {
      label: 'Assigned to Me',
      value: bugs.length,
      icon: 'ti-git-branch',
      color: '#1d4ed8',
      bg: '#eff6ff'
    },
    {
      label: 'In Progress',
      value: bugs.filter(b => b.status === 'in_progress').length,
      icon: 'ti-settings',
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
      <Sidebar role="staff" />
      <div className="main-content">
        <div className="page-body">

          
          <div className="page-header">
            <h2>Staff Dashboard</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#6366f1',
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
                My Assigned Bugs
              </h5>
              <span style={{
                fontSize: 12,
                color: '#8a8fa3',
                fontWeight: 500
              }}>
                {bugs.length} total
              </span>
            </div>

            <table
              className="table table-hover mb-0"
              style={{ width: '100%', tableLayout: 'fixed' }}
            >
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Ticket</th>
                  <th style={{ width: '20%' }}>Project</th>
                  <th style={{ width: '22%' }}>Category</th>
                  <th style={{ width: '18%' }}>Status</th>
                  <th style={{ width: '15%' }}>Due Date</th>
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
                        No bugs assigned yet
                      </div>
                      <div style={{ fontSize: 12 }}>
                        The admin will assign bugs to you soon
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
                      {bug.due_date || '—'}
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