import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BranchManager = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const res = await axios.get('https://ayateke-backend.onrender.com/api/branches');
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
              <li key={s.id}>{s.role} — {s.name || 'Unassigned'}</li>
            ))}
          </ul>

          <h4>Scheme Managers</h4>
          <ul>
            {branch.schemeManagers.map((m) => (
              <li key={m.id}>{m.name}</li>
            ))}
          </ul>

          <h4>Plumbers</h4>
          <ul>
            {branch.plumbers.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BranchManager;
