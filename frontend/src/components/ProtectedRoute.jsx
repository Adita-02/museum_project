// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  console.log('🔒 ProtectedRoute check:', {
    user: user?.name,
    role: user?.role,
    userRole: userRole,
    loading,
    hasToken: !!token,
    allowedRoles
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-[#e6c364] text-xl">Loading...</div>
      </div>
    );
  }

  if (!token || !user) {
    console.log('❌ No token or user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`❌ User role "${user.role}" not allowed. Required:`, allowedRoles);
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted for:', user.role);
  return <Outlet />;
}