import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { triggerSidebarRefresh } from '../components/Sidebar';

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
  'https://ayateke-backend.onrender.com';

function Attendance() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function getTodayDate() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Kigali' }); // YYYY-MM-DD
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5); // HH:MM
  }

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/attendance`, {
        params: {
          date: selectedDate,
          employee_id: searchTerm || undefined,
        },
        withCredentials: true,
      });
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance logs.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, searchTerm]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const handleCheckIn = async () => {
    const today = getTodayDate();
    const clockInTime = getCurrentTime();
    const employeeId = user.email || 'unknown@user';

    try {
      await axios.post(
        `${API_BASE}/api/attendance`,
        {
          employee_id: employeeId,
          date: today,
          clock_in: clockInTime,
          clock_out: '00:00',
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      await fetchLogs();
      triggerSidebarRefresh();
    } catch (err) {
      console.error('Check-in failed:', err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          'Check-in failed'
      );
    }
  };

  const handleCheckOut = async () => {
    const today = getTodayDate();
    const clockOutTime = getCurrentTime();
    const employeeId = user.email || 'unknown@user';

    try {
      await axios.put(
        `${API_BASE}/api/attendance/checkout`,
        {
          employee_id: employeeId,
          date: today,
          clock_out: clockOutTime,
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      await fetchLogs();
      triggerSidebarRefresh();
    } catch (err) {
      console.error('Check-out failed:', err);
      alert(err.response?.data?.error || 'Check-out failed');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>📋 Attendance Logs</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Search by employee ID/email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', flex: '1' }}
        />
        <button onClick={fetchLogs} style={{ padding: '0.5rem 1rem' }}>Fetch</button>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={handleCheckIn} style={{ padding: '0.5rem 1rem' }}>
          Check In
        </button>
        <button onClick={handleCheckOut} style={{ padding: '0.5rem 1rem' }}>
          Check Out
        </button>
      </div>

      {loading && <p>Loading attendance records...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && Array.isArray(logs) && logs.length === 0 && (
        <p>No attendance records found for selected filters.</p>
      )}

      {!loading && !error && Array.isArray(logs) && logs.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={th}>Employee</th>
              <th style={th}>Date</th>
              <th style={th}>Clock-in</th>
              <th style={th}>Clock-out</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={td}>{log.employee_id || log.email || '—'}</td>
                <td style={td}>{log.date || '—'}</td>
                <td style={td}>{log.clock_in || log.checkIn || '—'}</td>
                <td style={td}>{log.clock_out || log.checkOut || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  textAlign: 'left',
  padding: '10px',
  borderBottom: '2px solid #ccc',
};

const td = {
  padding: '10px',
  verticalAlign: 'top',
};

export default Attendance;
