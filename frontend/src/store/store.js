import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Adjust the path as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
