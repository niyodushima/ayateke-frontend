import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StaffProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('info');
  const [contracts, setContracts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://ayateke-backend.onrender.com/api/staff/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err.message);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (!profile) return;

    const fetchContracts = async () => {
      try {
        const res = await axios.get(`https://ayateke-backend.onrender.com/api/contracts?employee_id=${profile.email}`);
        setContracts(res.data);
      } catch (err) {
        console.error('Error fetching contracts:', err.message);
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`https://ayateke-backend.onrender.com/api/attendance?employee_id=${profile.email}`);
        setAttendance(res.data);
      } catch (err) {
        console.error('Error fetching attendance:', err.message);
      }
    };

    const fetchSalaries = async () => {
      try {
        const res = await axios.get(`https://ayateke-backend.onrender.com/api/salaries?employee_id=${profile.email}`);
        setSalaries(res.data);
      } catch (err) {
        console.error('Error fetching salaries:', err.message);
      }
    };

    fetchContracts();
    fetchAttendance();
    fetchSalaries();
  }, [profile]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👤 {profile.name}</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Branch:</strong> {profile.branch}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p><strong>Status:</strong> {profile.status}</p>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => setTab('contracts')}>Contracts</button>
        <button onClick={() => setTab('attendance')}>Attendance</button>
        <button onClick={() => setTab('salaries')}>Salaries</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {tab === 'contracts' && (
          <div>
            <h3>📄 Contracts</h3>
            <ul>
              {contracts.map((c, i) => (
                <li key={i}>
                  {c.type} contract from {c.start_date} to {c.end_date} signed by {c.signed_by}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'attendance' && (
          <div>
            <h3>📅 Attendance</h3>
            <ul>
              {attendance.map((a, i) => (
                <li key={i}>
                  {a.date} — {a.status}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'salaries' && (
          <div>
            <h3>💰 Salaries</h3>
            <ul>
              {salaries.map((s, i) => (
                <li key={i}>
                  {s.month} {s.year}: {s.amount} RWF
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;
