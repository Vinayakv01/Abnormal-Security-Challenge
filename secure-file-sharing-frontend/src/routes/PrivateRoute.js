import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getStorageItem } from '../utils/storage';

// Function to check if the token is valid
const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decoded.exp > currentTime; // Token is valid if expiry time is in the future
    } catch (error) {
        console.error('Invalid token:', error);
        return false;
    }
};

const PrivateRoute = ({ children }) => {
    const token = getStorageItem('access_token'); // Get token from localStorage

    if (!token || !isTokenValid(token)) {
        // Redirect to login if token is missing or invalid
        return <Navigate to="/login" />;
    }

    // Render children if token is valid
    return children;
};

export default PrivateRoute;
