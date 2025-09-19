import React, { useState } from 'react';
import axios from 'axios';

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
  'https://ayateke-backend.onrender.com';

function LeaveRequest() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const employee_id = user?.email?.trim() || 'admin@ayateke.com';

  const [form, setForm] = useState({
    type: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      employee_id,
      ...form,
    };

    console.log('📤 Submitting leave request:', JSON.stringify(payload, null, 2));

    try {
      const res = await axios.post(`${API_BASE}/api/leave`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setMessage('✅ Leave request submitted successfully');
      setForm({ type: '', start_date: '', end_date: '', reason: '' });
    } catch (err) {
      console.error('❌ Error submitting leave:', err.message);
      setError('Failed to submit leave request');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>📝 Request Leave</h2>

      <form onSubmit={handleSubmit}>
        <div style={field}>
          <label>Leave Type</label>
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select type</option>
            <option value="Sick">Sick</option>
            <option value="Vacation">Vacation</option>
            <option value="Emergency">Emergency</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={field}>
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div style={field}>
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
          />
        </div>

        <div style={field}>
          <label>Reason (optional)</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Submit Request
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

const field = {
  marginBottom: '1rem',
  display: 'flex',
  flexDirection: 'column',
};

export default LeaveRequest;
