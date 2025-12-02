import React, { createContext, useState, useContext, useEffect } from 'react';
import { ajaxRequest } from '../utils/ajax';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = () => {
        ajaxRequest('GET', '/api/auth/me', null, (error, data) => {
            if (!error && data.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
    };

    const login = (loginIdentifier, password, rememberMe, callback) => {
        if (typeof rememberMe === 'function') {
            callback = rememberMe;
            rememberMe = false;
        }

        ajaxRequest('POST', '/api/auth/login', { loginIdentifier, password, rememberMe }, (error, data) => {
            if (!error && data.user) {
                setUser(data.user);
                callback(null, data);
            } else {
                let errorMessage = 'Login failed';
                try {
                    if (data) {
                        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                        if (parsed.error) errorMessage = parsed.error;
                    }
                } catch (e) { }
                callback(new Error(errorMessage));
            }
        });
    };

    const register = (userData, callback) => {
        ajaxRequest('POST', '/api/auth/register', userData, (error, data) => {
            if (!error && data.user) {
                setUser(data.user);
                callback(null, data);
            } else {
                let errorMessage = 'Registration failed';
                try {
                    if (data) {
                        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                        if (parsed.error) errorMessage = parsed.error;
                    }
                } catch (e) { }
                callback(new Error(errorMessage));
            }
        });
    };

    const logout = (callback) => {
        ajaxRequest('POST', '/api/auth/logout', null, (error, data) => {
            setUser(null);
            if (callback) callback();
        });
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
