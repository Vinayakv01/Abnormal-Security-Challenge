import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import the required styles

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    role: "user", // Default role is 'user'
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle phone number change
  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone_number: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register/", // API endpoint for user registration
        formData
      );
      console.log(response.data); // Handle success response
      navigate("/login"); // Redirect to login page on successful registration
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data); // Display errors from the backend
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <PhoneInput
              international
              defaultCountry="US"
              value={formData.phone_number}
              onChange={handlePhoneChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Error Message */}
          {errors.detail && (
            <div className="text-red-600 text-sm mt-2">{errors.detail}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full pt-2.5 pb-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserRegistration;
