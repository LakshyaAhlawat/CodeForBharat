import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, recordPlay, toggleLike } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';

const GamePlayerPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGame, isLoading } = useSelector((state) => state.games);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [score, setScore] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGame(gameId));
    }
  }, [dispatch, gameId]);

  useEffect(() => {
    if (currentGame && user) {
      const userLiked = currentGame.likedBy?.includes(user.id);
      setIsLiked(userLiked);
      
      // Record play when game loads
      if (gameStarted) {
        dispatch(recordPlay(gameId));
      }
    }
  }, [currentGame, user, dispatch, gameId, gameStarted]);

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

  const startGame = () => {
    setGameStarted(true);
    dispatch(recordPlay(gameId));
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
          <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Home
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
                by {currentGame.user?.username || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-sm">Plays: {currentGame.playCount || 0}</span>
            </div>
            {isAuthenticated && (
              <button
                onClick={handleLike}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isLiked
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isLiked ? '❤️ Liked' : '🤍 Like'} ({currentGame.likesCount || 0})
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

        {/* Game Container */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Game Area */}
            <div className="flex-1">
              <div className="bg-black rounded-lg p-4 min-h-[600px] flex items-center justify-center">
                {!gameStarted ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎮</div>
                    <h3 className="text-xl font-bold mb-4">{currentGame.title}</h3>
                    <p className="text-gray-300 mb-6">{currentGame.description}</p>
                    <button
                      onClick={startGame}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
                    >
                      Start Game
                    </button>
                  </div>
                ) : (
                  <div id="game-container" className="w-full h-full">
                    {/* Game will be rendered here using Phaser */}
                    <div className="text-center">
                      <div className="text-2xl mb-4">🎮 Game Running...</div>
                      <div className="text-lg">Score: {score}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Game Info Sidebar */}
            <div className="w-full lg:w-80">
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2">Game Info</h3>
                <div className="space-y-2 text-sm">
                  <div>Type: {currentGame.type}</div>
                  <div>Created: {new Date(currentGame.createdAt).toLocaleDateString()}</div>
                  <div>Status: {currentGame.status}</div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2">Controls</h3>
                <div className="space-y-1 text-sm">
                  <div>• Arrow Keys or WASD - Move</div>
                  <div>• Space - Jump/Action</div>
                  <div>• R - Restart</div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-2">High Score</h3>
                <div className="text-2xl font-bold text-yellow-400">{score}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayerPage;