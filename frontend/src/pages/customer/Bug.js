import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';
import { toast } from 'react-toastify';

export default function CustomerBug() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    project_id: '',
    error_category: '',
    error_details: '',
    due_date: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.getProjects().then(r => setProjects(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let screenshotPath = '';

    if (file) {
      const fd = new FormData();
      fd.append('screenshot', file);
      const up = await API.uploadScreenshot(fd);
      if (up.data.success) screenshotPath = up.data.filename;
    }

    const res = await API.createBug({
      ...form,
      customer_id: user.id,
      screenshot: screenshotPath
    });

    if (res.data.success) {
      toast.success('Bug reported successfully!');
      setTicket(res.data.ticket_number);
      setForm({ project_id: '', error_category: '', error_details: '', due_date: '' });
      setFile(null);
    } else {
      toast.error(res.data.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="customer" />
      <div className="main-content">
        <div className="page-body">

          
          <div className="page-header">
            <h2>Report a Bug</h2>
          </div>

          
          {ticket && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '18px 22px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              animation: 'fadeSlideUp 0.4s ease both'
            }}>
              <div style={{
                width: 42, height: 42,
                background: '#dcfce7',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <i className="ti ti-circle-check"
                  style={{ fontSize: 22, color: '#15803d' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#15803d', fontSize: 14 }}>
                  Bug Reported Successfully!
                </div>
                <div style={{ fontSize: 13, color: '#166534', marginTop: 3 }}>
                  Your ticket number is:{' '}
                  <code style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontWeight: 700
                  }}>
                    {ticket}
                  </code>
                  {' '}— Save this to track your bug status.
                </div>
              </div>
            </div>
          )}

          
          <div className="card p-4" style={{ width: '100%', borderRadius: 14 }}>

            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 24,
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
                <i className="ti ti-bug"
                  style={{ fontSize: 22, color: '#e63946' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0d1117' }}>
                  Submit a Bug Report
                </div>
                <div style={{ fontSize: 12.5, color: '#8a8fa3', marginTop: 2 }}>
                  Fill in the details below and we'll get back to you
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                
                <div className="col-md-6">
                  <label className="form-label">
                    <i className="ti ti-folder"
                      style={{ marginRight: 5, verticalAlign: -2 }} />
                    Project
                  </label>
                  <select
                    className="form-select"
                    value={form.project_id}
                    onChange={e => setForm({ ...form, project_id: e.target.value })}
                    required
                  >
                    <option value="">-- Select Project --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                
                <div className="col-md-6">
                  <label className="form-label">
                    <i className="ti ti-tag"
                      style={{ marginRight: 5, verticalAlign: -2 }} />
                    Error Category
                  </label>
                  <select
                    className="form-select"
                    value={form.error_category}
                    onChange={e => setForm({ ...form, error_category: e.target.value })}
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {[
                      'UI/UX Bug',
                      'Functional Bug',
                      'Performance Issue',
                      'Security Issue',
                      'Data Issue',
                      'Integration Error',
                      'Other'
                    ].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                
                <div className="col-12">
                  <label className="form-label">
                    <i className="ti ti-notes"
                      style={{ marginRight: 5, verticalAlign: -2 }} />
                    Error Details
                  </label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={form.error_details}
                    onChange={e => setForm({ ...form, error_details: e.target.value })}
                    placeholder="Describe the bug in detail — what happened, what you expected, and steps to reproduce..."
                    required
                  />
                </div>

                
                <div className="col-md-6">
                  <label className="form-label">
                    <i className="ti ti-photo"
                      style={{ marginRight: 5, verticalAlign: -2 }} />
                    Screenshot
                    <span style={{
                      fontSize: 11,
                      color: '#8a8fa3',
                      fontWeight: 400,
                      marginLeft: 5
                    }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                  />
                  {file && (
                    <div style={{
                      fontSize: 12,
                      color: '#15803d',
                      marginTop: 5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <i className="ti ti-check" />
                      {file.name}
                    </div>
                  )}
                </div>

                
                <div className="col-md-6">
                  <label className="form-label">
                    <i className="ti ti-calendar"
                      style={{ marginRight: 5, verticalAlign: -2 }} />
                    Expected Reply Date
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    value={form.due_date}
                    onChange={e => setForm({ ...form, due_date: e.target.value })}
                  />
                </div>

              </div>

              
              <button
                className="btn btn-danger mt-4 w-100"
                type="submit"
                disabled={loading}
                style={{ padding: '13px', fontSize: 14, fontWeight: 700 }}
              >
                {loading ? (
                  <>
                    <i className="ti ti-loader"
                      style={{
                        marginRight: 8,
                        animation: 'spinSlow 1s linear infinite'
                      }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="ti ti-send" style={{ marginRight: 8 }} />
                    Submit Bug Report
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}