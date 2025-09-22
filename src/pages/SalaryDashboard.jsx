import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryDashboard = () => {
  const [salaries, setSalaries] = useState([]);
  const [filters, setFilters] = useState({ employee_id: '', month: '' });
  const [form, setForm] = useState({
    employee_id: '',
    amount: '',
    month: '',
    paid_by: '',
  });

  const fetchSalaries = async () => {
    try {
      const params = {};
      if (filters.employee_id) params.employee_id = filters.employee_id;
      if (filters.month) params.month = filters.month;

      const res = await axios.get('https://ayateke-backend.onrender.com/api/salaries', { params });
      setSalaries(res.data);
    } catch (err) {
      console.error('Error fetching salaries:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://ayateke-backend.onrender.com/api/salaries', form);
      alert('✅ Salary recorded');
      setForm({ employee_id: '', amount: '', month: '', paid_by: '' });
      fetchSalaries();
    } catch (err) {
      console.error('Error submitting salary:', err.message);
      alert('❌ Failed to record salary');
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [filters]);

  return (
    <div className="salary-dashboard">
      <h2>💰 Salary Records</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Employee ID"
          value={filters.employee_id}
          onChange={(e) => setFilters({ ...filters, employee_id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Month (e.g. 2025-09)"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        />
      </div>

      <form onSubmit={handleSubmit} className="salary-form">
        <h3>Add Salary</h3>
        <input
          type="text"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Month (e.g. 2025-09)"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Paid By"
          value={form.paid_by}
          onChange={(e) => setForm({ ...form, paid_by: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <table className="salary-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Amount</th>
            <th>Month</th>
            <th>Status</th>
            <th>Paid By</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((s) => (
            <tr key={s.id}>
              <td>{s.employee_id}</td>
              <td>{s.amount}</td>
              <td>{s.month}</td>
              <td>{s.status}</td>
              <td>{s.paid_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryDashboard;
