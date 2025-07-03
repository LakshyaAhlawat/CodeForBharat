// src/components/GamePlayer.jsx
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, recordPlay, toggleLike } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';

const GamePlayer = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGame, isLoading } = useSelector((state) => state.games);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [score, setScore] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGame(gameId));
    }
  }, [dispatch, gameId]);

  useEffect(() => {
    if (currentGame && user) {
      // Check if user already liked this game
      const userLiked = currentGame.metadata?.likes?.includes(user.id);
      setIsLiked(userLiked);
      
      // Record play when game loads
      dispatch(recordPlay(gameId));
    }
  }, [currentGame, user, dispatch, gameId]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like games');
      return;
    }
    
    try {
      await dispatch(toggleLike(gameId));
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Game unliked' : 'Game liked');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/games/${gameId}/play`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Game URL copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
          <p className="text-indigo-200 mb-4">The game you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <button
              onClick={() => navigate(-1)}
              className="text-indigo-300 hover:text-white transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">{currentGame.title}</h1>
              <p className="text-indigo-200">
                by {currentGame.creator?.username || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-sm">Plays: {currentGame.metadata?.playCount || 0}</span>
            </div>
            {isAuthenticated && (
              <button
                onClick={handleLike}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                ❤️ {currentGame.metadata?.likes?.length || 0}
              </button>
            )}
            <button
              onClick={handleShare}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Share
            </button>
          </div>
        </div>

        {/* Game Container - Placeholder for now */}
        <div className="bg-white/10 rounded-xl p-4 lg:p-6 backdrop-blur">
          <div className="bg-black rounded-lg overflow-hidden mb-4 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-2">Game Player</h3>
              <p className="text-gray-300">
                Game integration coming soon!
              </p>
              <p className="text-sm text-gray-400 mt-2">
                This would load the actual Phaser.js game
              </p>
            </div>
          </div>
          
          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">About this game</h3>
              <p className="text-indigo-200">
                {currentGame.description || 'No description available'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Game Stats</h3>
              <div className="space-y-1 text-indigo-200">
                <div>Plays: {currentGame.metadata?.playCount || 0}</div>
                <div>Likes: {currentGame.metadata?.likes?.length || 0}</div>
                <div>Created: {new Date(currentGame.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="mt-6 bg-white/10 rounded-xl p-4 lg:p-6 backdrop-blur">
          <h3 className="font-semibold mb-4">Game Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-indigo-200">Status:</span>
              <div className="font-medium capitalize">{currentGame.status || 'Published'}</div>
            </div>
            <div>
              <span className="text-indigo-200">Created:</span>
              <div className="font-medium">
                {new Date(currentGame.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-indigo-200">Updated:</span>
              <div className="font-medium">
                {new Date(currentGame.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-indigo-200">Creator:</span>
              <div className="font-medium">{currentGame.creator?.username || 'Unknown'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;