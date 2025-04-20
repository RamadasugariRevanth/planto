import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = ({ requiredRole = null }) => {
//   const token = localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   if (requiredRole && user?.role !== requiredRole) {
//     return <Navigate to="/" />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;




const ProtectedRoute = ({ requiredRole = null, children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  if (!token) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  
  return children ? children : <Outlet />;
};

export default ProtectedRoute;

