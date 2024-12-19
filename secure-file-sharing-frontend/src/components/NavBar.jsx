import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the JWT token is in localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true); // User is authenticated if a token exists
    }
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage on logout
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    window.location.reload(); // Refresh the page after logout
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md py-4 px-6">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white hover:text-gray-300 transition-all">
          Secure File Sharing
        </Link>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            // If authenticated, show the logout button
            <button 
              onClick={handleLogout} 
              className="bg-red-600 px-6 pt-1.5 pb-2 rounded-full text-lg font-medium hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          ) : (
            // If not authenticated, show the login and register buttons
            <>
              <Link 
                to="/login" 
                className="bg-green-600 px-6 pt-1.5 pb-2 rounded-full text-lg font-medium hover:bg-green-700 transition-all"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 px-6 pt-1.5 pb-2 rounded-full text-lg font-medium hover:bg-blue-700 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
