import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);
  
  useEffect(() => {
    // Check if user is authenticated and has admin role
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (!token || !userString) {
      // If not authenticated, redirect to sign page
      navigate('/sign');
      return;
    }
    
    try {
      const user = JSON.parse(userString);
      if (user.role !== 'admin') {
        // If authenticated but not admin, redirect to team dashboard
        navigate('/dashboard/main');
        return;
      }
      
      setIsAuthorized(true);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/sign');
    }
  }, [navigate]);

  // Show loading while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  // If authorized, render children
  return isAuthorized ? children : null;
};

export default AdminProtectedRoute;
