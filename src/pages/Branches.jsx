// src/pages/Branches.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

function Table({ columns, rows, onDelete, onUpdate, isStaff }) {
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
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length + 1} style={td}>No records</td>
          </tr>
        )}
        {rows.map((r) => (
          <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            {isStaff ? (
              <>
                <td style={td}>{r.role}</td>
                <td style={td}>{r.name || '—'}</td>
              </>
            ) : (
              <td style={td}>{r.name}</td>
            )}
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

function AddForm({ isStaff, onSubmit }) {
  const [role, setRole] = useState('Branch Manager');
  const [name, setName] = useState('');

  const staffRoles = [
    'Branch Manager',
    'Managing Director',
    'Human Resource',
    'Director Administrative of Finance',
    'Accountant',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(isStaff ? { role, name } : { name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
      {isStaff && (
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {staffRoles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      )}
      <input
        type="text"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ flex: 1, padding: 6 }}
      />
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

  const addEntry = async (branchName, tableName, payload) => {
    try {
      await axios.post(`${API_BASE}/api/branches/${branchName}/${tableName}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      await load();
    } catch (err) {
      console.error('Add entry failed:', err);
      alert(err.response?.data?.error || 'Add failed');
    }
  };

  const deleteEntry = async (branchName, tableName, id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(`${API_BASE}/api/branches/${branchName}/${tableName}/${id}`);
      await load();
    } catch (err) {
      console.error('Delete entry failed:', err);
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const updateEntry = async (branchName, tableName, record) => {
    const newName = window.prompt('Update name:', record.name || '');
    if (newName === null) return;

    const payload = tableName === 'staff'
      ? { name: newName, role: record.role }
      : { name: newName };

    try {
      await axios.put(`${API_BASE}/api/branches/${branchName}/${tableName}/${record.id}`, payload, {
        headers: { 'Content-Type: application/json' },
      });
      await load();
    } catch (err) {
      console.error('Update entry failed:', err);
      alert(err.response?.data?.error || 'Update failed');
    }
  };

  const filterRows = (rows, isStaff) => {
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((r) =>
      isStaff
        ? r.role.toLowerCase().includes(term) || (r.name || '').toLowerCase().includes(term)
        : (r.name || '').toLowerCase().includes(term)
    );
  };

  const filteredBranches = branches.filter((b) =>
    branchFilter === 'All' ? true : b.branch === branchFilter
  );

  if (loading) return <div style={{ padding: 20 }}>Loading branches...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>Ayateke Branches</h2>

      {/* Search and Filter Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name or role..."
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

      {filteredBranches.map((b) => (
        <Section key={b.branch} title={`${b.branch} Branch`}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Staff</h3>
            <AddForm isStaff onSubmit={(payload) => addEntry(b.branch, 'staff', payload)} />
            <Table
              columns={['Role', 'Name']}
              rows={filterRows(b.staff, true)}
              isStaff
              onDelete={(id) => deleteEntry(b.branch, 'staff', id)}
              onUpdate={(record) => updateEntry(b.branch, 'staff', record)}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Scheme Managers</h3>
            <AddForm isStaff={false} onSubmit={(payload) => addEntry(b.branch, 'schemeManagers', payload)} />
            <Table
              columns={['Name']}
              rows={filterRows(b.schemeManagers, false)}
              onDelete={(id) => deleteEntry(b.branch, 'schemeManagers', id)}
              onUpdate={(record) => updateEntry(b.branch, 'schemeManagers', record)}
            />
          </div>

          <div>
            <h3 style={{ marginBottom: 8 }}>Plumbers</h3>
            <AddForm isStaff={false} onSubmit={(payload) => addEntry(b.branch, 'plumbers', payload)} />
                       <Table
              columns={['Name']}
              rows={filterRows(b.plumbers, false)}
              onDelete={(id) => deleteEntry(b.branch, 'plumbers', id)}
              onUpdate={(record) => updateEntry(b.branch, 'plumbers', record)}
            />
          </div>
        </Section>
      ))}
    </div>
  );
}

const th = { textAlign: 'left', padding: 10, borderBottom: '2px solid #cbd5e0' };
const td = { padding: 10, verticalAlign: 'top' };
