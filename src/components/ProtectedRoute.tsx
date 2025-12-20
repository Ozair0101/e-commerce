import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [verifying, setVerifying] = useState(false);

  // Verify user with server if we have a stored user but haven't verified yet
  useEffect(() => {
    const verifyUser = async () => {
      if (!user && !loading) {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          setVerifying(true);
          try {
            // Verify with server
            const response = await api.get('/user');
            // If verification succeeds, we're good
            // The AuthProvider will handle updating the user state
          } catch (error) {
            // If verification fails, clear stored user
            sessionStorage.removeItem('user');
          } finally {
            setVerifying(false);
          }
        }
      }
    };

    verifyUser();
  }, [user, loading]);

  // Show loading state while checking authentication
  if (loading || verifying) {
    // Check if user is stored in sessionStorage as a fallback
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      // If we have a stored user, we can render the children while we verify with the server
      // This prevents the flicker to login page on refresh
      try {
        const parsedUser = JSON.parse(storedUser);
        // If admin role is required, check if user is admin
        if (requireAdmin && parsedUser.role !== 'admin') {
          return <Navigate to="/" replace />;
        }
        return <>{children}</>;
      } catch (e) {
        // If parsing fails, continue with normal loading
      }
    }
    
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin route is required, check if user is admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;