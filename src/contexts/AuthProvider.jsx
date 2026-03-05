import React, { createContext, useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/common/Spinner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await axiosInstance.get('/user/userInfo');
                if (response.status === 200) {
                    setUserInfo(response.data);
                    setAuthenticated(true);
                }
            } catch (error) {
                setAuthenticated(false);
            }
        };
        checkUserStatus();
    }, []);

    const contextValue = useMemo(
        () => ({ authenticated, setAuthenticated, userInfo }),
        [authenticated, userInfo]
    );

    if (authenticated === null) {
        return <Spinner />;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
