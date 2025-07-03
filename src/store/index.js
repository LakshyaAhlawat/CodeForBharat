// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import templateReducer from './slices/templateSlice';
import assetReducer from './slices/assetSlice';
import userReducer from './slices/userSlice'; // Add this if you have userSlice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gameReducer,
    templates: templateReducer,
    assets: assetReducer,
    users: userReducer, // Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export default store;