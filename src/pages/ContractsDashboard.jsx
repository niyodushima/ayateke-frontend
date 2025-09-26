import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContractsDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [filters, setFilters] = useState({ employee_id: '', type: '' });
  const [form, setForm] = useState({
    employee_id: '',
    type: 'permanent',
    start_date: '',
    end_date: '',
    signed_by: '',
    education: '',
  });

  const fetchContracts = async () => {
    try {
      const res = await axios.get('https://ayateke-backend.onrender.com/api/contracts', {
        params: filters,
      });
      setContracts(res.data);
    } catch (err) {
      console.error('Error fetching contracts:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://ayateke-backend.onrender.com/api/contracts', form);
      alert('✅ Contract added');
      setForm({
        employee_id: '',
        type: 'permanent',
        start_date: '',
        end_date: '',
        signed_by: '',
        education: '',
      });
      fetchContracts();
    } catch (err) {
      console.error('Error adding contract:', err.message);
      alert('❌ Failed to add contract');
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [filters]);

  return (
    <div className="contracts-dashboard">
      <h2>📄 Contracts</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Employee ID"
          value={filters.employee_id}
          onChange={(e) => setFilters({ ...filters, employee_id: e.target.value })}
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="permanent">Permanent</option>
          <option value="temporary">Temporary</option>
          <option value="intern">Intern</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="contract-form">
        <h3>Add Contract</h3>
        <input
          type="text"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="permanent">Permanent</option>
          <option value="temporary">Temporary</option>
          <option value="intern">Intern</option>
        </select>
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Signed By"
          value={form.signed_by}
          onChange={(e) => setForm({ ...form, signed_by: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Education Background"
          value={form.education}
          onChange={(e) => setForm({ ...form, education: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>

      <table className="contracts-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Education</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c, index) => (
            <tr key={index}>
              <td>{c.employee_id}</td>
              <td>{c.start_date}</td>
              <td>{c.end_date}</td>
              <td>{c.education}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsDashboard;
