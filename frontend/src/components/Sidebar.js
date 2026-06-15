import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const menus = {
  admin: [
    { section: 'Main' },
    { path: '/admin',          label: 'Dashboard',   icon: 'ti-layout-dashboard', exact: true },
    { path: '/admin/staff',    label: 'Staff',        icon: 'ti-users' },
    { path: '/admin/projects', label: 'Projects',     icon: 'ti-folder' },
    { section: 'Bugs' },
    { path: '/admin/bugs',     label: 'All Bugs',     icon: 'ti-bug',         badge: true },
    { path: '/admin/assign',   label: 'Assign',       icon: 'ti-git-branch' },
    { path: '/admin/messages', label: 'Messages',     icon: 'ti-message-2' },
  ],
  staff: [
    { section: 'Overview' },
    { path: '/staff',       label: 'Dashboard', icon: 'ti-layout-dashboard' },
    { section: 'Work' },
    { path: '/staff/bugs',  label: 'My Bugs',   icon: 'ti-bug',         badge: true },
    { path: '/staff/flow',  label: 'Bug Flow',  icon: 'ti-git-branch' },
  ],
  customer: [
    { section: 'Overview' },
    { path: '/customer',       label: 'Dashboard',   icon: 'ti-layout-dashboard' },
    { section: 'Bugs' },
    { path: '/customer/bug',   label: 'Report Bug',  icon: 'ti-bug-off' },
    { path: '/customer/flow',  label: 'Track Bug',   icon: 'ti-timeline' },
  ],
};

const roleAccents = {
  admin:    '#e63946',
  staff:    '#6366f1',
  customer: '#22c55e',
};

export default function Sidebar({ role }) {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const accent    = roleAccents[role] || '#e63946';

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">

      {/* ── Logo ── */}
      <div className="logo">
        <div className="logo-icon-box" style={{ background: accent }}>
          <i className="ti ti-bug" aria-hidden="true" />
        </div>
        <div className="logo-text">
          <h4>BugTracker</h4>
          <p>{role} portal</p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
        {(menus[role] || []).map((item, idx) => {

          if (item.section) {
            return (
              <div key={`sec-${idx}`} className="nav-section-label">
                {item.section}
              </div>
            );
          }

          return (
            <ul key={item.path} style={{ marginBottom: 0 }}>
              <li>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  style={({ isActive }) =>
                    isActive
                      ? { color: accent, background: `${accent}20`, borderColor: `${accent}40` }
                      : {}
                  }
                >
                  <i className={`ti ${item.icon}`} aria-hidden="true" />
                  {item.label}
                  {item.badge && (
                    <span className="nav-badge">new</span>
                  )}
                </NavLink>
              </li>
            </ul>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div
            className="user-avatar"
            style={{ background: accent }}
            aria-label={`${user.username} avatar`}
          >
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div className="user-info-text">
            <div className="u-name">{user.username}</div>
            <div className="u-role">{role}</div>
          </div>
        </div>

        <a href="#logout" className="logout-btn" onClick={handleLogout}>
          <i className="ti ti-logout" aria-hidden="true" />
          Sign out
        </a>
      </div>

    </div>
  );
}