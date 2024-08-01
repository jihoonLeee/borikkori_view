import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/common/Spinner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await axios.post(
                    '/user/userInfo',
                    {},
                    { withCredentials: true }  // 쿠키를 함께 보내도록 설정
                );
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
    if (authenticated === null) {
        return <Spinner />;
    }
    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};