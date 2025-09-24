import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StaffDirectory = () => {
  const [staff, setStaff] = useState([]);
  const [filters, setFilters] = useState({
    branch: '',
    role: '',
    status: '',
  });

  const fetchStaff = async () => {
    try {
      const res = await axios.get('https://ayateke-backend.onrender.com/api/staff', {
        params: filters,
      });
      setStaff(res.data);
    } catch (err) {
      console.error('Error fetching staff:', err.message);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [filters]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>🧑‍💼 Staff Directory</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Filter by Branch"
          value={filters.branch}
          onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Role"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Status"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Name</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Email</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Branch</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Role</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                <Link to={`/admin/staff/${s.id}`} style={{ color: 'teal', textDecoration: 'underline' }}>
                  {s.name}
                </Link>
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{s.email}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{s.branch}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{s.role}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffDirectory;
