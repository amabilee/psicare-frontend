import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const Private = ({ component: Component, ...rest }) => {
    const { auth } = UseAuth();
    
    return (
        <Route
            {...rest}
            render={props =>
                auth.isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/entrar" />
                )
            }
        />
    );
};

export default Private;
