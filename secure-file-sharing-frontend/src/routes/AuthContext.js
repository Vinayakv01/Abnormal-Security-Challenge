import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create a Context for Authentication
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token"));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            checkAuth(token);  // Check user details if token exists
        } else {
            setLoading(false);
        }
    }, [token]);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/users/login/", { email, password });
            const { access_token, user } = response.data;
            setToken(access_token);
            setUser(user);
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("user", JSON.stringify(user));

            console.log("Login successful", user); // Success log

        } catch (error) {
            console.error("Login failed:", error.response?.data?.error || error.message);
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate('/login'); // Redirect to login page
    };

    // Check Authentication
    const checkAuth = async (token) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/users/checkauth/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.user);
            console.log("Authentication successful", response.data.user); // Success log

        } catch (error) {
            console.error("Auth check failed:", error);
            logout();  // If check fails, log out the user
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
