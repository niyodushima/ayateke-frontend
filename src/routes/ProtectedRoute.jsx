import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userRole = storedUser?.role;

  // If no user or role, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is defined and userRole is not included, redirect
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
