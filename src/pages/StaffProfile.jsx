import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StaffProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

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

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="staff-profile">
      <h2>👤 {profile.name}</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Branch:</strong> {profile.branch}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p><strong>Status:</strong> {profile.status}</p>
    </div>
  );
};

export default StaffProfile;
