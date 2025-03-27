import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ProtectedRoute component that checks for both authentication and role
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get user from AuthContext
  const { user } = useAuth();

  // If there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user's role is not in the allowed roles, redirect to unauthorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
