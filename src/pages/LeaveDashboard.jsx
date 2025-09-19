import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
  'https://ayateke-backend.onrender.com';

function LeaveDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/leave`, {
        withCredentials: true,
      });
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ Error fetching leave requests:', err.message);
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/leave/${id}`, { status }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      fetchRequests();
    } catch (err) {
      console.error(`❌ Error updating status to ${status}:`, err.message);
      alert(`Failed to update status to ${status}`);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await axios.delete(`${API_BASE}/api/leave/${id}`, {
        withCredentials: true,
      });
      fetchRequests();
    } catch (err) {
      console.error('❌ Error deleting leave request:', err.message);
      alert('Failed to cancel leave request');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>📋 Leave Requests</h2>

      {loading && <p>Loading leave requests...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p>No leave requests found.</p>
      )}

      {!loading && !error && requests.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={th}>Employee</th>
              <th style={th}>Type</th>
              <th style={th}>Start</th>
              <th style={th}>End</th>
              <th style={th}>Reason</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={td}>{r.employee_id}</td>
                <td style={td}>{r.type}</td>
                <td style={td}>{r.start_date}</td>
                <td style={td}>{r.end_date}</td>
                <td style={td}>{r.reason || '—'}</td>
                <td style={td}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor:
                        r.status === 'approved'
                          ? '#c6f6d5'
                          : r.status === 'rejected'
                          ? '#fed7d7'
                          : '#fefcbf',
                      color:
                        r.status === 'approved'
                          ? '#22543d'
                          : r.status === 'rejected'
                          ? '#742a2a'
                          : '#744210',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td style={td}>
                  {r.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(r.id, 'approved')}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, 'rejected')}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => deleteRequest(r.id)}>Cancel</button>
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

export default LeaveDashboard;
