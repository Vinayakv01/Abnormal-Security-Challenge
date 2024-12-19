import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext'; // Ensure you import AuthProvider
import AdminPanel from '../pages/Admin'; // Import the Admin Panel page
import HomePage from '../pages/Home'; // Import the HomePage
import GuestDashboard from '../pages/GuestDashboard';

const AppRoutes = () => {
    return (
        <AuthProvider>
            <Routes>
                {/* Main Layout with Outlet */}
                <Route path="/" element={<MainLayout />}>
                    {/* HomePage route */}
                    <Route index element={<HomePage />} />  {/* HomePage on / route */}

                    {/* Other routes */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="gdashboard" element={<GuestDashboard />} />

                    {/* Protect Dashboard route with PrivateRoute */}
                    <Route
                        path="dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="admin"
                        element={
                            <PrivateRoute>
                                <AdminPanel />
                            </PrivateRoute>
                        }
                    />
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default AppRoutes;
