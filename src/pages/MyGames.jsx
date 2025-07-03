// src/pages/MyGames.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyGames, deleteGame, updateGameVisibility } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';

const MyGames = () => {
  const dispatch = useDispatch();
  const { myGames, isLoading, isDeleting, isUpdatingVisibility } = useSelector((state) => state.games);

  useEffect(() => {
    dispatch(fetchMyGames());
  }, [dispatch]);

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      try {
        const result = await dispatch(deleteGame(gameId));
        if (result.type === 'games/deleteGame/fulfilled') {
          toast.success('Game deleted successfully!');
        } else {
          toast.error('Failed to delete game');
        }
      } catch (error) {
        toast.error('Failed to delete game');
      }
    }
  };

  const handleVisibilityChange = async (gameId, newVisibility) => {
    try {
      const result = await dispatch(updateGameVisibility({ 
        gameId, 
        visibility: newVisibility 
      }));
      if (result.type === 'games/updateGameVisibility/fulfilled') {
        toast.success(`Game ${newVisibility === 'published' ? 'published' : 'unpublished'} successfully!`);
      } else {
        toast.error('Failed to update game visibility');
      }
    } catch (error) {
      toast.error('Failed to update game visibility');
    }
  };

  const getGameThumbnail = (game) => {
    if (game.thumbnail) {
      // Handle different thumbnail formats
      if (game.thumbnail.startsWith('data:')) {
        return game.thumbnail;
      } else if (game.thumbnail.startsWith('http')) {
        return game.thumbnail;
      } else if (game.thumbnail.startsWith('/')) {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${game.thumbnail}`;
      } else {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${game.thumbnail}`;
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Games</h1>
            <p className="text-indigo-200">Manage and edit your created games</p>
          </div>
          <Link
            to="/templates"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Create New Game
          </Link>
        </div>

        {myGames.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">No games created yet</h3>
            <p className="text-indigo-200 mb-6">Create your first game to get started</p>
            <Link
              to="/templates"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Create Game
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGames.map((game) => (
              <div key={game._id} className="bg-white/10 rounded-xl p-6 backdrop-blur hover:bg-white/20 transition-all duration-300">
                {/* Thumbnail display */}
                <div className="mb-4 relative">
                  {getGameThumbnail(game) ? (
                    <img
                      src={getGameThumbnail(game)}
                      alt={game.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                        e.target.parentElement.querySelector('.fallback-thumbnail').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  <div 
                    className={`fallback-thumbnail w-full h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center ${getGameThumbnail(game) ? 'hidden' : 'flex'}`}
                  >
                    <div className="text-4xl">
                      {game.type === 'platformer' && '🏃‍♂️'}
                      {game.type === 'runner' && '🏃‍♀️'}
                      {game.type === 'flappy' && '🐦'}
                      {game.type === 'shooter' && '🚀'}
                      {!game.type && '🎮'}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                  <p className="text-indigo-200 text-sm mb-2">{game.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-indigo-300 mb-4">
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded capitalize">
                      {game.type || 'game'}
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      {game.status || 'draft'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span>👾 {game.playCount || 0} plays</span>
                    <span>❤️ {game.likesCount || 0} likes</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <Link
                    to={`/games/${game._id}/play`}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition text-center"
                  >
                    Play
                  </Link>
                  <Link
                    to={`/games/${game._id}/edit`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition text-center"
                  >
                    Edit
                  </Link>
                </div>
                
                {/* Additional controls */}
                <div className="flex gap-2">
                  <select
                    value={game.status || 'draft'}
                    onChange={(e) => handleVisibilityChange(game._id, e.target.value)}
                    disabled={isUpdatingVisibility}
                    className="flex-1 bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="private">Private</option>
                  </select>
                  
                  <button
                    onClick={() => handleDeleteGame(game._id)}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGames;