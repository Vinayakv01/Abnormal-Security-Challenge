import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import Button from '../components/Button'; // Assuming you have a reusable Button component

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="text-center text-white py-20 px-6 max-w-lg mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-100 mb-6">Welcome to SecureFile</h1>
        <p className="text-lg text-gray-200 mb-8">
          The most secure way to share your files, with AES encryption and role-based access controls to ensure your data stays safe.
        </p>

        <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-6">
          {/* Login Button */}
          <Link to="/login">
            <Button
              text="Login"
              className="bg-blue-600 text-white py-3 px-8 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
            />
          </Link>
          
          {/* Sign Up Button */}
          <Link to="/register">
            <Button
              text="Sign Up"
              className="bg-teal-600 text-white py-3 px-8 rounded-md shadow-lg hover:bg-teal-700 transition duration-300"
            />
          </Link>
        </div>

        {/* Guest Dashboard Button */}
        <div className="mt-8">
          <Link
            to="/gdashboard"
            className="block bg-gray-800 text-white py-3 px-8 rounded-md shadow-md hover:bg-gray-700 transition duration-300 text-lg"
          >
            Visit Guest Dashboard
          </Link>
        </div>

        {/* Optional secondary call to action */}
        <div className="mt-4 text-sm text-gray-300">
          <p>Already have an account? <Link to="/login" className="text-white hover:text-blue-300">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
