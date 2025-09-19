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

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const employee_id = user?.email?.trim() || 'admin@ayateke.com';

  const getTodayDate = () =>
    new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Kigali' });

  const getCurrentTime = () =>
    new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5);

  const fetchLogs = useCallback(() => {
    setLoading(true);
    setError('');
    axios
      .get(`${API_BASE}/api/attendance/today`, { withCredentials: true })
      .then((res) => {
        setLogs(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance logs.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const handleCheckIn = async () => {
    const payload = {
      employee_id,
      date: getTodayDate(),
      clock_in: getCurrentTime(),
      clock_out: '00:00',
    };

    console.log('📤 Check-in payload:', JSON.stringify(payload, null, 2));

    try {
      await axios.post(`${API_BASE}/api/attendance/checkin`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      fetchLogs();
      triggerSidebarRefresh();
    } catch (err) {
      console.error('Check-in failed:', err.message);
      if (err.response?.data?.error === 'Already checked in today') {
        alert('⚠️ You’ve already checked in today.');
      }
    }
  };

  const handleCheckOut = async () => {
    const payload = {
      employee_id,
      date: getTodayDate(),
      clock_out: getCurrentTime(),
    };

    console.log('📤 Check-out payload:', JSON.stringify(payload, null, 2));

    try {
      await axios.post(`${API_BASE}/api/attendance/checkout`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      fetchLogs();
      triggerSidebarRefresh();
    } catch (err) {
      console.error('Check-out failed:', err.message);
      alert('⚠️ Check-out failed. Make sure you’ve checked in first.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>📋 Today's Attendance</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleCheckIn} style={{ marginRight: '1rem' }}>
          Check In
        </button>
        <button onClick={handleCheckOut}>Check Out</button>
      </div>

      {loading && <p>Loading attendance records...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p>No attendance records found for today.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={th}>Employee</th>
              <th style={th}>Date</th>
              <th style={th}>Clock-in</th>
              <th style={th}>Clock-out</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={td}>{log.employee_id || '—'}</td>
                <td style={td}>{log.date || '—'}</td>
                <td style={td}>{log.clock_in || '—'}</td>
                <td style={td}>{log.clock_out || '—'}</td>
                <td style={td}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor:
                        log.clock_out && log.clock_out !== '00:00'
                          ? '#c6f6d5'
                          : '#fefcbf',
                      color:
                        log.clock_out && log.clock_out !== '00:00'
                          ? '#22543d'
                          : '#744210',
                      fontWeight: 'bold',
                    }}
                  >
                    {log.clock_out && log.clock_out !== '00:00'
                      ? 'Completed'
                      : 'Pending'}
                  </span>
                </td>
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
