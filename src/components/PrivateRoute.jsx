import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    return auth ? children : <Navigate to="/entrar" />;
};

export default PrivateRoute;
