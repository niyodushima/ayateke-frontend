import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import StaffTraining from './components/StaffTraining'; // ✅ moved to pages for consistency
import StaffProfile from './components/StaffProfile';   // ✅ moved to pages for consistency
import DashboardLayout from './layouts/DashboardLayout';
import AdminTrainingDashboard from './pages/AdminTrainingDashboard';
import attendanceRoutes from './routes/attendance.js';

// ... your other middleware and routes
 
app.use('/api/attendance', attendanceRoutes);

// app.listen(...) or export app – keep your existing setup


// ✅ Role-based route guard
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Not logged in → go to login
  if (!user) return <Navigate to="/" replace />;

  // Wrong role → send to their correct dashboard
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
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
