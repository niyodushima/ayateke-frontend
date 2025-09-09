import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://ayateke-backend.onrender.com/';

function Attendance() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = () => {
      axios.get(`${BASE_URL}/api/attendance/today`)
        .then(res => {
          setLogs(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching attendance:', err);
          setError('Failed to load attendance logs.');
          setLoading(false);
        });
    };

    fetchLogs();

    const interval = setInterval(fetchLogs, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>📋 Today's Attendance</h2>

      {loading && <p>Loading attendance records...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p>No attendance records found for today.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Check-in</th>
              <th style={th}>Check-out</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={td}>{log.name || '—'}</td>
                <td style={td}>{log.email}</td>
                <td style={td}>{log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : '—'}</td>
                <td style={td}>{log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : '—'}</td>
                <td style={td}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: log.status === 'Completed' ? '#c6f6d5' : '#fefcbf',
                    color: log.status === 'Completed' ? '#22543d' : '#744210',
                    fontWeight: 'bold'
                  }}>
                    {log.status}
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
  borderBottom: '2px solid #ccc'
};

const td = {
  padding: '10px',
  verticalAlign: 'top'
};

export default Attendance;
