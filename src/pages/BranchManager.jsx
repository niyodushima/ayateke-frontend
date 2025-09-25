import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://ayateke-backend.onrender.com/api/branches';

const BranchManager = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEntries, setNewEntries] = useState({}); // for adding schemeManagers/plumbers

  const fetchBranches = async () => {
    try {
      const res = await axios.get(API);
      setBranches(res.data);
    } catch (err) {
      console.error('Error fetching branches:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleStaffNameChange = async (branchName, staffId, name) => {
    try {
      await axios.put(`${API}/${branchName}/staff/${staffId}`, { name });
      fetchBranches();
    } catch (err) {
      console.error('Error updating staff name:', err.message);
    }
  };

  const handleAddEntry = async (branchName, tableName) => {
    const name = newEntries[`${branchName}-${tableName}`];
    if (!name) return;

    try {
      await axios.post(`${API}/${branchName}/${tableName}`, { name });
      setNewEntries({ ...newEntries, [`${branchName}-${tableName}`]: '' });
      fetchBranches();
    } catch (err) {
      console.error('Error adding entry:', err.message);
    }
  };

  if (loading) return <p>Loading branches...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏢 Branch Manager</h2>
      {branches.map((branch) => (
        <div key={branch.branch} style={{ marginBottom: '2rem' }}>
          <h3>{branch.branch}</h3>

          <h4>Staff</h4>
          <ul>
            {branch.staff.map((s) => (
              <li key={s.id}>
                {s.role} —{' '}
                <input
                  type="text"
                  value={s.name}
                  placeholder="Unassigned"
                  onChange={(e) => handleStaffNameChange(branch.branch, s.id, e.target.value)}
                />
              </li>
            ))}
          </ul>

          <h4>Scheme Managers</h4>
          <ul>
            {branch.schemeManagers.map((m) => (
              <li key={m.id}>{m.name}</li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add scheme manager"
            value={newEntries[`${branch.branch}-schemeManagers`] || ''}
            onChange={(e) =>
              setNewEntries({ ...newEntries, [`${branch.branch}-schemeManagers`]: e.target.value })
            }
          />
          <button onClick={() => handleAddEntry(branch.branch, 'schemeManagers')}>Add</button>

          <h4>Plumbers</h4>
          <ul>
            {branch.plumbers.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add plumber"
            value={newEntries[`${branch.branch}-plumbers`] || ''}
            onChange={(e) =>
              setNewEntries({ ...newEntries, [`${branch.branch}-plumbers`]: e.target.value })
            }
          />
          <button onClick={() => handleAddEntry(branch.branch, 'plumbers')}>Add</button>
        </div>
      ))}
    </div>
  );
};

export default BranchManager;
