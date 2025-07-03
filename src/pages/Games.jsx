import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPublishedGames } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';

const Games = () => {
  const dispatch = useDispatch();
  const { publishedGames, isLoading } = useSelector((state) => state.games);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(fetchPublishedGames());
  }, [dispatch]);

  const getGameThumbnail = (game) => {
    if (game.assets?.thumbnail) {
      if (game.assets.thumbnail.startsWith('data:')) {
        return game.assets.thumbnail;
      } else if (game.assets.thumbnail.startsWith('http')) {
        return game.assets.thumbnail;
      } else if (game.assets.thumbnail.startsWith('/')) {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${game.assets.thumbnail}`;
      } else {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/games/${game.assets.thumbnail}`;
      }
    }
    return null;
  };

  const getGameIcon = (type) => {
    switch (type) {
      case 'platformer': return '🏃‍♂️';
      case 'runner': return '🏃‍♀️';
      case 'flappy': return '🐦';
      case 'shooter': return '🚀';
      default: return '🎮';
    }
  };

  const filteredAndSortedGames = publishedGames
    .filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.user?.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || game.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostPlayed':
          return (b.playCount || 0) - (a.playCount || 0);
        case 'mostLiked':
          return (b.likesCount || 0) - (a.likesCount || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

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
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎮 Game Community</h1>
            <p className="text-indigo-200">Discover and play amazing games created by our community</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link
              to="/leaderboard"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              🏆 Leaderboard
            </Link>
            <Link
              to="/templates"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Create Game
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Games</label>
              <input
                type="text"
                placeholder="Search by title, description, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Game Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="platformer">Platformer</option>
                <option value="runner">Runner</option>
                <option value="flappy">Flappy Bird</option>
                <option value="shooter">Shooter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostPlayed">Most Played</option>
                <option value="mostLiked">Most Liked</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-2xl font-bold text-cyan-400">{publishedGames.length}</div>
            <div className="text-sm text-indigo-200">Total Games</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-2xl font-bold text-green-400">
              {publishedGames.reduce((sum, game) => sum + (game.playCount || 0), 0)}
            </div>
            <div className="text-sm text-indigo-200">Total Plays</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-2xl font-bold text-pink-400">
              {publishedGames.reduce((sum, game) => sum + (game.likesCount || 0), 0)}
            </div>
            <div className="text-sm text-indigo-200">Total Likes</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {new Set(publishedGames.map(game => game.user?.username)).size}
            </div>
            <div className="text-sm text-indigo-200">Creators</div>
          </div>
        </div>

        {/* Games Grid */}
        {filteredAndSortedGames.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">No games found</h3>
            <p className="text-indigo-200 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create and publish a game!'
              }
            </p>
            <Link
              to="/templates"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Create First Game
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedGames.map((game) => (
              <div key={game._id} className="bg-white/10 rounded-xl p-6 backdrop-blur hover:bg-white/20 transition-all duration-300 group">
                {/* Thumbnail */}
                <div className="mb-4 relative overflow-hidden rounded-lg">
                  {getGameThumbnail(game) ? (
                    <img
                      src={getGameThumbnail(game)}
                      alt={game.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.querySelector('.fallback-thumbnail').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  <div 
                    className={`fallback-thumbnail w-full h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center ${getGameThumbnail(game) ? 'hidden' : 'flex'} group-hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="text-4xl">{getGameIcon(game.type)}</div>
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur text-white px-2 py-1 rounded text-xs font-medium capitalize">
                    {game.type || 'game'}
                  </div>
                </div>
                
                {/* Game Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-300 transition-colors">{game.title}</h3>
                  <p className="text-indigo-200 text-sm mb-3 line-clamp-2">{game.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-indigo-300 mb-3">
                    <span className="flex items-center gap-1">
                      👤 {game.user?.username || 'Unknown'}
                    </span>
                    <span className="text-gray-400">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-indigo-300">
                    <span className="flex items-center gap-1">
                      👾 {game.playCount || 0} plays
                    </span>
                    <span className="flex items-center gap-1">
                      ❤️ {game.likesCount || 0} likes
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/games/${game._id}/play`}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition text-center"
                  >
                    Play
                  </Link>
                  <Link
                    to={`/games/${game._id}/reviews`}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition"
                  >
                    Reviews
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;