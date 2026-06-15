import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';
import { toast } from 'react-toastify';

export default function AdminAssign() {
  const [bugs, setBugs]   = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm]   = useState({ bug_id: '', staff_id: '', message: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.getAllBugs().then(r =>
      setBugs(r.data.filter(b => b.status === 'open' || b.status === 'assigned'))
    );
    API.getStaff().then(r => setStaff(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.assignBug({ ...form, assigned_by: user.id });
    if (res.data.success) {
      toast.success('Bug assigned successfully!');
      setForm({ bug_id: '', staff_id: '', message: '' });
    } else toast.error(res.data.message);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="page-body">

          <div className="page-header">
            <h2>Assign Bug to Staff</h2>
          </div>

          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%'
          }}>
            <div className="card p-4" style={{
              width: '100%',
              maxWidth: 680,
              borderRadius: 14
            }}>

              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 28,
                paddingBottom: 18,
                borderBottom: '1px solid #f0f2f5'
              }}>
                <div style={{
                  width: 46, height: 46,
                  background: '#fff0f0',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="ti ti-git-branch"
                    style={{ fontSize: 22, color: '#e63946' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0d1117' }}>
                    Assign a Bug
                  </div>
                  <div style={{ fontSize: 12.5, color: '#8a8fa3', marginTop: 2 }}>
                    Select a ticket and assign it to a staff member
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>

                
                <div className="mb-3">
                  <label className="form-label">
                    Select Bug (Ticket)
                  </label>
                  <select
                    className="form-select"
                    value={form.bug_id}
                    onChange={e => setForm({ ...form, bug_id: e.target.value })}
                    required
                  >
                    <option value="">-- Select a Bug --</option>
                    {bugs.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.ticket_number} — {b.error_category} ({b.project_name})
                      </option>
                    ))}
                  </select>
                </div>

                
                <div className="mb-3">
                  <label className="form-label">
                    Assign to Staff
                  </label>
                  <select
                    className="form-select"
                    value={form.staff_id}
                    onChange={e => setForm({ ...form, staff_id: e.target.value })}
                    required
                  >
                    <option value="">-- Select Staff --</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.username} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                
                <div className="mb-4">
                  <label className="form-label">
                    Message / Instructions
                  </label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Add any notes or instructions for the staff member..."
                  />
                </div>

                <button
                  className="btn btn-danger w-100"
                  style={{ padding: '13px', fontSize: 14, fontWeight: 700 }}
                >
                  <i className="ti ti-send" style={{ marginRight: 8 }} />
                  Assign Bug
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}