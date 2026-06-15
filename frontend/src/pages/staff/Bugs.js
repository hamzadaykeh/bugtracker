import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';
import { toast } from 'react-toastify';

export default function StaffBugs() {
  const [bugs, setBugs]               = useState([]);
  const [staff, setStaff]             = useState([]);
  const [selected, setSelected]       = useState(null);
  const [messages, setMessages]       = useState([]);
  const [newMsg, setNewMsg]           = useState('');
  const [reassignStaff, setReassignStaff] = useState('');
  const [reassignMsg, setReassignMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const load = () => API.getBugsByStaff(user.id).then(r => setBugs(r.data));

  useEffect(() => {
    load();
    API.getStaff().then(r => setStaff(r.data.filter(s => s.id != user.id)));
  }, []);

  const selectBug = async (bug) => {
    setSelected(bug);
    const res = await API.getMessages(bug.id);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const res = await API.sendMessage({
      bug_id:      selected.id,
      sender_id:   user.id,
      receiver_id: selected.customer_id,
      message:     newMsg
    });
    if (res.data.success) {
      toast.success('Message sent!');
      setNewMsg('');
      selectBug(selected);
    }
  };

  const updateStatus = async (status) => {
    const res = await API.updateStatus({
      bug_id:  selected.id,
      status,
      user_id: user.id
    });
    if (res.data.success) {
      toast.success('Status updated!');
      load();
    }
  };

  const reassign = async () => {
    if (!reassignStaff) return;
    const res = await API.assignBug({
      bug_id:      selected.id,
      staff_id:    reassignStaff,
      assigned_by: user.id,
      message:     reassignMsg
    });
    if (res.data.success) {
      toast.success('Reassigned!');
      setReassignStaff('');
      setReassignMsg('');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="staff" />
      <div className="main-content">
        <div className="page-body">

          <div className="page-header">
            <h2>My Assigned Bugs</h2>
            <span style={{ fontSize: 12, color: '#8a8fa3', fontWeight: 500 }}>
              {bugs.length} total
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: 20,
            width: '100%',
            alignItems: 'flex-start'
          }}>

            
            <div style={{
              flex: selected ? '0 0 45%' : '0 0 100%',
              width: selected ? '45%' : '100%',
              transition: 'all 0.3s ease',
              minWidth: 0
            }}>
              <div className="data-table" style={{ width: '100%' }}>
                <table
                  className="table table-hover mb-0"
                  style={{ width: '100%', tableLayout: 'fixed' }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: '28%' }}>Ticket</th>
                      <th style={{ width: '20%' }}>Project</th>
                      <th style={{ width: '20%' }}>Category</th>
                      <th style={{ width: '18%' }}>Status</th>
                      <th style={{ width: '14%' }}>Action</th>
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
                      <tr key={bug.id} style={{
                        background: selected?.id === bug.id ? '#fef2f2' : ''
                      }}>
                        <td><code>{bug.ticket_number}</code></td>
                        <td style={{ color: '#6b7280' }}>{bug.project_name}</td>
                        <td style={{ color: '#6b7280' }}>{bug.error_category}</td>
                        <td>
                          <span className={`badge-status badge-${bug.status}`}>
                            {bug.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => selectBug(bug)}
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            
            {selected && (
              <div style={{
                flex: '0 0 53%',
                width: '53%',
                minWidth: 0,
                animation: 'fadeSlideUp 0.3s ease both'
              }}>
                <div className="card p-4" style={{ width: '100%', borderRadius: 14 }}>

                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
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
                      <div>
                        <code style={{ fontSize: 12 }}>{selected.ticket_number}</code>
                        <div style={{ fontSize: 11, color: '#8a8fa3', marginTop: 1 }}>
                          {selected.error_category}
                        </div>
                      </div>
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
                    marginBottom: 14,
                    fontSize: 13,
                    color: '#2d3050',
                    lineHeight: 1.6
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700,
                      color: '#8a8fa3', marginBottom: 5,
                      letterSpacing: '0.8px'
                    }}>
                      DETAILS
                    </div>
                    {selected.error_details}
                  </div>

                 
                  {selected.screenshot && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700,
                        color: '#8a8fa3', marginBottom: 8,
                        letterSpacing: '0.8px'
                      }}>
                        SCREENSHOT
                      </div>
                      <img
                        src={`http://localhost/bugtracker/backend/uploads/${selected.screenshot}`}
                        alt="bug"
                        style={{
                          width: '100%', borderRadius: 10,
                          border: '1px solid #e6e8ef'
                        }}
                      />
                    </div>
                  )}

                  
                  <div style={{
                    display: 'flex', gap: 8, marginBottom: 16
                  }}>
                    {['in_progress', 'resolved'].map(s => (
                      <button
                        key={s}
                        className="btn btn-sm btn-outline-success"
                        onClick={() => updateStatus(s)}
                        style={{ flex: 1 }}
                      >
                        <i className="ti ti-check" style={{ marginRight: 4 }} />
                        Mark as {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  
                  <div style={{
                    borderTop: '1px solid #f0f2f5',
                    paddingTop: 14,
                    marginBottom: 14
                  }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      color: '#0d1117', marginBottom: 10,
                      display: 'flex', alignItems: 'center', gap: 6
                    }}>
                      <i className="ti ti-message-2"
                        style={{ color: '#8a8fa3', fontSize: 15 }} />
                      Message Customer
                    </div>

                    <div style={{
                      height: 180,
                      background: '#f6f7fb',
                      borderRadius: 10,
                      padding: 12,
                      overflowY: 'auto',
                      marginBottom: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}>
                      {messages.length === 0 && (
                        <div style={{
                          flex: 1, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: '#8a8fa3', fontSize: 12
                        }}>
                          No messages yet
                        </div>
                      )}
                      {messages.map(m => (
                        <div key={m.id}
                          className={`chat-bubble ${m.sender_id == user.id ? 'sent' : 'received'}`}>
                          <p style={{ margin: 0 }}>{m.message}</p>
                          <div className="meta">{m.sender_name}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="form-control"
                        value={newMsg}
                        onChange={e => setNewMsg(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Type solution message..."
                        style={{ fontSize: 13 }}
                      />
                      <button
                        className="btn btn-danger"
                        onClick={sendMessage}
                        style={{ flexShrink: 0 }}
                      >
                        <i className="ti ti-send" />
                      </button>
                    </div>
                  </div>

                  
                  <div style={{
                    borderTop: '1px solid #f0f2f5',
                    paddingTop: 14
                  }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      color: '#0d1117', marginBottom: 10,
                      display: 'flex', alignItems: 'center', gap: 6
                    }}>
                      <i className="ti ti-git-branch"
                        style={{ color: '#8a8fa3', fontSize: 15 }} />
                      Reassign to Another Staff
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <select
                        className="form-select"
                        style={{ fontSize: 13 }}
                        value={reassignStaff}
                        onChange={e => setReassignStaff(e.target.value)}
                      >
                        <option value="">-- Select Staff --</option>
                        {staff.map(s => (
                          <option key={s.id} value={s.id}>{s.username}</option>
                        ))}
                      </select>
                      <input
                        className="form-control"
                        style={{ fontSize: 13 }}
                        value={reassignMsg}
                        onChange={e => setReassignMsg(e.target.value)}
                        placeholder="Note..."
                      />
                      <button
                        className="btn btn-danger"
                        onClick={reassign}
                        style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                      >
                        <i className="ti ti-send" /> Go
                      </button>
                    </div>
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