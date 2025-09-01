import React, { useState } from 'react';

const AttendanceForm = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    date: '',
    clock_in: '',
    clock_out: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 Submitted Attendance:', formData);
    alert('Form submitted! Check the console for data.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>🕒 Submit Attendance</h2>

      <label>Employee ID:</label>
      <input
        type="text"
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        placeholder="Enter Employee ID"
        required
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <label>Date:</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <label>Clock In:</label>
      <input
        type="time"
        name="clock_in"
        value={formData.clock_in}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <label>Clock Out:</label>
      <input
        type="time"
        name="clock_out"
        value={formData.clock_out}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button type="submit" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
        Submit Attendance
      </button>
    </form>
  );
};

export default AttendanceForm;
