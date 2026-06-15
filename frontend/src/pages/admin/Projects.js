import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { API } from '../../api';
import { toast } from 'react-toastify';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => API.getProjects().then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.createProject(form);
    if (res.data.success) {
      toast.success('Project created!');
      setForm({ name: '', description: '' });
      setShowForm(false);
      load();
    } else toast.error(res.data.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const res = await API.deleteProject(id);
    if (res.data.success) { toast.success('Deleted!'); load(); }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />

      <div className="main-content">
        <div className="page-body">

          
          <div className="page-header">
            <h2>Projects</h2>
            <button
              className="btn btn-danger"
              onClick={() => setShowForm(!showForm)}
            >
              + Add Project
            </button>
          </div>

          
          {showForm && (
            <div
              className="card mb-4 p-4"
              style={{ width: '100%', borderRadius: 12 }}
            >
              <h5 className="mb-3">New Project</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Project Name</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Description</label>
                    <input
                      className="form-control"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>
                <button className="btn btn-danger mt-3">
                  Create Project
                </button>
              </form>
            </div>
          )}

          
          <div
            className="data-table"
            style={{ width: '100%' }}
          >
            <table
              className="table table-hover mb-0"
              style={{ width: '100%', tableLayout: 'fixed' }}
            >
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>Name</th>
                  <th style={{ width: '45%' }}>Description</th>
                  <th style={{ width: '15%' }}>Created</th>
                  <th style={{ width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: 'center',
                        padding: '50px 0',
                        color: '#8a8fa3'
                      }}
                    >
                      <i
                        className="ti ti-folder-off"
                        style={{
                          fontSize: 36,
                          display: 'block',
                          marginBottom: 10
                        }}
                      />
                      No projects yet — click <strong>+ Add Project</strong> to create one.
                    </td>
                  </tr>
                )}
                {projects.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: '#8a8fa3', fontWeight: 600 }}>
                      {i + 1}
                    </td>
                    <td><strong>{p.name}</strong></td>
                    <td style={{ color: '#6b7280' }}>
                      {p.description || '—'}
                    </td>
                    <td style={{ color: '#8a8fa3' }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
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