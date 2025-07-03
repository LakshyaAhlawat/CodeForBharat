// src/pages/TemplateCustomize.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createGameFromTemplate } from '../store/slices/templateSlice';
import { toast } from 'react-hot-toast';

const TemplateCustomize = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isCreating, error } = useSelector((state) => state.templates);
  
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    thumbnail: null,
    thumbnailPreview: null,
    customizations: {}
  });

  const [template, setTemplate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const defaultTemplates = [
      {
        id: 'platformer',
        name: 'platformer',
        type: 'platformer',
        displayName: 'Platformer Game',
        description: 'Classic side-scrolling platformer with jumping mechanics',
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
        defaultConfig: {
          width: 800,
          height: 600,
          player: { flapForce: 250, color: '#ffd93d' },
          world: { gravity: 400, background: '#87CEEB' }
        }
      },
      {
        id: 'shooter',
        name: 'shooter',
        type: 'shooter',
        displayName: 'Space Shooter',
        description: 'Shoot enemies and avoid obstacles in space',
        defaultConfig: {
          width: 800,
          height: 600,
          player: { speed: 200, color: '#00ffff' },
          world: { gravity: 0, background: '#000014' }
        }
      }
    ];
    
    const foundTemplate = defaultTemplates.find(t => t.id === templateId || t.name === templateId);
    if (foundTemplate) {
      setTemplate(foundTemplate);
      setGameData(prev => ({
        ...prev,
        title: foundTemplate.displayName + ' - My Game',
        description: foundTemplate.description,
        customizations: foundTemplate.defaultConfig || {}
      }));
    }
  }, [templateId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setGameData(prev => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gameData.title.trim()) {
      toast.error('Please enter a game title');
      return;
    }

    if (!template) {
      toast.error('Template not found');
      return;
    }

    setIsSubmitting(true);

    try {
      const gameConfig = {
        type: template.type,
        width: template.defaultConfig?.width || 800,
        height: template.defaultConfig?.height || 600,
        player: template.defaultConfig?.player || {},
        world: template.defaultConfig?.world || {}
      };

      let gamePayload;
      
      if (gameData.thumbnail) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('title', gameData.title.trim());
        formData.append('description', gameData.description.trim() || template.description);
        formData.append('type', template.type);
        formData.append('thumbnail', gameData.thumbnail);
        formData.append('gameData', JSON.stringify(gameConfig));
        formData.append('phaserConfig', JSON.stringify(gameConfig));
        
        gamePayload = formData;
        console.log('Submitting FormData with thumbnail');
      } else {
        // Regular JSON payload
        gamePayload = {
          title: gameData.title.trim(),
          description: gameData.description.trim() || template.description,
          type: template.type,
          gameData: gameConfig,
          phaserConfig: gameConfig
        };
        console.log('Submitting JSON payload without thumbnail');
      }
      
      const result = await dispatch(createGameFromTemplate({
        templateId: template.id,
        gameData: gamePayload
      }));
      
      if (result.type === 'templates/createGameFromTemplate/fulfilled') {
        toast.success('Game created successfully!');
        navigate('/my-games');
      } else {
        const errorMessage = result.payload || 'Failed to create game';
        toast.error(errorMessage);
        console.error('Creation failed:', result);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to create game');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearThumbnail = () => {
    setGameData(prev => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: null
    }));
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Template Not Found</h2>
          <p className="mb-4">The template "{templateId}" could not be found.</p>
          <button
            onClick={() => navigate('/templates')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Customize Template</h1>
            <p className="text-indigo-200">Create your game from {template.displayName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <h3 className="text-xl font-bold mb-4">Game Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Game Title *</label>
                  <input
                    type="text"
                    value={gameData.title}
                    onChange={(e) => setGameData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your game title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Template Type</label>
                  <input
                    type="text"
                    value={template.type}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-gray-400 capitalize"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={gameData.description}
                  onChange={(e) => setGameData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  placeholder="Describe your game..."
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Game Thumbnail (Optional)</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                    />
                    <p className="text-sm text-indigo-300 mt-1">Upload a thumbnail image (max 5MB) - Optional</p>
                  </div>
                  
                  {gameData.thumbnailPreview && (
                    <div className="relative">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/10 border-2 border-cyan-500">
                        <img
                          src={gameData.thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={clearThumbnail}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <h3 className="text-xl font-bold mb-4">Template Preview</h3>
              <div className="bg-black/50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                    {template.type === 'platformer' && '🏃‍♂️'}
                    {template.type === 'runner' && '🏃‍♀️'}
                    {template.type === 'flappy' && '🐦'}
                    {template.type === 'shooter' && '🚀'}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{template.displayName}</h4>
                    <p className="text-indigo-200">{template.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Game Type:</strong> <span className="capitalize">{template.type}</span>
                  </div>
                  <div>
                    <strong>Difficulty:</strong> <span className="text-green-400">Easy</span>
                  </div>
                  <div>
                    <strong>Controls:</strong> <span>Arrow Keys / Space</span>
                  </div>
                  <div>
                    <strong>Genre:</strong> <span className="capitalize">{template.type}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !gameData.title.trim()}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Game...
                  </>
                ) : (
                  <>
                    🎮 Create Game
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/templates')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200">Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomize;