import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'https://ayateke-backend.onrender.com';

function Table({ columns, rows, onDelete, onUpdate, onAttachFile }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#edf2f7' }}>
          {columns.map((c) => <th key={c} style={{ textAlign: 'left', padding: 10 }}>{c}</th>)}
          <th style={{ textAlign: 'left', padding: 10 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={columns.length + 1} style={{ padding: 10 }}>No employees found</td></tr>
        ) : rows.map((r) => (
          <React.Fragment key={r.id}>
            <tr>
              <td style={{ padding: 10 }}>{r.name}</td>
              <td style={{ padding: 10 }}>{r.email}</td>
              <td style={{ padding: 10 }}>{r.tel}</td>
              <td style={{ padding: 10 }}>{r.address}</td>
              <td style={{ padding: 10 }}>{r.gender}</td>
              <td style={{ padding: 10 }}>{r.role}</td>
              <td style={{ padding: 10 }}>{r.branch}</td>
              <td style={{ padding: 10 }}>
                <button onClick={() => onUpdate(r)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => onDelete(r.id)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '6px 10px' }}>Delete</button>
                <label style={{ marginLeft: 8 }}>
                  <span style={{ color: '#3182ce', cursor: 'pointer' }}>Attach File</span>
                  <input type="file" hidden onChange={(e) => onAttachFile(e, r)} />
                </label>
              </td>
            </tr>
            {r.documents?.length > 0 && (
              <tr>
                <td colSpan={columns.length + 1} style={{ background: '#f9fafb', padding: 10 }}>
                  <strong>📎 Documents:</strong>
                  <ul>
                    {r.documents.map((doc) => (
                      <li key={doc.id}>{doc.name} ({doc.type}) — {new Date(doc.uploadedAt).toLocaleDateString()}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

function AddForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [branch, setBranch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, tel, address, gender, role, branch });
    setName(''); setEmail(''); setTel(''); setAddress(''); setGender(''); setRole(''); setBranch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={tel} onChange={(e) => setTel(e.target.value)} placeholder="Tel" />
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
      <select value={gender} onChange={(e) => setGender(e.target.value)} required>
        <option value="">Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" required />
      <input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Branch" required />
      <button type="submit">Add Employee</button>
    </form>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const load = async () => {
    const res = await axios.get(`${API_BASE}/api/employees`);
    setEmployees(res.data || []);
  };

  useEffect(() => { load(); }, []);

  const addEmployee = async (payload) => {
    await axios.post(`${API_BASE}/api/employees`, payload);
    await load();
  };

  const updateEmployee = async (record) => {
    const name = window.prompt('Update name:', record.name);
    if (name === null) return;
    const role = window.prompt('Update role:', record.role);
    if (role === null) return;

    try {
      await axios.put(`${API_BASE}/api/employees/${record.id}`, { name, role });
      await load();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed');
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await axios.delete(`${API_BASE}/api/employees/${id}`);
    await load();
  };

  const onAttachFile = async (e, record) => {
    const file = e.target.files[0];
    if (!file) return;
    const name = window.prompt('Document name (e.g. CV, ID):');
    if (!name) return;

    try {
      await axios.post(`${API_BASE}/api/employees/${record.id}/documents`, {
        name,
        type: file.type
      });
      await load();
    } catch (err) {
      console.error('Attach failed:', err);
      alert('Attach failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Ayateke HR — Employee Dashboard</h2>
      <AddForm onSubmit={addEmployee} />
      <Table
        columns={['Name', 'Email', 'Tel', 'Address', 'Gender', 'Role', 'Branch']}
        rows={employees}
        onDelete={deleteEmployee}
        onUpdate={updateEmployee}
        onAttachFile={onAttachFile}
      />
    </div>
  );
}
