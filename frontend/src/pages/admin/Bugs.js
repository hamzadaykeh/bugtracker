import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';
import { toast } from 'react-toastify';

export default function AdminBugs() {
  const [bugs, setBugs]       = useState([]);
  const [selected, setSelected] = useState(null);
  const [flow, setFlow]         = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const load = () => API.getAllBugs().then(r => setBugs(r.data));
  useEffect(() => { load(); }, []);

  const viewFlow = async (bug) => {
    setSelected(bug);
    const res = await API.getBugFlow(bug.id);
    setFlow(res.data);
  };

  const updateStatus = async (bug_id, status) => {
    const res = await API.updateStatus({ bug_id, status, user_id: user.id });
    if (res.data.success) {
      toast.success('Status updated!');
      load();
      if (selected) viewFlow(selected);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="page-body">

          <div className="page-header">
            <h2>All Bug Reports</h2>
            <span style={{
              fontSize: 12, color: '#8a8fa3', fontWeight: 500
            }}>
              {bugs.length} total bugs
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: 20,
            width: '100%',
            alignItems: 'flex-start'
          }}>

            
            <div style={{
              flex: selected ? '0 0 58%' : '0 0 100%',
              width: selected ? '58%' : '100%',
              transition: 'all 0.3s ease',
              minWidth: 0
            }}>
              <div className="data-table" style={{ width: '100%' }}>
                <table className="table table-hover mb-0"
                  style={{ width: '100%', tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '18%' }}>Ticket</th>
                      <th style={{ width: '14%' }}>Project</th>
                      <th style={{ width: '14%' }}>Customer</th>
                      <th style={{ width: '16%' }}>Category</th>
                      <th style={{ width: '11%' }}>Status</th>
                      <th style={{ width: '10%' }}>Due</th>
                      <th style={{ width: '17%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bugs.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{
                          textAlign: 'center',
                          padding: '50px 0',
                          color: '#8a8fa3'
                        }}>
                          <i className="ti ti-bug-off" style={{
                            fontSize: 36,
                            display: 'block',
                            marginBottom: 10
                          }} />
                          No bugs reported yet.
                        </td>
                      </tr>
                    )}
                    {bugs.map(bug => (
                      <tr key={bug.id}
                        style={{
                          cursor: 'pointer',
                          background: selected?.id === bug.id ? '#fef2f2' : ''
                        }}>
                        <td><code>{bug.ticket_number}</code></td>
                        <td style={{ color: '#6b7280' }}>{bug.project_name}</td>
                        <td style={{ color: '#6b7280' }}>{bug.customer_name}</td>
                        <td style={{ color: '#6b7280' }}>{bug.error_category}</td>
                        <td>
                          <span className={`badge-status badge-${bug.status}`}>
                            {bug.status}
                          </span>
                        </td>
                        <td style={{ color: '#8a8fa3', fontSize: 12 }}>
                          {bug.due_date || '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => viewFlow(bug)}
                            >
                              View
                            </button>
                            <select
                              className="form-select form-select-sm"
                              style={{ width: 'auto', fontSize: 11 }}
                              value={bug.status}
                              onChange={e => updateStatus(bug.id, e.target.value)}
                            >
                              {['open','assigned','in_progress','resolved','closed'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            
            {selected && (
              <div style={{
                flex: '0 0 40%',
                width: '40%',
                minWidth: 0,
                animation: 'fadeSlideLeft 0.3s ease both'
              }}>
                <div className="card p-4" style={{ width: '100%', borderRadius: 14 }}>

                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 18,
                    paddingBottom: 14,
                    borderBottom: '1px solid #f0f2f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36,
                        background: '#fff0f0',
                        borderRadius: 9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="ti ti-bug"
                          style={{ fontSize: 18, color: '#e63946' }} />
                      </div>
                      <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                        Bug Details
                      </h5>
                    </div>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => setSelected(null)}
                      style={{ borderRadius: 8, fontWeight: 700 }}
                    >
                      ✕
                    </button>
                  </div>

                 
                  <div style={{
                    background: '#f8f9fc',
                    borderRadius: 10,
                    padding: '12px 14px',
                    marginBottom: 14
                  }}>
                    <div style={{ marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: '#8a8fa3', fontWeight: 600, fontSize: 11 }}>
                        TICKET
                      </span>
                      <br />
                      <code style={{ marginTop: 2, display: 'inline-block' }}>
                        {selected.ticket_number}
                      </code>
                    </div>
                    <div style={{ marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: '#8a8fa3', fontWeight: 600, fontSize: 11 }}>
                        CATEGORY
                      </span>
                      <br />
                      <span style={{ color: '#2d3050', fontWeight: 500 }}>
                        {selected.error_category}
                      </span>
                    </div>
                    <div style={{ fontSize: 13 }}>
                      <span style={{ color: '#8a8fa3', fontWeight: 600, fontSize: 11 }}>
                        DETAILS
                      </span>
                      <br />
                      <span style={{ color: '#2d3050' }}>
                        {selected.error_details}
                      </span>
                    </div>
                  </div>

                  
                  {selected.screenshot && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{
                        fontSize: 11, fontWeight: 600,
                        color: '#8a8fa3', marginBottom: 8
                      }}>
                        SCREENSHOT
                      </div>
                      <img
                        src={`http://localhost/bugtracker/backend/uploads/${selected.screenshot}`}
                        alt="bug screenshot"
                        style={{
                          width: '100%',
                          borderRadius: 10,
                          border: '1px solid #e6e8ef'
                        }}
                      />
                    </div>
                  )}

                  
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    color: '#8a8fa3', marginBottom: 12,
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <i className="ti ti-timeline" style={{ fontSize: 14 }} />
                    CASE FLOW
                  </div>

                  <div className="flow-timeline">
                    {flow.length === 0 && (
                      <div style={{
                        textAlign: 'center',
                        color: '#8a8fa3',
                        padding: '20px 0',
                        fontSize: 13
                      }}>
                        <i className="ti ti-clock" style={{
                          fontSize: 24,
                          display: 'block',
                          marginBottom: 6
                        }} />
                        No flow events yet
                      </div>
                    )}
                    {flow.map(f => (
                      <div className="flow-item" key={f.id}>
                        <h6>{f.action}</h6>
                        <small>
                          {f.performed_by_name} —{' '}
                          {new Date(f.created_at).toLocaleString()}
                        </small>
                        {f.notes && <p>{f.notes}</p>}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}