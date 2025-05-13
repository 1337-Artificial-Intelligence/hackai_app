import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  useEffect(() => {
    // If not authenticated, redirect to sign page
    if (!isAuthenticated()) {
      navigate('/sign');
    }
  }, [navigate]);

  // While initial check happens, could show a loading state
  if (!isAuthenticated()) {
    return <Navigate to="/sign" replace />;
  }

  return children;
};

export default ProtectedRoute;
