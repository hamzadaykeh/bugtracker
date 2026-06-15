import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';
import { toast } from 'react-toastify';

export default function CustomerFlow() {
  const [ticket, setTicket] = useState('');
  const [bug, setBug] = useState(null);
  const [flow, setFlow] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!ticket.trim()) return;
    setLoading(true);
    const res = await API.getBugByTicket(ticket.trim());
    if (res.data && res.data.id) {
      setBug(res.data);
      const [f, m] = await Promise.all([API.getBugFlow(res.data.id), API.getMessages(res.data.id)]);
      setFlow(f.data);
      setMessages(m.data);
    } else {
      toast.error('Ticket not found!');
      setBug(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="customer" />
      <div className="main-content">
        <div className="page-header"><h2>Track Bug Status</h2></div>

        <div className="card p-4 mb-4" style={{ borderRadius: 12, maxWidth: 500 }}>
          <label className="form-label fw-semibold">Enter Ticket Number</label>
          <div className="d-flex gap-2">
            <input className="form-control" value={ticket}
              onChange={e => setTicket(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="e.g. TKT-ABC123..." />
            <button className="btn btn-danger" onClick={search} disabled={loading}>
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {bug && (
          <div className="row">
            <div className="col-md-5">
              <div className="card p-4 mb-4" style={{ borderRadius: 12 }}>
                <h5>Bug Information</h5>
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr><td><strong>Ticket</strong></td><td><code>{bug.ticket_number}</code></td></tr>
                    <tr><td><strong>Project</strong></td><td>{bug.project_name}</td></tr>
                    <tr><td><strong>Category</strong></td><td>{bug.error_category}</td></tr>
                    <tr><td><strong>Status</strong></td><td><span className={`badge-status badge-${bug.status}`}>{bug.status}</span></td></tr>
                    <tr><td><strong>Submitted</strong></td><td>{new Date(bug.created_at).toLocaleDateString()}</td></tr>
                    <tr><td><strong>Due Date</strong></td><td>{bug.due_date}</td></tr>
                  </tbody>
                </table>
                <p><strong>Details:</strong> {bug.error_details}</p>
                {bug.screenshot && (
                  <img src={`http://localhost/bugtracker/backend/uploads/${bug.screenshot}`}
                    alt="bug" style={{ maxWidth: '100%', borderRadius: 8 }} />
                )}
              </div>

              <div className="card p-4" style={{ borderRadius: 12 }}>
                <h6>💬 Messages from Support</h6>
                {messages.length === 0
                  ? <p className="text-muted">No messages yet.</p>
                  : messages.map(m => (
                    <div key={m.id} className="p-3 mb-2" style={{ background: '#f8f9fa', borderRadius: 8 }}>
                      <strong>{m.sender_name}:</strong> {m.message}
                      <div><small className="text-muted">{new Date(m.sent_at).toLocaleString()}</small></div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="col-md-7">
              <h5 className="mb-3">📋 Case Flow Timeline</h5>
              <div className="flow-timeline">
                {flow.map(f => (
                  <div className="flow-item" key={f.id}>
                    <h6>{f.action}</h6>
                    <small>{f.performed_by_name} — {new Date(f.created_at).toLocaleString()}</small>
                    {f.notes && <p>{f.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}