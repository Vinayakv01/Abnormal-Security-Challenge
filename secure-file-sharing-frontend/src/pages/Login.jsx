import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'; // Assuming Button component is already available
import { loginUser, verifyOTP } from '../utils/auth'; // Using the auth utility functions

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(Array(6).fill('')); // OTP state as an array of 6 empty strings
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(email, password);

    if (response?.message === 'OTP sent to your registered phone number.') {
      setIsOtpSent(true);
    } else {
      setError(response?.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers for OTP input
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input when a value is entered
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const otpCode = otp.join(''); // Join the OTP array into a string

    const response = await verifyOTP(email, otpCode);

    if (response?.access_token) {
      // Store access token and user data
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user)); // Store user data

      // Auto refresh after successful login
      navigate('/dashboard');
      window.location.reload(); // Refresh the page to ensure the user sees the updated dashboard
    } else {
      setError(response?.error || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-teal-400">
      <form className="bg-white p-10 rounded-lg shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        {/* Login Form (email and password) */}
        {!isOtpSent ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <Button 
              text="Login" 
              className="w-full mt-4 pt-1.5 pb-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300" 
              onClick={handleLogin} 
            />
          </>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-gray-700">Enter OTP</label>
              <div className="flex space-x-2 mt-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    maxLength="1"
                    className="w-12 p-3 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus={index === 0} // Focus on the first input by default
                  />
                ))}
              </div>
            </div>
            <Button 
              text="Verify OTP" 
              className="w-full mt-4 pt-1.5 pb-2 bg-teal-600 text-white font-semibold hover:bg-teal-700 transition duration-300" 
              onClick={handleOtpVerification} 
            />
          </>
        )}

        {/* Error message */}
        {error && <p className="text-red-500 mt-4 text-sm text-center">{error}</p>}

        {/* Forgot Password */}
       
      </form>
    </div>
  );
};

export default Login;
