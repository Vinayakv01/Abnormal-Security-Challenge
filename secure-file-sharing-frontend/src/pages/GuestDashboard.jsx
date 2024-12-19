import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import Button from '../components/Button'; // Assuming you have a reusable Button component

const GuestDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-teal-600 text-white py-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-semibold">SecureFile</h1>
          <div>
            <Link
              to="/profile"
              className="text-white px-4 hover:text-teal-200"
            >
              Profile
            </Link>
            <Link
              to="/login"
              className="text-white px-4 hover:text-teal-200"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-grow flex justify-center items-center bg-gradient-to-r from-blue-500 to-teal-400 py-16">
        <div className="text-center text-white max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Welcome, Guest!</h2>
          <p className="text-xl mb-6">
            You have limited access to the platform. You can view shared files, but cannot upload or manage them.
          </p>

          {/* Action Button */}
          <div className="mb-6">
            <Button
              text="View Shared Files"
              className="bg-teal-600 text-white py-2 px-6 rounded-md shadow-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
            />
          </div>

          {/* Upgrade Information */}
          <div>
            <p className="text-gray-200 mb-4">Need full access? Please <Link to="/register" className="text-blue-200 hover:text-blue-300">sign up</Link> for an account.</p>
            <p className="text-gray-200">If you want to become an admin or regular user, please request an upgrade from the admin.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
