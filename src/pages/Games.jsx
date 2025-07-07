import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPublishedGames, toggleLike } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';
import AOS from 'aos';

const Games = () => {
  const dispatch = useDispatch();
  const { publishedGames, isLoading } = useSelector((state) => state.games);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      case 'puzzle': return '🧩';
      case 'racing': return '🏎️';
      case 'adventure': return '⚔️';
      default: return '🎮';
    }
  };

  const getGameGradient = (type) => {
    switch (type) {
      case 'platformer': return 'from-purple-500 to-indigo-600';
      case 'runner': return 'from-green-500 to-emerald-600';
      case 'flappy': return 'from-yellow-500 to-orange-600';
      case 'shooter': return 'from-red-500 to-pink-600';
      case 'puzzle': return 'from-blue-500 to-cyan-600';
      case 'racing': return 'from-orange-500 to-red-600';
      case 'adventure': return 'from-indigo-500 to-purple-600';
      default: return 'from-slate-500 to-gray-600';
    }
  };

  const getDifficultyColor = (playCount) => {
    if (playCount > 1000) return 'text-red-400';
    if (playCount > 500) return 'text-orange-400';
    if (playCount > 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredAndSortedGames = publishedGames
    .filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.user?.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || game.type === filterType;
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'trending' && (game.playCount || 0) > 100) ||
        (selectedCategory === 'new' && new Date(game.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (selectedCategory === 'popular' && (game.likesCount || 0) > 10);
      return matchesSearch && matchesType && matchesCategory;
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
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
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
            <div className="relative mb-12">
              <div className="w-32 h-32 border-8 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-8"></div>
              <div className="absolute inset-0 w-32 h-32 border-8 border-cyan-500/20 border-b-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
              <div className="absolute inset-0 w-32 h-32 border-4 border-pink-500/20 border-l-pink-500 rounded-full animate-spin mx-auto" style={{ animationDuration: '3s' }}></div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Loading Game Universe...
            </h2>
            <p className="text-xl text-gray-400 mb-8">Preparing an epic gaming experience</p>
            <div className="flex justify-center items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-1000"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultimate Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Multi-layer animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-6000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-400/5 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-8000"></div>
        </div>
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Advanced mouse follower gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-blue-500/15 to-transparent rounded-full pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        
        {/* Secondary mouse follower */}
        <div 
          className="absolute w-64 h-64 bg-gradient-radial from-purple-500/10 to-transparent rounded-full pointer-events-none transition-all duration-1500 ease-out"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
          }}
        />
      </div>

      <div className="relative z-10 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Ultimate Enhanced Header */}
          <div className="text-center mb-20 sm:mb-24" data-aos="fade-down">
            <div className="relative inline-block mb-12">
              {/* Floating particles constellation */}
              <div className="absolute -top-12 -left-12 w-6 h-6 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute -top-8 -right-16 w-4 h-4 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-10 left-16 w-8 h-8 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute -bottom-12 -right-12 w-3 h-3 bg-yellow-400 rounded-full animate-pulse animation-delay-3000"></div>
              <div className="absolute top-4 -left-20 w-5 h-5 bg-green-400 rounded-full animate-bounce animation-delay-4000"></div>
              <div className="absolute bottom-4 right-20 w-4 h-4 bg-blue-400 rounded-full animate-ping animation-delay-5000"></div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                🎮 Game Universe
              </h1>
              
              {/* Animated subtitle with effects */}
              <div className="text-2xl sm:text-3xl lg:text-4xl max-w-6xl mx-auto text-gray-300 leading-relaxed mb-8">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                  Discover • Play • Create • Compete
                </span>
                <br />
                <span className="text-lg sm:text-xl lg:text-2xl">
                  The ultimate destination for JavaScript gaming adventures
                </span>
              </div>
            </div>
            
            {/* Enhanced decorative separator */}
            <div className="flex items-center justify-center mb-12">
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="w-8 h-8 mx-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
              </div>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>

            {/* Enhanced quick action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16" data-aos="fade-up" data-aos-delay="200">
              <Link
                to="/leaderboard"
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/25"
              >
                <span className="relative z-10 flex items-center gap-3">
                  🏆 Leaderboard
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/templates"
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25"
              >
                <span className="relative z-10 flex items-center gap-3">
                  🛠️ Create Game
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/community"
                className="group relative overflow-hidden bg-transparent border-2 border-white/40 text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-all duration-300 hover:bg-white/10 hover:border-white/60"
              >
                <span className="relative z-10 flex items-center gap-3">
                  👥 Community
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Enhanced Search and Filter Mega Section */}
          <div 
            className="relative mb-20 sm:mb-24"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
              <h3 className="text-3xl lg:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🔍 Game Discovery Center
              </h3>
              
              {/* Category Pills - FIXED SYNTAX */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: 'all', label: '🎮 All Games', count: publishedGames.length },
                  { id: 'trending', label: '🔥 Trending', count: publishedGames.filter(g => (g.playCount || 0) > 100).length },
                  { id: 'new', label: '✨ New', count: publishedGames.filter(g => new Date(g.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
                  { id: 'popular', label: '⭐ Popular', count: publishedGames.filter(g => (g.likesCount || 0) > 10).length }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 border border-gray-600/50'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Enhanced Search Input */}
                <div className="lg:col-span-2">
                  <label className="block text-lg font-semibold text-gray-300 mb-3">🔍 Search Games</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by title, description, or creator..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-8 py-5 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm text-lg"
                    />
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                      🎯
                    </div>
                  </div>
                </div>

                {/* Enhanced Filter Type */}
                <div>
                  <label className="block text-lg font-semibold text-gray-300 mb-3">🎪 Game Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm text-lg"
                  >
                    <option value="all">🎮 All Types</option>
                    <option value="platformer">🏃‍♂️ Platformer</option>
                    <option value="runner">🏃‍♀️ Runner</option>
                    <option value="flappy">🐦 Flappy Bird</option>
                    <option value="shooter">🚀 Shooter</option>
                    <option value="puzzle">🧩 Puzzle</option>
                    <option value="racing">🏎️ Racing</option>
                    <option value="adventure">⚔️ Adventure</option>
                  </select>
                </div>

                {/* Enhanced Sort By */}
                <div>
                  <label className="block text-lg font-semibold text-gray-300 mb-3">📊 Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm text-lg"
                  >
                    <option value="newest">🆕 Newest First</option>
                    <option value="oldest">⏰ Oldest First</option>
                    <option value="mostPlayed">🎯 Most Played</option>
                    <option value="mostLiked">❤️ Most Liked</option>
                    <option value="alphabetical">🔤 A-Z</option>
                    <option value="rating">⭐ Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex justify-center mt-8">
                <div className="bg-gray-700/50 p-2 rounded-2xl border border-gray-600/50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    📱 Grid View
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    📋 List View
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ultimate Enhanced Stats Dashboard - FIXED SYNTAX */}
          <div 
            className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-20 sm:mb-24"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {[
              { 
                value: filteredAndSortedGames.length, 
                label: "Games Found", 
                icon: "🎮",
                gradient: "from-cyan-500 to-blue-600",
                description: "Available to play",
                pulse: true
              },
              { 
                value: publishedGames.reduce((sum, game) => sum + (game.playCount || 0), 0), 
                label: "Total Plays", 
                icon: "👾",
                gradient: "from-green-500 to-emerald-600",
                description: "Community engagement",
                pulse: false
              },
              { 
                value: publishedGames.reduce((sum, game) => sum + (game.likesCount || 0), 0), 
                label: "Total Likes", 
                icon: "❤️",
                gradient: "from-pink-500 to-rose-600",
                description: "Community love",
                pulse: true
              },
              { 
                value: new Set(publishedGames.map(game => game.user?._id)).size, 
                label: "Creators", 
                icon: "👥",
                gradient: "from-purple-500 to-indigo-600",
                description: "Active developers",
                pulse: false
              },
              { 
                value: Math.round(publishedGames.reduce((sum, game) => sum + (game.averageRating || 0), 0) / publishedGames.length * 10) / 10 || 0, 
                label: "Avg Rating", 
                icon: "⭐",
                gradient: "from-yellow-500 to-orange-600",
                description: "Quality score",
                pulse: true
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative"
                data-aos="zoom-in"
                data-aos-delay={500 + index * 100}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110 ${stat.pulse ? 'animate-pulse' : ''}`}></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-700 hover:scale-105 text-center shadow-2xl">
                  <div className={`text-5xl lg:text-6xl mb-4 transform group-hover:scale-125 transition-transform duration-500 ${stat.pulse ? 'animate-bounce' : ''}`}>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-500">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ultimate Games Display */}
          {filteredAndSortedGames.length === 0 ? (
            <div className="text-center py-24 lg:py-32" data-aos="fade-up" data-aos-delay="600">
              <div className="relative inline-block mb-16">
                <div className="text-9xl lg:text-[12rem] mb-12 animate-bounce">🎮</div>
                <div className="absolute -top-8 -left-8 w-8 h-8 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute -top-4 -right-12 w-6 h-6 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute -bottom-8 left-16 w-10 h-10 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                No Games Match Your Search
              </h3>
              <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                {searchTerm || filterType !== 'all' || selectedCategory !== 'all'
                  ? 'Try adjusting your search criteria or explore different categories to discover amazing games'
                  : 'Be the first pioneer to create and publish an incredible game for our growing community!'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/templates"
                  className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-5 px-12 rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    🚀 Create First Game
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setSelectedCategory('all');
                  }}
                  className="group relative overflow-hidden bg-transparent border-2 border-white/40 text-white font-bold py-5 px-12 rounded-full hover:scale-105 transition-all duration-300 hover:bg-white/10 hover:border-white/60"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    🔄 Reset Filters
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* FIXED GRID LAYOUT */
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 auto-rows-fr"
              : "space-y-6"
            }>
              {filteredAndSortedGames.map((game, index) => (
                viewMode === 'grid' ? (
                  /* FIXED Enhanced Grid Card */
                  <div 
                    key={game._id} 
                    className="group relative transform transition-all duration-500 hover:scale-[1.02] w-full"
                    data-aos="fade-up"
                    data-aos-delay={Math.min(index * 50, 1000)}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Ultimate glow effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${getGameGradient(game.type)} rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition-all duration-500`}></div>
                    
                    <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-4 lg:p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-500 shadow-xl h-full flex flex-col min-h-[400px]">
                      {/* Enhanced Thumbnail - FIXED HEIGHT */}
                      <div className="mb-4 relative overflow-hidden rounded-2xl h-48 flex-shrink-0">
                        {getGameThumbnail(game) ? (
                          <img
                            src={getGameThumbnail(game)}
                            alt={game.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getGameGradient(game.type)} flex items-center justify-center text-5xl lg:text-6xl group-hover:scale-105 transition-transform duration-500`}>
                            <div className={`transform ${hoveredCard === index ? 'animate-bounce scale-110' : ''} transition-all duration-500`}>
                              {getGameIcon(game.type)}
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced badges */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold capitalize border border-white/20">
                            {game.type}
                          </span>
                        </div>

                        {/* Popularity badge */}
                        {(game.playCount || 0) > 100 && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              🔥 HOT
                            </span>
                          </div>
                        )}

                        {/* Enhanced Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-2xl">
                          <div className="text-white font-bold text-lg transform scale-75 group-hover:scale-100 transition-all duration-300 text-center">
                            <div className="text-3xl mb-2 animate-pulse">🎮</div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 text-sm">
                              Click to Play!
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Game Info - FLEXIBLE HEIGHT */}
                      <div className="flex-grow flex flex-col mb-4">
                        <h3 className="text-lg lg:text-xl font-bold mb-2 text-white group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500 line-clamp-2 leading-tight">
                          {game.title}
                        </h3>
                        <p className="text-gray-300 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-500 flex-grow">
                          {game.description}
                        </p>
                        
                        {/* Enhanced creator info */}
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <div className={`w-6 h-6 bg-gradient-to-r ${getGameGradient(game.type)} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
                            {game.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-medium text-sm truncate">by {game.user?.username || 'Unknown'}</div>
                            <div className="text-xs">{new Date(game.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Stats Grid - FIXED HEIGHT */}
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-4 bg-gray-800/50 rounded-xl p-3 border border-gray-600/30 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-lg mb-1">👾</div>
                          <div className={`font-bold text-xs ${getDifficultyColor(game.playCount || 0)}`}>
                            {(game.playCount || 0) > 999 ? `${Math.floor((game.playCount || 0) / 1000)}k` : (game.playCount || 0)}
                          </div>
                          <div className="text-xs text-gray-500">plays</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg mb-1">❤️</div>
                          <div className="font-bold text-pink-400 text-xs">
                            {(game.likesCount || 0)}
                          </div>
                          <div className="text-xs text-gray-500">likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg mb-1">⭐</div>
                          <div className="font-bold text-yellow-400 text-xs">
                            {(game.averageRating || 0).toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">rating</div>
                        </div>
                      </div>

                      {/* Enhanced Action Buttons - FIXED HEIGHT */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Link
                          to={`/games/${game._id}/play`}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-3 rounded-xl font-semibold transition-all duration-300 text-center hover:scale-105 hover:shadow-lg flex items-center justify-center gap-1 text-sm"
                        >
                          <span className="text-base">▶️</span>
                          <span className="hidden sm:inline">Play</span>
                        </Link>
                        <Link
                          to={`/games/${game._id}/reviews`}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-2 px-3 rounded-xl font-semibold transition-all duration-300 text-center hover:scale-105 hover:shadow-lg flex items-center justify-center gap-1 text-sm"
                        >
                          <span className="text-base">💬</span>
                          <span className="hidden sm:inline">Reviews</span>
                        </Link>
                        <button
                          onClick={() => handleLike(game._id)}
                          className={`px-3 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                            game.likedBy?.includes(user?._id)
                              ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white'
                              : 'bg-gray-700/50 hover:bg-gray-600/70 text-white border border-gray-600/50 hover:border-gray-500/70'
                          }`}
                          disabled={!isAuthenticated}
                          title={!isAuthenticated ? 'Login to like games' : game.likedBy?.includes(user?._id) ? 'Unlike' : 'Like'}
                        >
                          <span className="text-base">
                            {game.likedBy?.includes(user?._id) ? '❤️' : '🤍'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Enhanced List Card - UNCHANGED */
                  <div 
                    key={game._id} 
                    className="group relative"
                    data-aos="slide-right"
                    data-aos-delay={index * 30}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${getGameGradient(game.type)} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700`}></div>
                    
                    <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-700 shadow-2xl">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Thumbnail */}
                        <div className="lg:w-48 lg:h-32 flex-shrink-0 relative overflow-hidden rounded-2xl">
                          {getGameThumbnail(game) ? (
                            <img
                              src={getGameThumbnail(game)}
                              alt={game.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${getGameGradient(game.type)} flex items-center justify-center text-4xl`}>
                              {getGameIcon(game.type)}
                            </div>
                          )}
                        </div>

                        {/* Game Info */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-500">
                              {game.title}
                            </h3>
                            <div className="flex gap-2 mt-2 lg:mt-0">
                              <span className="bg-gray-700/50 px-3 py-1 rounded-full text-sm capitalize">
                                {game.type}
                              </span>
                              {(game.playCount || 0) > 100 && (
                                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  🔥 HOT
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                            {game.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                              <span className="flex items-center gap-2">
                                <span className="text-lg">👤</span>
                                {game.user?.username || 'Unknown'}
                              </span>
                              <span className="flex items-center gap-2">
                                <span className="text-lg">👾</span>
                                {(game.playCount || 0).toLocaleString()} plays
                              </span>
                              <span className="flex items-center gap-2">
                                <span className="text-lg">❤️</span>
                                {(game.likesCount || 0).toLocaleString()} likes
                              </span>
                              <span className="flex items-center gap-2">
                                <span className="text-lg">⭐</span>
                                {(game.averageRating || 0).toFixed(1)} rating
                              </span>
                            </div>
                            
                            <div className="flex gap-3">
                              <Link
                                to={`/games/${game._id}/play`}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                              >
                                ▶️ Play
                              </Link>
                              <Link
                                to={`/games/${game._id}/reviews`}
                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-2 px-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                              >
                                💬
                              </Link>
                              <button
                                onClick={() => handleLike(game._id)}
                                className={`px-4 py-2 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                                  game.likedBy?.includes(user?._id)
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                                    : 'bg-gray-700/50 hover:bg-gray-600/70 text-white border border-gray-600/50'
                                }`}
                                disabled={!isAuthenticated}
                              >
                                {game.likedBy?.includes(user?._id) ? '❤️' : '🤍'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;