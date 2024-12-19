import { setStorageItem, getStorageItem, removeStorageItem } from './storage';
import { API_URL } from './api';

export const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return data;  // Return the data which should contain a message like OTP sent
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      return { error: error.message };  // Return error message
    }
  };
  
  export const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return data;  // Response should include access_token
      } else {
        throw new Error(data.error || "OTP verification failed");
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { error: error.message };  // Return error message
    }
  };
  