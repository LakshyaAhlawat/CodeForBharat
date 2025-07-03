import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPublishedGames, toggleLike } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';
import AOS from 'aos';

const Community = () => {
  const dispatch = useDispatch();
  const { publishedGames, isLoading } = useSelector((state) => state.games);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    dispatch(fetchPublishedGames());
  }, [dispatch]);

  const handleLike = async (gameId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like games');
      return;
    }
    
    try {
      await dispatch(toggleLike(gameId));
    } catch (error) {
      toast.error('Failed to like game');
    }
  };

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
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12" data-aos="fade-down">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            🎮 Game Community
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-indigo-200 max-w-3xl mx-auto px-4">
            Discover and play amazing games created by our talented community
          </p>
        </div>

        {/* Search and Filter */}
        <div 
          className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur mb-6 sm:mb-8 lg:mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
              >
                <option value="all">All Types</option>
                <option value="platformer">Platformer</option>
                <option value="runner">Runner</option>
                <option value="flappy">Flappy</option>
                <option value="shooter">Shooter</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
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
        <div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {[
            { value: publishedGames.length, label: "Total Games", color: "text-cyan-400", icon: "🎮" },
            { value: publishedGames.reduce((sum, game) => sum + (game.playCount || 0), 0), label: "Total Plays", color: "text-green-400", icon: "👾" },
            { value: publishedGames.reduce((sum, game) => sum + (game.likesCount || 0), 0), label: "Total Likes", color: "text-yellow-400", icon: "❤️" },
            { value: new Set(publishedGames.map(game => game.user?._id)).size, label: "Creators", color: "text-purple-400", icon: "👥" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 backdrop-blur text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
              data-aos="zoom-in"
              data-aos-delay={300 + index * 100}
            >
              <div className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2">{stat.icon}</div>
              <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-indigo-200">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Games Grid */}
        {filteredAndSortedGames.length === 0 ? (
          <div className="text-center py-16 sm:py-20 lg:py-24" data-aos="fade-up">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-6 sm:mb-8">🎮</div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">No Games Found</h3>
            <p className="text-indigo-200 mb-8 text-base sm:text-lg max-w-md mx-auto">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create and publish a game!'
              }
            </p>
            <Link
              to="/templates"
              className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Create First Game
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredAndSortedGames.map((game, index) => (
              <div 
                key={game._id} 
                className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur hover:bg-white/20 transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                {/* Thumbnail */}
                <div className="mb-4 sm:mb-6 relative overflow-hidden rounded-lg sm:rounded-xl">
                  {getGameThumbnail(game) ? (
                    <img
                      src={getGameThumbnail(game)}
                      alt={game.title}
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-500">
                      {getGameIcon(game.type)}
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm capitalize backdrop-blur">
                      {game.type}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white font-bold text-lg transform scale-75 group-hover:scale-100 transition-transform">
                      Click to Play!
                    </div>
                  </div>
                </div>

                {/* Game Info */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-indigo-200 text-sm sm:text-base mb-2 line-clamp-2">
                    {game.description}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    by {game.user?.username || 'Unknown'}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-indigo-300 mb-4 sm:mb-6">
                  <span className="flex items-center gap-1">
                    <span>👾</span> 
                    <span className="hidden sm:inline">plays:</span>
                    {game.playCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>❤️</span>
                    <span className="hidden sm:inline">likes:</span>
                    {game.likesCount || 0}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link
                    to={`/games/${game._id}/play`}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-300 text-center text-sm sm:text-base hover:scale-105"
                  >
                    <span className="sm:hidden">▶️</span>
                    <span className="hidden sm:inline">Play</span>
                  </Link>
                  <Link
                    to={`/games/${game._id}/reviews`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-300 text-center text-sm sm:text-base hover:scale-105"
                  >
                    <span className="sm:hidden">💬</span>
                    <span className="hidden sm:inline">Reviews</span>
                  </Link>
                  <button
                    onClick={() => handleLike(game._id)}
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base hover:scale-105 ${
                      game.likedBy?.includes(user?._id)
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    {game.likedBy?.includes(user?._id) ? '❤️' : '🤍'}
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

export default Community;