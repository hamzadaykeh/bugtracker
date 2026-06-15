import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';
import { toast } from 'react-toastify';

export default function AdminMessages() {
  const [bugs, setBugs]               = useState([]);
  const [selectedBug, setSelectedBug] = useState('');
  const [messages, setMessages]       = useState([]);
  const [newMsg, setNewMsg]           = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.getAllBugs().then(r => setBugs(r.data));
  }, []);

  const loadMessages = async (bugId) => {
    setSelectedBug(bugId);
    const res = await API.getMessages(bugId);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedBug) return;
    const bug = bugs.find(b => b.id == selectedBug);
    const res = await API.sendMessage({
      bug_id:      selectedBug,
      sender_id:   user.id,
      receiver_id: bug.customer_id,
      message:     newMsg
    });
    if (res.data.success) {
      toast.success('Message sent!');
      setNewMsg('');
      loadMessages(selectedBug);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="page-body">

          <div className="page-header">
            <h2>Messages to Customers</h2>
          </div>

          <div className="row g-4" style={{ width: '100%', margin: 0 }}>

            
            <div className="col-md-4" style={{ paddingLeft: 0 }}>
              <div className="data-table"
                style={{ height: '72vh', overflowY: 'auto', width: '100%' }}>

                <div style={{
                  padding: '13px 16px',
                  borderBottom: '1px solid #f0f2f5',
                  position: 'sticky', top: 0,
                  background: '#fff', zIndex: 1
                }}>
                  <strong style={{ fontSize: 13 }}>Select Bug</strong>
                </div>

                {bugs.length === 0 && (
                  <div style={{
                    padding: 30, textAlign: 'center', color: '#8a8fa3'
                  }}>
                    <i className="ti ti-inbox"
                      style={{ fontSize: 28, display: 'block', marginBottom: 6 }} />
                    No bugs yet
                  </div>
                )}

                {bugs.map(bug => (
                  <div key={bug.id}
                    onClick={() => loadMessages(bug.id)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f5f6fa',
                      cursor: 'pointer',
                      background: selectedBug == bug.id ? '#fef2f2' : '#fff',
                      borderLeft: selectedBug == bug.id
                        ? '3px solid #e63946'
                        : '3px solid transparent',
                      transition: 'all 0.18s'
                    }}>
                    <code style={{ display: 'block', marginBottom: 3 }}>
                      {bug.ticket_number}
                    </code>
                    <small style={{ color: '#8a8fa3' }}>
                      {bug.customer_name} — {bug.error_category}
                    </small>
                    <div style={{ marginTop: 4 }}>
                      <span className={`badge-status badge-${bug.status}`}>
                        {bug.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="col-md-8" style={{ paddingRight: 0 }}>
              {selectedBug ? (
                <div className="chat-box"
                  style={{
                    height: '72vh',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                  }}>

                  <div style={{
                    padding: '13px 18px',
                    borderBottom: '1px solid #f0f2f5',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <i className="ti ti-message-2"
                      style={{ color: '#8a8fa3', fontSize: 16 }} />
                    <strong style={{ fontSize: 13 }}>Conversation</strong>
                  </div>

                  <div className="chat-messages" style={{ flex: 1 }}>
                    {messages.length === 0 && (
                      <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#8a8fa3', paddingTop: 60, textAlign: 'center'
                      }}>
                        <i className="ti ti-message-off"
                          style={{ fontSize: 36, marginBottom: 8 }} />
                        No messages yet. Send the first one!
                      </div>
                    )}
                    {messages.map(m => (
                      <div key={m.id}
                        className={`chat-bubble ${m.sender_id == user.id ? 'sent' : 'received'}`}>
                        <p style={{ margin: 0 }}>{m.message}</p>
                        <div className="meta">
                          {m.sender_name} · {new Date(m.sent_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid #f0f2f5',
                    display: 'flex', gap: 8,
                    background: '#fff'
                  }}>
                    <input className="form-control" value={newMsg}
                      onChange={e => setNewMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message and press Enter..." />
                    <button className="btn btn-danger"
                      onClick={sendMessage}
                      style={{ flexShrink: 0 }}>
                      <i className="ti ti-send" />
                    </button>
                  </div>
                </div>

              ) : (
                <div style={{
                  height: '72vh', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: '#fff', borderRadius: 14,
                  border: '1px solid #e6e8ef', color: '#8a8fa3',
                  width: '100%'
                }}>
                  <i className="ti ti-message-2"
                    style={{ fontSize: 48, marginBottom: 12, opacity: 0.35 }} />
                  <p style={{ fontSize: 14, fontWeight: 500 }}>
                    Select a bug to view messages
                  </p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>
                    Pick a ticket from the left panel
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}