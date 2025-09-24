import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffDirectory = () => {
  const [staff, setStaff] = useState([]);
  const [filters, setFilters] = useState({ branch: '', role: '', status: '' });

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
    <div className="staff-directory">
      <h2>🧑‍💼 Staff Directory</h2>

      <div className="filters">
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

      <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Branch</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.branch}</td>
              <td>{s.role}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffDirectory;
