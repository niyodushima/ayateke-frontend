import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import StaffTraining from './components/StaffTraining';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />
        {/* Admin routes wrapped in layout */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Add more admin subroutes here if needed */}
        </Route>

        {/* Staff routes wrapped in layout */}
        <Route path="/staff" element={<DashboardLayout />}>
          <Route path="training" element={<StaffTraining />} />
          <Route index element={<StaffDashboard />} />
          {/* Add more staff subroutes here if needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
