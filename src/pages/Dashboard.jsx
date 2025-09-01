// src/pages/Dashboard.jsx
export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome to AYATEKE</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Today's Attendance</h3>
          <p className="text-3xl mt-2">42</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Pending Leave Requests</h3>
          <p className="text-3xl mt-2">7</p>
        </div>
      </div>
    </div>
  );
}
