import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';

export default function StaffFlow() {
  const [bugs, setBugs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [flow, setFlow] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { API.getBugsByStaff(user.id).then(r => setBugs(r.data)); }, []);

  const viewFlow = async (bug) => {
    setSelected(bug);
    const res = await API.getBugFlow(bug.id);
    setFlow(res.data);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="staff" />
      <div className="main-content">
        <div className="page-header"><h2>Bug Case Flow</h2></div>
        <div className="row">
          <div className="col-md-4">
            {bugs.map(bug => (
              <div key={bug.id} className="card mb-2 p-3" style={{ cursor: 'pointer', borderRadius: 10, border: selected?.id === bug.id ? '2px solid #e94560' : '1px solid #eee' }}
                onClick={() => viewFlow(bug)}>
                <code>{bug.ticket_number}</code>
                <div className="text-muted" style={{ fontSize: 12 }}>{bug.error_category}</div>
                <span className={`badge-status badge-${bug.status}`}>{bug.status}</span>
              </div>
            ))}
          </div>
          <div className="col-md-8">
            {selected ? (
              <>
                <h5 className="mb-3">Flow for <code>{selected.ticket_number}</code></h5>
                <div className="flow-timeline">
                  {flow.map(f => (
                    <div className="flow-item" key={f.id}>
                      <h6>{f.action}</h6>
                      <small>By: {f.performed_by_name} — {new Date(f.created_at).toLocaleString()}</small>
                      {f.notes && <p>{f.notes}</p>}
                    </div>
                  ))}
                </div>
              </>
            ) : <div className="text-center text-muted mt-5">Select a bug to view its flow</div>}
          </div>
        </div>
      </div>
    </div>
  );
}