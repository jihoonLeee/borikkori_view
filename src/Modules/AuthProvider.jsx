import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const api_url = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_PORT;
    // 컴포넌트가 마운트될 때 사용자의 로그인 상태를 체크
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/users/userInfo', 
                    { withCredentials: true }  // 쿠키를 함께 보내도록 설정
                );
                if (response.status === 200) {
                    setAuthenticated(true);
                }
            } catch (error) {
                setAuthenticated(false);
            }
        };
        checkUserStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
