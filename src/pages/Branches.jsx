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

  const roleMap = {
    'Head Office': [
      'Managing Director',
      'Permanent Secretary',
      'Director of Finance and Administration',
      'Logistician and Store Keeper',
      'Chief Accountant',
      'Human Resource Officer',
      'Internal Auditor',
      'Tax Officer',
      'IT Officer',
      'Chief Driver',
      'Accountant',
      'Electromechanician',
      'Assistant Chief Driver',
      'Driver',
      'Cleaner'
    ],
    'Kirehe Branch': [
      'Branch Manager',
      'Head of Technical Team',
      'Chief Recovery Officer',
      'Field Inspection Officer',
      'Electromechanician',
      'Accountant',
      'Recovery Officer',
      'Store Keeper and Cashier',
      'Scheme Manager & Driver',
      'Scheme Manager',
      'Pump Operator',
      'Plumber & Driver',
      'Plumber',
      'Plumber Assistant',
      'Chlorine Mixer',
      'Driver Vehicle',
      'Driver Moto',
      'Cleaner',
      'Security Guard'
    ],
    'Gatsibo Branch': [
      'Branch Manager',
      'Head of Technical Team',
      'Billing and Recovery Monitor',
      'Scheme Manager & Driver',
      'Scheme Manager',
      'Plumber & Driver',
      'Plumber',
      'Pump Operator',
      'Driver Vehicle',
      'Driver Moto',
      'Security Guard',
      'Cleaner'
    ],
    'Mahama Water Treatment Plant': [
      'Water Treatment Plant Manager',
      'Water Supply Engineer',
      'Accountant',
      'Electromechanician',
      'Water Quality Engineer',
      'Electromechanic Engineer',
      'Assistant Electromechanician',
      'Pump Operator',
      'Driver Vehicle',
      'Laboratory Operator'
    ]
  };

  const availableRoles = roleMap[branchName] || [];

  useEffect(() => {
    setRole(availableRoles[0] || '');
  }, [branchName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) return;
    onSubmit({ role, name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        {availableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
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

  const addEntry = async (branchName, payload) => {
  try {
    const res = await axios.post(`${API_BASE}/api/branches/${encodeURIComponent(branchName)}/roles`, payload);
    const newEntry = res.data?.data;

    // Optimistically update local state
    setBranches((prev) =>
      prev.map((b) =>
        b.branch === branchName
          ? { ...b, roles: [...(b.roles || []), newEntry] }
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
      r.role.toLowerCase().includes(term) || (r.name || '').toLowerCase().includes(term)
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

      {filteredBranches.map((b) => {
        const unassignedCount = (b.roles || []).filter((r) => !r.name || r.name.trim() === '').length;

        return (
          <Section key={b.branch} title={`${b.branch} Branch`}>
            <p style={{ fontSize: 14, color: '#718096', marginBottom: 8 }}>
              Unassigned roles: <strong>{unassignedCount}</strong>
            </p>
            <AddForm branchName={b.branch} onSubmit={(payload) => addEntry(b.branch, payload)} />
            <Table
              columns={['Role', 'Name']}
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

