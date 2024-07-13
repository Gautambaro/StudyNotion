import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const OpenRoutes = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  

  if (token === null) {
    return children;
  } else {
    return <Navigate to="/dashboard/my-profile" />;
  }
};

export default OpenRoutes;
