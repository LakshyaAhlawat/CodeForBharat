// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserDashboard } from '../store/slices/authSlice';
import { fetchMyGames } from '../store/slices/gameSlice';
import { fetchTemplates } from '../store/slices/templateSlice';
import AOS from 'aos';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, dashboardData, isLoading } = useSelector((state) => state.auth);
  const { myGames } = useSelector((state) => state.games);
  const { templates } = useSelector((state) => state.templates);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    dispatch(fetchUserDashboard());
    dispatch(fetchMyGames());
    dispatch(fetchTemplates());

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate floating gaming elements
    const generateFloatingElements = () => {
      const elements = [];
      for (let i = 0; i < 25; i++) {
        elements.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 5 + Math.random() * 8,
          icon: ['🎮', '🕹️', '👾', '🎯', '⭐', '💫', '🌟', '🚀', '⚡', '🔥', '🏆', '🎊'][Math.floor(Math.random() * 12)]
        });
      }
      setFloatingElements(elements);
    };

    // Update current time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    generateFloatingElements();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timeInterval);
    };
  }, [dispatch]);

  // Add null checks for arrays
  const recentGames = Array.isArray(myGames) ? myGames.slice(0, 4) : [];
  const featuredTemplates = Array.isArray(templates) ? templates.slice(0, 3) : [];

  // Get stats from dashboardData or fallback to default values
  const stats = dashboardData?.stats || {
    gamesCreated: Array.isArray(myGames) ? myGames.length : 0,
    totalPlays: 0,
    totalLikes: 0,
    reviewsGiven: 0
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'from-green-500 to-emerald-600';
      case 'draft': return 'from-yellow-500 to-orange-600';
      case 'private': return 'from-gray-500 to-gray-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'published': return '🌟';
      case 'draft': return '📝';
      case 'private': return '🔒';
      default: return '🎮';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultimate Enhanced Loading Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-12">
              <div className="w-32 h-32 border-6 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-8"></div>
              <div className="absolute inset-0 w-32 h-32 border-6 border-cyan-500/20 border-b-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
              <div className="absolute inset-2 w-28 h-28 border-4 border-pink-500/20 border-l-pink-500 rounded-full animate-spin mx-auto" style={{ animationDuration: '3s' }}></div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              🎮 Loading Your Gaming Dashboard...
            </h2>
            <p className="text-xl text-gray-300 mb-8">Preparing your gaming universe</p>
            <div className="flex justify-center items-center gap-3 text-gray-500">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce animation-delay-500"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultimate Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Floating gaming elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-2xl opacity-20 animate-float"
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            {element.icon}
          </div>
        ))}

        {/* Multi-layer animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-orange-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-6000"></div>
        </div>

        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Advanced mouse follower gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Ultimate Enhanced Welcome Section */}
          <div className="mb-12 sm:mb-16" data-aos="fade-down">
            <div className="relative">
              {/* Floating welcome particles */}
              <div className="absolute -top-8 -left-8 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute -top-6 -right-12 w-3 h-3 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-6 left-12 w-6 h-6 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                  {getGreeting()}, {user?.username || user?.displayName || 'Gamer'}! 👋
                </h1>
                <div className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-6">
                  <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold animate-pulse">
                    Ready to build gaming legends today?
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 text-lg text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl animate-bounce">⏰</div>
                    <span>{currentTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl animate-pulse">🌟</div>
                    <span>Level: Master Creator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl animate-bounce animation-delay-1000">🔥</div>
                    <span>Streak: 5 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ultimate Enhanced Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16" data-aos="fade-up" data-aos-delay="200">
            {[
              { 
                value: stats.gamesCreated, 
                label: 'Games Created', 
                icon: '🎮', 
                color: 'from-cyan-500 to-blue-600',
                glow: 'shadow-cyan-500/25'
              },
              { 
                value: stats.totalPlays, 
                label: 'Total Plays', 
                icon: '👾', 
                color: 'from-green-500 to-emerald-600',
                glow: 'shadow-green-500/25'
              },
              { 
                value: stats.totalLikes, 
                label: 'Likes Received', 
                icon: '❤️', 
                color: 'from-pink-500 to-rose-600',
                glow: 'shadow-pink-500/25'
              },
              { 
                value: stats.reviewsGiven, 
                label: 'Reviews Given', 
                icon: '⭐', 
                color: 'from-yellow-500 to-orange-600',
                glow: 'shadow-yellow-500/25'
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-700/50 shadow-2xl ${stat.glow} hover:scale-105 transition-all duration-500`}
                data-aos="zoom-in"
                data-aos-delay={300 + index * 100}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4 group-hover:animate-bounce transition-all duration-500">{stat.icon}</div>
                  <div className={`text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-300 font-medium">{stat.label}</div>
                </div>
                {/* Animated corner decoration */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse opacity-60"></div>
              </div>
            ))}
          </div>

          {/* Ultimate Enhanced Quick Actions */}
          <div 
            className="relative mb-12 sm:mb-16"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                🚀 Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    to: "/templates",
                    icon: "🎮",
                    title: "Create New Game",
                    description: "Start building your next masterpiece",
                    color: "from-cyan-500 to-blue-600",
                    hoverColor: "from-cyan-600 to-blue-700"
                  },
                  {
                    to: "/my-games",
                    icon: "📁",
                    title: "My Games",
                    description: "Manage your game collection",
                    color: "from-purple-500 to-indigo-600",
                    hoverColor: "from-purple-600 to-indigo-700"
                  },
                  {
                    to: "/assets",
                    icon: "🖼️",
                    title: "Manage Assets",
                    description: "Organize your game resources",
                    color: "from-orange-500 to-red-600",
                    hoverColor: "from-orange-600 to-red-700"
                  }
                ].map((action, index) => (
                  <Link
                    key={index}
                    to={action.to}
                    className={`group relative overflow-hidden bg-gradient-to-r ${action.color} p-6 lg:p-8 rounded-2xl text-center font-bold transition-all duration-500 hover:scale-105 hover:shadow-2xl text-white`}
                    data-aos="zoom-in"
                    data-aos-delay={500 + index * 100}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:animate-bounce">{action.icon}</div>
                      <h3 className="text-xl lg:text-2xl font-bold mb-2">{action.title}</h3>
                      <p className="text-white/80 text-sm lg:text-base">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
            {/* Ultimate Enhanced Recent Games */}
            <div 
              className="relative"
              data-aos="fade-right"
              data-aos-delay="600"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    🎯 Recent Games
                  </h2>
                  <Link
                    to="/my-games"
                    className="group flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium transition-all duration-300 hover:scale-105"
                  >
                    View All
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
                
                {recentGames.length > 0 ? (
                  <div className="space-y-4">
                    {recentGames.map((game, index) => (
                      <div 
                        key={game._id || game.id} 
                        className="group bg-gray-700/30 rounded-2xl p-6 hover:bg-gray-600/30 transition-all duration-500 hover:scale-102 border border-gray-600/30"
                        data-aos="slide-right"
                        data-aos-delay={700 + index * 100}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-2xl">🎮</div>
                              <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors duration-300 truncate">
                                {game.title}
                              </h3>
                            </div>
                            <p className="text-gray-300 text-sm mb-3">{game.type || 'Game'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <span className="text-lg">👾</span>
                                {game.playCount || 0} plays
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-lg">❤️</span>
                                {game.likesCount || 0} likes
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span className={`px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${getStatusColor(game.status)} text-white shadow-lg`}>
                              {getStatusEmoji(game.status)} {game.status || 'draft'}
                            </span>
                            <Link
                              to={`/games/${game._id || game.id}/edit`}
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            >
                              ✏️ Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" data-aos="zoom-in">
                    <div className="text-8xl mb-6 animate-bounce">🎮</div>
                    <h3 className="text-2xl font-bold text-white mb-4">No games created yet</h3>
                    <p className="text-gray-300 mb-8 text-lg">Your gaming journey starts here!</p>
                    <Link
                      to="/templates"
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25"
                    >
                      <span className="text-2xl group-hover:animate-bounce">🚀</span>
                      Create your first game
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Ultimate Enhanced Featured Templates */}
            <div 
              className="relative"
              data-aos="fade-left"
              data-aos-delay="700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    ⭐ Featured Templates
                  </h2>
                  <Link
                    to="/templates"
                    className="group flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-all duration-300 hover:scale-105"
                  >
                    View All
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
                
                {featuredTemplates.length > 0 ? (
                  <div className="space-y-4">
                    {featuredTemplates.map((template, index) => (
                      <div 
                        key={template._id || template.id || template.name} 
                        className="group bg-gray-700/30 rounded-2xl p-6 hover:bg-gray-600/30 transition-all duration-500 hover:scale-102 border border-gray-600/30"
                        data-aos="slide-left"
                        data-aos-delay={800 + index * 100}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-2xl">📋</div>
                              <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300 truncate">
                                {template.displayName || template.name}
                              </h3>
                            </div>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">
                                {template.difficulty || 'Beginner'}
                              </span>
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium">
                                {template.category || 'Game'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <div className="text-2xl mb-1">🔥</div>
                              <div className="text-sm text-gray-400">Popular</div>
                            </div>
                            <Link
                              to={`/templates/${template.name || template._id}/customize`}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            >
                              🚀 Use
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" data-aos="zoom-in">
                    <div className="text-8xl mb-6 animate-bounce">📋</div>
                    <h3 className="text-2xl font-bold text-white mb-4">No templates available</h3>
                    <p className="text-gray-300 text-lg">Check back later for awesome templates!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Achievement Section */}
          <div 
            className="mt-12 sm:mt-16 relative"
            data-aos="fade-up"
            data-aos-delay="900"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                🏆 Your Achievements
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: '🥇', title: 'First Game', desc: 'Created your first game', unlocked: stats.gamesCreated > 0 },
                  { icon: '🔥', title: 'On Fire', desc: '5+ games created', unlocked: stats.gamesCreated >= 5 },
                  { icon: '👑', title: 'Popular Creator', desc: '100+ total plays', unlocked: stats.totalPlays >= 100 },
                  { icon: '⭐', title: 'Community Star', desc: '50+ likes received', unlocked: stats.totalLikes >= 50 }
                ].map((achievement, index) => (
                  <div 
                    key={index}
                    className={`text-center p-6 rounded-2xl border transition-all duration-500 hover:scale-105 ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/25' 
                        : 'bg-gray-700/30 border-gray-600/50'
                    }`}
                    data-aos="zoom-in"
                    data-aos-delay={1000 + index * 100}
                  >
                    <div className={`text-4xl mb-3 ${achievement.unlocked ? 'animate-bounce' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <h3 className={`font-bold mb-2 ${achievement.unlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {achievement.unlocked ? 'Unlocked' : 'Locked'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;