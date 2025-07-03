// src/store/slices/assetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api'; // ✅ Use api instead of axiosInstance


// Async thunks
export const fetchUserAssets = createAsyncThunk(
  'assets/fetchUserAssets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/assets');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const uploadAsset = createAsyncThunk(
  'assets/uploadAsset',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/assets/upload', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAsset = createAsyncThunk(
  'assets/deleteAsset',
  async (assetId, { rejectWithValue }) => {
    try {
      await api.delete(`/assets/${assetId}`);
      return assetId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const assetSlice = createSlice({
  name: 'assets',
  initialState: {
    userAssets: [],
    publicAssets: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAssets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAssets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAssets = action.payload;
      })
      .addCase(fetchUserAssets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadAsset.fulfilled, (state, action) => {
        state.userAssets.push(action.payload);
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.userAssets = state.userAssets.filter(asset => asset._id !== action.payload);
      });
  }
});

export default assetSlice.reducer;