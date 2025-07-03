// src/store/slices/gameSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Fetch published games for community
export const fetchPublishedGames = createAsyncThunk(
  'games/fetchPublishedGames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/games');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch games');
    }
  }
);

// Fetch game reviews
export const fetchGameReviews = createAsyncThunk(
  'games/fetchGameReviews',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/games/${gameId}/reviews`);
      return response.data.reviews || [];
    } catch (error) {
      console.error('Fetch reviews error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

// Add game review
export const addGameReview = createAsyncThunk(
  'games/addGameReview',
  async ({ gameId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/games/${gameId}/reviews`, reviewData);
      return response.data.review;
    } catch (error) {
      console.error('Add review error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

// Fetch my games
export const fetchMyGames = createAsyncThunk(
  'games/fetchMyGames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/games/my-games');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch games');
    }
  }
);

// Fetch single game
export const fetchGame = createAsyncThunk(
  'games/fetchGame',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch game');
    }
  }
);

// Delete game
export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (gameId, { rejectWithValue }) => {
    try {
      await api.delete(`/games/${gameId}`);
      return gameId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete game');
    }
  }
);

// Update game visibility
export const updateGameVisibility = createAsyncThunk(
  'games/updateGameVisibility',
  async ({ gameId, visibility }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/games/${gameId}/visibility`, { status: visibility });
      return response.data.game || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update game visibility');
    }
  }
);

// Record play
export const recordPlay = createAsyncThunk(
  'games/recordPlay',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/games/${gameId}/play`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record play');
    }
  }
);

// Toggle like
export const toggleLike = createAsyncThunk(
  'games/toggleLike',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/games/${gameId}/like`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

// Submit game score
export const submitGameScore = createAsyncThunk(
  'games/submitGameScore',
  async ({ gameId, score, gameType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/games/${gameId}/score`, { 
        score, 
        gameType,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit score');
    }
  }
);

// Get leaderboard
export const fetchLeaderboard = createAsyncThunk(
  'games/fetchLeaderboard',
  async ({ gameType = 'all', limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/leaderboard?gameType=${gameType}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

// Update game
export const updateGame = createAsyncThunk(
  'games/updateGame',
  async ({ gameId, gameData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/games/${gameId}`, gameData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update game');
    }
  }
);

const gameSlice = createSlice({
  name: 'games',
  initialState: {
    myGames: [],
    publishedGames: [],
    currentGame: null,
    gameReviews: [],
    leaderboard: [],
    isLoading: false,
    isDeleting: false,
    isUpdatingVisibility: false,
    error: null
  },
  reducers: {
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearGameReviews: (state) => {
      state.gameReviews = [];
    },
    updateCurrentGameScore: (state, action) => {
      if (state.currentGame) {
        state.currentGame.highScore = Math.max(
          state.currentGame.highScore || 0,
          action.payload
        );
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch my games
      .addCase(fetchMyGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGames = action.payload;
      })
      .addCase(fetchMyGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch published games
      .addCase(fetchPublishedGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublishedGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publishedGames = action.payload;
      })
      .addCase(fetchPublishedGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single game
      .addCase(fetchGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete game
      .addCase(deleteGame.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.myGames = state.myGames.filter(game => game._id !== action.payload);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      // Update game visibility
      .addCase(updateGameVisibility.pending, (state) => {
        state.isUpdatingVisibility = true;
        state.error = null;
      })
      .addCase(updateGameVisibility.fulfilled, (state, action) => {
        state.isUpdatingVisibility = false;
        const gameIndex = state.myGames.findIndex(game => game._id === action.payload._id);
        if (gameIndex !== -1) {
          state.myGames[gameIndex] = action.payload;
        }
      })
      .addCase(updateGameVisibility.rejected, (state, action) => {
        state.isUpdatingVisibility = false;
        state.error = action.payload;
      })
      // Fetch game reviews
      .addCase(fetchGameReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGameReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gameReviews = action.payload;
      })
      .addCase(fetchGameReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add game review
      .addCase(addGameReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addGameReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gameReviews.push(action.payload);
      })
      .addCase(addGameReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Submit score
      .addCase(submitGameScore.fulfilled, (state, action) => {
        // Update leaderboard if needed
        if (action.payload.newRecord) {
          state.leaderboard = action.payload.leaderboard || state.leaderboard;
        }
      })
      // Update game
      .addCase(updateGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
        // Update the game in myGames array if it exists
        const gameIndex = state.myGames.findIndex(game => game._id === action.payload._id);
        if (gameIndex !== -1) {
          state.myGames[gameIndex] = action.payload;
        }
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentGame, clearError, clearGameReviews, updateCurrentGameScore } = gameSlice.actions;
export default gameSlice.reducer;