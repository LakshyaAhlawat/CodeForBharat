// src/pages/GameEditor.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, updateGameVisibility, updateGame } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';
import AOS from 'aos';

const GameEditor = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGame, isLoading, isUpdatingVisibility } = useSelector((state) => state.games);
  
  // ✅ ADD: State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, setEditedGame] = useState({
    title: '',
    description: '',
    type: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    if (gameId) {
      dispatch(fetchGame(gameId));
    }
  }, [dispatch, gameId]);

  // ✅ ADD: Update local state when game loads
  useEffect(() => {
    if (currentGame) {
      setEditedGame({
        title: currentGame.title || '',
        description: currentGame.description || '',
        type: currentGame.type || ''
      });
    }
  }, [currentGame]);

  // ✅ ADD: Save changes function
  const handleSaveChanges = async () => {
    if (!editedGame.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);
    try {
      const result = await dispatch(updateGame({
        gameId,
        gameData: editedGame
      }));

      if (result.type === 'games/updateGame/fulfilled') {
        toast.success('Game updated successfully!');
        setIsEditing(false);
        // Refresh the game data
        dispatch(fetchGame(gameId));
      } else {
        toast.error(result.payload || 'Failed to update game');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update game');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ ADD: Cancel editing
  const handleCancelEdit = () => {
    setEditedGame({
      title: currentGame.title || '',
      description: currentGame.description || '',
      type: currentGame.type || ''
    });
    setIsEditing(false);
  };

  const handlePublish = async () => {
    try {
      const result = await dispatch(updateGameVisibility({ 
        gameId, 
        visibility: 'published' 
      }));
      if (result.type === 'games/updateGameVisibility/fulfilled') {
        toast.success('Game published successfully!');
      } else {
        toast.error('Failed to publish game');
      }
    } catch (error) {
      toast.error('Failed to publish game');
    }
  };

  const handleUnpublish = async () => {
    try {
      const result = await dispatch(updateGameVisibility({ 
        gameId, 
        visibility: 'draft' 
      }));
      if (result.type === 'games/updateGameVisibility/fulfilled') {
        toast.success('Game unpublished successfully!');
      } else {
        toast.error('Failed to unpublish game');
      }
    } catch (error) {
      toast.error('Failed to unpublish game');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading game editor...</p>
        </div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center text-white">
        <div className="text-center" data-aos="fade-up">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-3xl font-bold mb-4">Game Not Found</h2>
          <p className="text-indigo-200 mb-8">The game you're trying to edit doesn't exist or you don't have permission to edit it.</p>
          <button
            onClick={() => navigate('/my-games')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Back to My Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8" data-aos="fade-down">
          <button
            onClick={() => navigate('/my-games')}
            className="text-indigo-300 hover:text-white mb-4 flex items-center gap-2 transition-colors group text-sm sm:text-base"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to My Games
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                ✏️ Edit Game
              </h1>
              <p className="text-indigo-200 text-base sm:text-lg">{currentGame.title}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/games/${gameId}/play`)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-center"
              >
                🎮 Play Game
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Game Information */}
          <div className="xl:col-span-2">
            <div 
              className="bg-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur mb-6 sm:mb-8"
              data-aos="fade-up"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold">📝 Game Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    ✏️ Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {isSaving ? '💾 Saving...' : '💾 Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2 sm:mb-3">Title</label>
                  <input
                    type="text"
                    value={isEditing ? editedGame.title : currentGame.title}
                    onChange={(e) => isEditing && setEditedGame({...editedGame, title: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border text-white text-sm sm:text-base transition-all duration-300 ${
                      isEditing 
                        ? 'bg-white/20 border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500' 
                        : 'bg-white/10 border-white/20 cursor-not-allowed'
                    }`}
                    placeholder="Enter game title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2 sm:mb-3">Description</label>
                  <textarea
                    value={isEditing ? editedGame.description : currentGame.description}
                    onChange={(e) => isEditing && setEditedGame({...editedGame, description: e.target.value})}
                    readOnly={!isEditing}
                    rows={4}
                    className={`w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border text-white resize-none text-sm sm:text-base transition-all duration-300 ${
                      isEditing 
                        ? 'bg-white/20 border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500' 
                        : 'bg-white/10 border-white/20 cursor-not-allowed'
                    }`}
                    placeholder="Describe your game..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2 sm:mb-3">Type</label>
                  {isEditing ? (
                    <select
                      value={editedGame.type}
                      onChange={(e) => setEditedGame({...editedGame, type: e.target.value})}
                      className="w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/20 border border-cyan-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                    >
                      <option value="">Select game type</option>
                      <option value="platformer">🏃‍♂️ Platformer</option>
                      <option value="runner">🏃‍♀️ Runner</option>
                      <option value="flappy">🐦 Flappy</option>
                      <option value="shooter">🚀 Shooter</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={currentGame.type}
                      readOnly
                      className="w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white capitalize cursor-not-allowed text-sm sm:text-base"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Stats */}
          <div className="space-y-6 sm:space-y-8">
            {/* Publishing */}
            <div 
              className="bg-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur"
              data-aos="fade-left"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">📢 Publishing</h3>
              
              {currentGame.status === 'published' ? (
                <div className="space-y-4">
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <p className="text-green-300 font-medium">Game is Published</p>
                  </div>
                  <button
                    onClick={handleUnpublish}
                    disabled={isUpdatingVisibility}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 text-sm sm:text-base"
                  >
                    {isUpdatingVisibility ? '📤 Unpublishing...' : '📤 Unpublish Game'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">⚠️</div>
                    <p className="text-yellow-300 font-medium">Game is in Draft</p>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={isUpdatingVisibility}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 text-sm sm:text-base"
                  >
                    {isUpdatingVisibility ? '🚀 Publishing...' : '🚀 Publish Game'}
                  </button>
                </div>
              )}
            </div>

            {/* Game Stats */}
            <div 
              className="bg-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">📊 Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-200">Status:</span>
                  <span className={`font-medium px-3 py-1 rounded-full text-sm capitalize ${
                    currentGame.status === 'published' ? 'bg-green-500/20 text-green-300' :
                    currentGame.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {currentGame.status || 'draft'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-200">👾 Plays:</span>
                  <span className="font-bold text-cyan-400">{currentGame.playCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-200">❤️ Likes:</span>
                  <span className="font-bold text-pink-400">{currentGame.likesCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-200">📅 Created:</span>
                  <span className="font-medium text-gray-300 text-sm">
                    {new Date(currentGame.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-200">🎮 Type:</span>
                  <span className="font-medium text-purple-300 capitalize">
                    {currentGame.type || 'Game'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div 
              className="bg-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/games/${gameId}/reviews`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                >
                  💬 View Reviews
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/games/${gameId}/play`)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                >
                  🔗 Copy Share Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEditor;