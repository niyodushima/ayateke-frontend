import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import SalariesDashboard from './pages/SalariesDashboard'; // or './components/SalariesDashboard' if that's where it's saved
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminTrainingDashboard from './pages/AdminTrainingDashboard';
import Attendance from './pages/Attendance';
import StaffDashboard from './pages/StaffDashboard';
import StaffTraining from './components/StaffTraining'; // ✅ moved to pages for consistency
import StaffProfile from './components/StaffProfile';   // ✅ moved to pages for consistency
import Branches from './pages/Branches';
import LeaveRequest from './pages/LeaveRequest';        // ✅ staff leave request
import LeaveDashboard from './pages/LeaveDashboard';    // ✅ admin leave dashboard

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// ✅ Role-based route guard
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/staff'} replace />;
  }

  return children;
};

// ✅ Smart redirect for logged-in users visiting "/"
const SmartRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Login />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/staff'} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route with smart redirect */}
        <Route path="/" element={<SmartRedirect />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="training" element={<AdminTrainingDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="branches" element={<Branches />} />
          <Route path="leave-dashboard" element={<LeaveDashboard />} /> {/* ✅ Leave dashboard */}
        </Route>

        {/* Staff routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute role="staff">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="training" element={<StaffTraining />} />
          <Route path="leave-request" element={<LeaveRequest />} /> {/* ✅ Leave request */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
