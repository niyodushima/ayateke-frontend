import React, { useEffect, useState } from 'react';
import axios from 'axios';

const th = { textAlign: 'left', padding: 10, borderBottom: '2px solid #cbd5e0' };
const td = { padding: 10, verticalAlign: 'top' };

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
  'https://ayateke-backend.onrender.com';

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: '1.5rem', border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: '10px 14px', cursor: 'pointer', background: '#f7fafc', fontWeight: 600 }}
      >
        {title} {open ? '▼' : '►'}
      </div>
      {open && <div style={{ padding: 14 }}>{children}</div>}
    </div>
  );
}

function Table({ columns, rows, onDelete, onUpdate }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#edf2f7' }}>
          {columns.map((c) => (
            <th key={c} style={th}>{c}</th>
          ))}
          <th style={th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {(!Array.isArray(rows) || rows.length === 0) && (
          <tr>
            <td colSpan={columns.length + 1} style={td}>No records</td>
          </tr>
        )}
        {(rows || []).map((r) => (
          <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={td}>{r.role}</td>
            <td style={td}>{r.name || '—'}</td>
            <td style={td}>{r.email || '—'}</td>
            <td style={td}>{r.tel || '—'}</td>
            <td style={td}>{r.address || '—'}</td>
            <td style={td}>{r.gender || '—'}</td>
            <td style={td}>
              <button onClick={() => onUpdate(r)} style={{ marginRight: 8 }}>Edit</button>
              <button
                onClick={() => onDelete(r.id)}
                style={{ color: 'white', background: '#e53e3e', border: 'none', padding: '6px 10px', borderRadius: 4 }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AddForm({ branchName, onSubmit }) {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');

  const roleMap = {
    'Head Office': [/* your roles */],
    'Kirehe Branch': [/* your roles */],
    'Gatsibo Branch': [/* your roles */],
    'Mahama Water Treatment Plant': [/* your roles */]
  };

  const normalizedBranch = branchName.trim();
  const availableRoles = roleMap[normalizedBranch] || ['Custom Role'];

  useEffect(() => {
    if (availableRoles.length > 0) {
      setRole(availableRoles[0]);
    }
  }, [availableRoles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) return;
    onSubmit({ role, name, email, tel, address, gender });
    setName('');
    setEmail('');
    setTel('');
    setAddress('');
    setGender('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '10px 0' }}>
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        {availableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: 6 }} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1, padding: 6 }} />
      <input type="text" placeholder="Tel" value={tel} onChange={(e) => setTel(e.target.value)} style={{ flex: 1, padding: 6 }} />
      <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} style={{ flex: 1, padding: 6 }} />
      <select value={gender} onChange={(e) => setGender(e.target.value)} required style={{ flex: 1, padding: 6 }}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/branches`);
      setBranches(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error('Failed to load branches:', err);
      alert('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addEntry = async (branchName, payload) => {
    try {
      const res = await axios.post(`${API_BASE}/api/branches/${encodeURIComponent(branchName)}/roles`, payload);
      const newEntry = res.data?.data;
      setBranches((prev) =>
        prev.map((b) =>
          b.branch === branchName
            ? {
                ...b,
                roles: [newEntry, ...(b.roles || []).filter((r) => r.role !== newEntry.role && r.id !== newEntry.id)]
              }
            : b
        )
      );
    } catch (err) {
      console.error('Add entry failed:', err);
      alert(err.response?.data?.error || 'Add failed');
    }
  };

  const deleteEntry = async (branchName, id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(`${API_BASE}/api/branches/${encodeURIComponent(branchName)}/roles/${id}`);
      await load();
    } catch (err) {
      console.error('Delete entry failed:', err);
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const updateEntry = async (branchName, record) => {
    const newName = window.prompt('Update name:', record.name || '');
    if (newName === null) return;
    try {
      await axios.put(`${API_BASE}/api/branches/${encodeURIComponent(branchName)}/roles/${record.id}`, {
        name: newName,
        role: record.role
      });
      await load();
    } catch (err) {
      console.error('Update entry failed:', err);
      alert(err.response?.data?.error || 'Update failed');
    }
  };

  const filterRows = (rows) => {
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return (rows || []).filter((r) =>
      r.role.toLowerCase().includes(term) ||
      (r.name || '').toLowerCase().includes(term) ||
      (r.email || '').toLowerCase().includes(term) ||
      (r.tel || '').toLowerCase().includes(term) ||
      (r.address || '').toLowerCase().includes(term) ||
      (r.gender || '').toLowerCase().includes(term)
    );
  };

    const filteredBranches = branches.filter((b) =>
    branchFilter === 'All' ? true : b.branch === branchFilter
  );

  if (loading) return <div style={{ padding: 20 }}>Loading branches...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>Ayateke Branches</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name, role, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} style={{ padding: 8 }}>
          <option value="All">All Branches</option>
          {branches.map((b) => (
            <option key={b.branch} value={b.branch}>{b.branch}</option>
          ))}
        </select>
      </div>

      {filteredBranches.map((b) => {
        const unassignedCount = (b.roles || []).filter((r) => !r.name || r.name.trim() === '').length;

        return (
          <Section key={b.branch} title={`${b.branch} Branch`}>
            <p style={{ fontSize: 14, color: '#718096', marginBottom: 8 }}>
              Unassigned roles: <strong>{unassignedCount}</strong>
            </p>
            <AddForm branchName={b.branch} onSubmit={(payload) => addEntry(b.branch, payload)} />
            <Table
              columns={['Role', 'Name', 'Email', 'Tel', 'Address', 'Gender']}
              rows={filterRows(b.roles)}
              onDelete={(id) => deleteEntry(b.branch, id)}
              onUpdate={(record) => updateEntry(b.branch, record)}
            />
          </Section>
        );
      })}
    </div>
  );
}
