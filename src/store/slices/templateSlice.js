// src/store/slices/templateSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Fetch template by ID
export const fetchTemplateById = createAsyncThunk(
  'templates/fetchTemplateById',
  async (templateId, { rejectWithValue }) => {
    try {
      // Since we're using default templates, we'll return the template from our local data
      const defaultTemplates = [
        {
          id: 'platformer',
          name: 'platformer',
          type: 'platformer',
          displayName: 'Platformer Game',
          description: 'Classic side-scrolling platformer with jumping mechanics',
          difficulty: 'Medium',
          controls: 'Arrow Keys / WASD',
          genre: 'Platformer',
          defaultConfig: {
            width: 800,
            height: 600,
            player: { speed: 160, jumpForce: 500, color: '#00ff00' },
            world: { gravity: 300, background: '#87CEEB' }
          }
        },
        {
          id: 'runner',
          name: 'runner',
          type: 'runner',
          displayName: 'Endless Runner',
          description: 'Fast-paced endless running game with obstacles',
          difficulty: 'Easy',
          controls: 'Space / Click',
          genre: 'Runner',
          defaultConfig: {
            width: 800,
            height: 600,
            player: { speed: 200, jumpForce: 400, color: '#ff6b6b' },
            world: { gravity: 400, background: '#ffd93d' }
          }
        },
        {
          id: 'flappy',
          name: 'flappy',
          type: 'flappy',
          displayName: 'Flappy Bird',
          description: 'Navigate through pipes by tapping to fly',
          difficulty: 'Easy',
          controls: 'Space / Click',
          genre: 'Flappy',
          defaultConfig: {
            width: 800,
            height: 600,
            player: { flapForce: 250, color: '#ffd93d' },
            world: { 
              gravity: 400, 
              background: '#87CEEB',
              backgroundType: 'day' // Add this new property
            }
          },
          // Add customization options
          customizationOptions: {
            backgroundTypes: [
              { value: 'day', label: '🌅 Day Sky', preview: '#87CEEB' },
              { value: 'night', label: '🌙 Night Sky', preview: '#191970' },
              { value: 'sunset', label: '🌅 Sunset', preview: '#FF6347' },
              { value: 'space', label: '🚀 Space', preview: '#000000' },
              { value: 'forest', label: '🌲 Forest', preview: '#228B22' }
            ]
          }
        },
        {
          id: 'shooter',
          name: 'shooter',
          type: 'shooter',
          displayName: 'Space Shooter',
          description: 'Shoot enemies and avoid obstacles in space',
          difficulty: 'Hard',
          controls: 'Arrow Keys / WASD + Space',
          genre: 'Shooter',
          defaultConfig: {
            width: 800,
            height: 600,
            player: { speed: 200, color: '#00ffff' },
            world: { gravity: 0, background: '#000014' }
          }
        }
      ];

      const template = defaultTemplates.find(t => t.id === templateId || t.name === templateId);
      
      if (!template) {
        throw new Error('Template not found');
      }

      return template;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch template');
    }
  }
);

export const createGameFromTemplate = createAsyncThunk(
  'templates/createGameFromTemplate',
  async ({ templateId, gameData }, { rejectWithValue }) => {
    try {
      console.log('Creating game from template:', templateId);
      console.log('Game data type:', gameData.constructor.name);
      
      const config = {
        headers: {},
        timeout: 30000 // 30 seconds timeout
      };
      
      // Handle FormData vs JSON
      if (gameData instanceof FormData) {
        // Don't set Content-Type for FormData - let browser handle it
        console.log('Sending FormData');
        
        // Debug FormData
        console.log('FormData entries:');
        for (let [key, value] of gameData.entries()) {
          console.log(`${key}:`, typeof value === 'object' && value instanceof File ? 'File' : value);
        }
      } else {
        // Set JSON content type
        config.headers['Content-Type'] = 'application/json';
        console.log('Sending JSON:', JSON.stringify(gameData, null, 2));
      }
      
      const response = await api.post('/games', gameData, config);
      console.log('Game creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Failed to create game from template';
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map(err => err.msg || err.message).join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/templates');
      console.log('Templates response:', response.data);
      
      if (response.data.templates) {
        return response.data.templates;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [
          {
            id: 'platformer',
            name: 'platformer',
            type: 'platformer',
            displayName: 'Platformer Game',
            description: 'Classic side-scrolling platformer with jumping mechanics',
            difficulty: 'Medium',
            controls: 'Arrow Keys / WASD',
            genre: 'Platformer',
            defaultConfig: {
              width: 800,
              height: 600,
              player: { speed: 160, jumpForce: 500, color: '#00ff00' },
              world: { gravity: 300, background: '#87CEEB' }
            }
          },
          {
            id: 'runner',
            name: 'runner',
            type: 'runner',
            displayName: 'Endless Runner',
            description: 'Fast-paced endless running game with obstacles',
            difficulty: 'Easy',
            controls: 'Space / Click',
            genre: 'Runner',
            defaultConfig: {
              width: 800,
              height: 600,
              player: { speed: 200, jumpForce: 400, color: '#ff6b6b' },
              world: { gravity: 400, background: '#ffd93d' }
            }
          },
          {
            id: 'flappy',
            name: 'flappy',
            type: 'flappy',
            displayName: 'Flappy Bird',
            description: 'Navigate through pipes by tapping to fly',
            difficulty: 'Easy',
            controls: 'Space / Click',
            genre: 'Flappy',
            defaultConfig: {
              width: 800,
              height: 600,
              player: { flapForce: 250, color: '#ffd93d' },
              world: { 
                gravity: 400, 
                background: '#87CEEB',
                backgroundType: 'day' // Add this new property
              }
            },
            // Add customization options
            customizationOptions: {
              backgroundTypes: [
                { value: 'day', label: '🌅 Day Sky', preview: '#87CEEB' },
                { value: 'night', label: '🌙 Night Sky', preview: '#191970' },
                { value: 'sunset', label: '🌅 Sunset', preview: '#FF6347' },
                { value: 'space', label: '🚀 Space', preview: '#000000' },
                { value: 'forest', label: '🌲 Forest', preview: '#228B22' }
              ]
            }
          },
          {
            id: 'shooter',
            name: 'shooter',
            type: 'shooter',
            displayName: 'Space Shooter',
            description: 'Shoot enemies and avoid obstacles in space',
            difficulty: 'Hard',
            controls: 'Arrow Keys / WASD + Space',
            genre: 'Shooter',
            defaultConfig: {
              width: 800,
              height: 600,
              player: { speed: 200, color: '#00ffff' },
              world: { gravity: 0, background: '#000014' }
            }
          }
        ];
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      return rejectWithValue(error.message);
    }
  }
);

const templateSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    currentTemplate: null,
    isLoading: false,
    isCreating: false,
    error: null
  },
  reducers: {
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTemplateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createGameFromTemplate.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createGameFromTemplate.fulfilled, (state, action) => {
        state.isCreating = false;
        state.error = null;
      })
      .addCase(createGameFromTemplate.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentTemplate, clearError } = templateSlice.actions;
export default templateSlice.reducer;