import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import EmployeeManager from './pages/EmployeeManager';
import StaffProfile from './pages/StaffProfile';
import StaffDirectory from './pages/StaffDirectory';
import ContractsDashboard from './pages/ContractsDashboard';
import SalariesDashboard from './pages/SalaryDashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminTrainingDashboard from './pages/AdminTrainingDashboard';
import Attendance from './pages/Attendance';
import StaffDashboard from './pages/StaffDashboard';
import StaffTraining from './components/StaffTraining';
import LeaveRequest from './pages/LeaveRequest';
import LeaveDashboard from './pages/LeaveDashboard';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/staff'} replace />;
  }
  return children;
};

const SmartRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Login />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/staff'} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SmartRedirect />} />

        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="training" element={<AdminTrainingDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="employees" element={<EmployeeManager />} />
          <Route path="leave-dashboard" element={<LeaveDashboard />} />
          <Route path="payroll" element={<SalariesDashboard />} />
          <Route path="contracts" element={<ContractsDashboard />} />
          <Route path="staff" element={<StaffDirectory />} />
          <Route path="staff/:id" element={<StaffProfile />} />
        </Route>

        <Route path="/staff" element={
          <ProtectedRoute role="staff">
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="training" element={<StaffTraining />} />
          <Route path="leave-request" element={<LeaveRequest />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
