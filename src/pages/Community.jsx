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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AOS.init({ 
      duration: 1200, 
      once: true,
      easing: 'ease-out-cubic'
    });
    dispatch(fetchPublishedGames());
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [dispatch]);

  const handleLike = async (gameId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like games');
      return;
    }
    
    try {
      await dispatch(toggleLike(gameId));
      toast.success('Like updated!');
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

  const getGameGradient = (type) => {
    switch (type) {
      case 'platformer': return 'from-purple-500 to-indigo-600';
      case 'runner': return 'from-green-500 to-emerald-600';
      case 'flappy': return 'from-yellow-500 to-orange-600';
      case 'shooter': return 'from-red-500 to-pink-600';
      default: return 'from-blue-500 to-cyan-600';
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced loading background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-8"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-cyan-500/20 border-b-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Loading Community Games...
            </h2>
            <p className="text-gray-400">Discovering amazing creations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Cursor Tracking */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-6000"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Mouse follower gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Enhanced Header */}
          <div className="text-center mb-16 sm:mb-20" data-aos="fade-down">
            <div className="relative inline-block mb-8">
              {/* Floating particles around title */}
              <div className="absolute -top-8 -left-8 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute -top-4 -right-12 w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-6 left-12 w-5 h-5 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute -bottom-8 -right-8 w-2 h-2 bg-yellow-400 rounded-full animate-pulse animation-delay-3000"></div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                🎮 Game Community
              </h1>
            </div>
            
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="w-6 h-6 mx-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
            
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Discover and play amazing games created by our talented community of developers and creators.
            </p>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div 
            className="relative mb-16 sm:mb-20"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🔍 Discover Games
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Input */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search Games</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by title, description, or creator..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔍
                    </div>
                  </div>
                </div>

                {/* Filter Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Game Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="all">🎮 All Types</option>
                    <option value="platformer">🏃‍♂️ Platformer</option>
                    <option value="runner">🏃‍♀️ Runner</option>
                    <option value="flappy">🐦 Flappy</option>
                    <option value="shooter">🚀 Shooter</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="newest">🆕 Newest First</option>
                    <option value="oldest">⏰ Oldest First</option>
                    <option value="mostPlayed">🎯 Most Played</option>
                    <option value="mostLiked">❤️ Most Liked</option>
                    <option value="alphabetical">🔤 A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 sm:mb-20"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {[
              { 
                value: publishedGames.length, 
                label: "Total Games", 
                icon: "🎮",
                gradient: "from-cyan-500 to-blue-600",
                description: "Published games"
              },
              { 
                value: publishedGames.reduce((sum, game) => sum + (game.playCount || 0), 0), 
                label: "Total Plays", 
                icon: "👾",
                gradient: "from-green-500 to-emerald-600",
                description: "Games played"
              },
              { 
                value: publishedGames.reduce((sum, game) => sum + (game.likesCount || 0), 0), 
                label: "Total Likes", 
                icon: "❤️",
                gradient: "from-pink-500 to-rose-600",
                description: "Community love"
              },
              { 
                value: new Set(publishedGames.map(game => game.user?._id)).size, 
                label: "Creators", 
                icon: "👥",
                gradient: "from-purple-500 to-indigo-600",
                description: "Active creators"
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative"
                data-aos="zoom-in"
                data-aos-delay={300 + index * 100}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110`}></div>
                <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-700 hover:scale-105 text-center shadow-2xl">
                  <div className="text-5xl lg:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
                  <div className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-400">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Games Grid */}
          {filteredAndSortedGames.length === 0 ? (
            <div className="text-center py-20 lg:py-32" data-aos="fade-up">
              <div className="relative inline-block mb-12">
                <div className="text-8xl lg:text-9xl mb-8 animate-bounce">🎮</div>
                <div className="absolute -top-4 -left-4 w-6 h-6 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-6 w-4 h-4 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                No Games Found
              </h3>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria to discover more games'
                  : 'Be the first pioneer to create and publish an amazing game for our community!'
                }
              </p>
              <Link
                to="/templates"
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center gap-3">
                  🚀 Create First Game
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSortedGames.map((game, index) => (
                <div 
                  key={game._id} 
                  className="group relative transform transition-all duration-700 hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Enhanced glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getGameGradient(game.type)} rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110`}></div>
                  
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-700 shadow-2xl h-full flex flex-col">
                    {/* Thumbnail with enhanced styling */}
                    <div className="mb-6 relative overflow-hidden rounded-2xl">
                      {getGameThumbnail(game) ? (
                        <img
                          src={getGameThumbnail(game)}
                          alt={game.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className={`w-full h-48 bg-gradient-to-br ${getGameGradient(game.type)} flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-700`}>
                          {getGameIcon(game.type)}
                        </div>
                      )}
                      
                      {/* Enhanced Type Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold capitalize border border-white/20">
                          {game.type}
                        </span>
                      </div>

                      {/* Enhanced Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center rounded-2xl">
                        <div className="text-white font-bold text-xl transform scale-75 group-hover:scale-100 transition-all duration-500 text-center">
                          <div className="text-3xl mb-2">🎮</div>
                          <div>Click to Play!</div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Game Info */}
                    <div className="flex-grow mb-6">
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500 line-clamp-1">
                        {game.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
                        {game.description}
                      </p>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {game.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span>by {game.user?.username || 'Unknown'}</span>
                      </div>
                    </div>

                    {/* Enhanced Stats */}
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-6 bg-gray-800/50 rounded-2xl p-4 border border-gray-600/30">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👾</span> 
                        <span className="font-semibold">{game.playCount || 0}</span>
                        <span className="hidden sm:inline text-xs">plays</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">❤️</span>
                        <span className="font-semibold">{game.likesCount || 0}</span>
                        <span className="hidden sm:inline text-xs">likes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <span className="text-xs">{new Date(game.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Enhanced Actions */}
                    <div className="flex gap-3">
                      <Link
                        to={`/games/${game._id}/play`}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 text-center hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">▶️</span>
                        <span className="hidden sm:inline">Play</span>
                      </Link>
                      <Link
                        to={`/games/${game._id}/reviews`}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 text-center hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">💬</span>
                        <span className="hidden sm:inline">Reviews</span>
                      </Link>
                      <button
                        onClick={() => handleLike(game._id)}
                        className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center ${
                          game.likedBy?.includes(user?._id)
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white'
                            : 'bg-gray-700/50 hover:bg-gray-600/70 text-white border border-gray-600/50 hover:border-gray-500/70'
                        }`}
                        disabled={!isAuthenticated}
                        title={!isAuthenticated ? 'Login to like games' : game.likedBy?.includes(user?._id) ? 'Unlike' : 'Like'}
                      >
                        <span className="text-lg">
                          {game.likedBy?.includes(user?._id) ? '❤️' : '🤍'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;