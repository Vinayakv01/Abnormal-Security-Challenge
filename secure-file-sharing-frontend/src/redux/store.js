import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Example slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Include your reducers here
  },
});

export default store;
