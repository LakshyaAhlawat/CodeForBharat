import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishedGames } from "../store/slices/gameSlice";
import { Link } from "react-router-dom";
import AOS from "aos";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { publishedGames, isLoading } = useSelector((state) => state.games);
  const [sortBy, setSortBy] = useState("mostPlayed");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-out-cubic",
    });
    dispatch(fetchPublishedGames());

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate confetti particles
    const generateConfetti = () => {
      const particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          emoji: ['🎉', '🏆', '⭐', '🎮', '🥇', '💫', '🌟'][Math.floor(Math.random() * 7)]
        });
      }
      setConfetti(particles);
    };

    window.addEventListener('mousemove', handleMouseMove);
    generateConfetti();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dispatch]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getGameIcon = (type) => {
    switch (type) {
      case "platformer": return "🏃‍♂️";
      case "runner": return "🏃‍♀️";
      case "flappy": return "🐦";
      case "shooter": return "🚀";
      case "puzzle": return "🧩";
      case "racing": return "🏎️";
      case "adventure": return "⚔️";
      default: return "🎮";
    }
  };

  const getTrophyIcon = (rank) => {
    if (rank <= 3) return "👑";
    if (rank <= 10) return "🏆";
    if (rank <= 20) return "🎖️";
    return "🏅";
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-400 via-yellow-500 to-yellow-600";
    if (rank === 2) return "from-gray-300 via-gray-400 to-gray-500";
    if (rank === 3) return "from-orange-400 via-orange-500 to-orange-600";
    if (rank <= 10) return "from-purple-400 via-purple-500 to-purple-600";
    return "from-blue-400 via-blue-500 to-blue-600";
  };

  const getRankGlow = (rank) => {
    if (rank === 1) return "shadow-yellow-500/50";
    if (rank === 2) return "shadow-gray-400/50";
    if (rank === 3) return "shadow-orange-500/50";
    if (rank <= 10) return "shadow-purple-500/50";
    return "shadow-blue-500/50";
  };

  const sortedGames = [...publishedGames].sort((a, b) => {
    switch (sortBy) {
      case "mostPlayed":
        return (b.playCount || 0) - (a.playCount || 0);
      case "mostLiked":
        return (b.likesCount || 0) - (a.likesCount || 0);
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "rating":
        return (b.averageRating || 0) - (a.averageRating || 0);
      default:
        return 0;
    }
  });

  const topGames = sortedGames.slice(0, 3);

  const getStatValue = (game, type) => {
    switch (type) {
      case "mostPlayed":
        return (game.playCount || 0).toLocaleString();
      case "mostLiked":
        return (game.likesCount || 0).toLocaleString();
      case "rating":
        return (game.averageRating || 0).toFixed(1);
      case "newest":
        return new Date(game.createdAt).toLocaleDateString();
      default:
        return 0;
    }
  };

  const getStatLabel = (type) => {
    switch (type) {
      case "mostPlayed": return "plays";
      case "mostLiked": return "likes";
      case "rating": return "⭐ rating";
      case "newest": return "created";
      default: return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra Enhanced Loading Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-yellow-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-12">
              <div className="w-40 h-40 border-8 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-8"></div>
              <div className="absolute inset-0 w-40 h-40 border-8 border-cyan-500/20 border-b-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
              <div className="absolute inset-4 w-32 h-32 border-4 border-pink-500/20 border-l-pink-500 rounded-full animate-spin mx-auto" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-8 w-24 h-24 border-4 border-purple-500/30 border-r-purple-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              🏆 Loading Championship...
            </h2>
            <p className="text-2xl text-gray-300 mb-12">Calculating the ultimate rankings</p>
            <div className="flex justify-center items-center gap-3 text-gray-500">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce animation-delay-500"></div>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce animation-delay-1000"></div>
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
        {/* Floating confetti particles */}
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-2xl animate-bounce opacity-60"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
        
        {/* Multi-layer animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-yellow-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-orange-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-6000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-8000"></div>
        </div>
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Advanced mouse follower gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-yellow-500/20 to-transparent rounded-full pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        
        {/* Secondary mouse follower */}
        <div 
          className="absolute w-64 h-64 bg-gradient-radial from-orange-500/15 to-transparent rounded-full pointer-events-none transition-all duration-1500 ease-out"
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
              {/* Floating champion particles */}
              <div className="absolute -top-16 -left-16 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -top-12 -right-20 w-6 h-6 bg-orange-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-14 left-20 w-10 h-10 bg-red-400 rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute -bottom-16 -right-16 w-4 h-4 bg-pink-400 rounded-full animate-pulse animation-delay-3000"></div>
              <div className="absolute top-6 -left-24 w-6 h-6 bg-cyan-400 rounded-full animate-bounce animation-delay-4000"></div>
              <div className="absolute bottom-6 right-24 w-5 h-5 bg-purple-400 rounded-full animate-ping animation-delay-5000"></div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent tracking-tight animate-pulse">
                🏆 Championship Leaderboard
              </h1>
              
              {/* Animated subtitle with enhanced effects */}
              <div className="text-3xl sm:text-4xl lg:text-5xl max-w-6xl mx-auto text-gray-300 leading-relaxed mb-8">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent font-bold animate-pulse">
                  🥇 Champions • 🏆 Heroes • ⭐ Legends
                </span>
                <br />
                <span className="text-xl sm:text-2xl lg:text-3xl">
                  Where gaming greatness is immortalized forever
                </span>
              </div>
            </div>
            
            {/* Enhanced decorative separator */}
            <div className="flex items-center justify-center mb-12">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              <div className="w-12 h-12 mx-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full animate-ping"></div>
              </div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            </div>
          </div>

          {/* Ultimate Enhanced Filter Section */}
          <div 
            className="relative mb-20 sm:mb-24"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
              <h3 className="text-3xl lg:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                🎯 Championship Categories
              </h3>
              
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { key: "mostPlayed", label: "Most Played", icon: "👾", description: "Play Masters" },
                  { key: "mostLiked", label: "Most Loved", icon: "❤️", description: "Fan Favorites" },
                  { key: "rating", label: "Highest Rated", icon: "⭐", description: "Quality Kings" },
                  { key: "newest", label: "Fresh Talents", icon: "🆕", description: "Rising Stars" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSortBy(filter.key)}
                    className={`group relative overflow-hidden px-8 py-6 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${
                      sortBy === filter.key
                        ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-2xl shadow-yellow-500/25 scale-105"
                        : "bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-300 hover:from-gray-600/70 hover:to-gray-700/70 border border-gray-600/50"
                    }`}
                  >
                    <div className="relative z-10 text-center">
                      <div className="text-4xl mb-3 group-hover:animate-bounce">{filter.icon}</div>
                      <div className="text-lg font-bold mb-1">{filter.label}</div>
                      <div className="text-sm opacity-80">{filter.description}</div>
                    </div>
                    {sortBy === filter.key && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ultra Enhanced Top 3 Podium */}
          {topGames.length > 0 && (
            <div className="mb-20 sm:mb-24" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                🌟 Hall of Legends
              </h2>

              {/* Desktop: Enhanced Podium Layout */}
              <div className="hidden md:flex items-end justify-center gap-8 lg:gap-12 mb-16">
                {/* 2nd Place */}
                {topGames[1] && (
                  <div
                    className="group text-center transform transition-all duration-700 hover:scale-110"
                    data-aos="zoom-in"
                    data-aos-delay="500"
                    onMouseEnter={() => setHoveredCard(2)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`relative bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-t-3xl p-8 lg:p-12 mb-6 shadow-2xl ${getRankGlow(2)} hover:shadow-3xl transition-all duration-700`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-t-3xl"></div>
                      <div className="relative z-10">
                        <div className={`text-6xl mb-6 ${hoveredCard === 2 ? 'animate-bounce scale-125' : ''} transition-all duration-500`}>
                          👑
                        </div>
                        <div className="text-7xl mb-6 animate-pulse">🥈</div>
                        <div className="text-6xl mb-6">{getGameIcon(topGames[1].type)}</div>
                        <h3 className="font-bold text-2xl mb-4 text-white line-clamp-1">
                          {topGames[1].title}
                        </h3>
                        <p className="text-lg opacity-90 mb-4 text-gray-100">
                          by {topGames[1].user?.username}
                        </p>
                        <div className="text-3xl font-bold text-white">
                          {getStatValue(topGames[1], sortBy)}
                          <div className="text-sm mt-1 opacity-80">
                            {getStatLabel(sortBy)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-gray-400 to-gray-600 h-32 rounded-b-xl shadow-xl"></div>
                  </div>
                )}

                {/* 1st Place - THE CHAMPION */}
                {topGames[0] && (
                  <div
                    className="group text-center transform transition-all duration-700 hover:scale-110"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                    onMouseEnter={() => setHoveredCard(1)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-t-3xl p-12 lg:p-16 mb-6 shadow-2xl ${getRankGlow(1)} hover:shadow-3xl transition-all duration-700 overflow-hidden`}>
                      {/* Champion sparkles */}
                      <div className="absolute inset-0">
                        <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full animate-ping"></div>
                        <div className="absolute top-8 right-6 w-2 h-2 bg-white rounded-full animate-pulse animation-delay-1000"></div>
                        <div className="absolute bottom-6 left-8 w-4 h-4 bg-white rounded-full animate-bounce animation-delay-2000"></div>
                        <div className="absolute bottom-4 right-4 w-2 h-2 bg-white rounded-full animate-ping animation-delay-3000"></div>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-t-3xl"></div>
                      <div className="relative z-10">
                        <div className={`text-8xl mb-8 ${hoveredCard === 1 ? 'animate-bounce scale-125' : 'animate-pulse'} transition-all duration-500`}>
                          👑
                        </div>
                        <div className="text-9xl mb-8 animate-pulse">🥇</div>
                        <div className="text-8xl mb-8">{getGameIcon(topGames[0].type)}</div>
                        <h3 className="font-bold text-3xl mb-6 text-white line-clamp-1 drop-shadow-lg">
                          {topGames[0].title}
                        </h3>
                        <p className="text-xl opacity-90 mb-6 text-gray-100">
                          by {topGames[0].user?.username}
                        </p>
                        <div className="text-4xl font-bold text-white drop-shadow-lg">
                          {getStatValue(topGames[0], sortBy)}
                          <div className="text-lg mt-2 opacity-90">
                            {getStatLabel(sortBy)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-yellow-500 to-yellow-700 h-40 rounded-b-xl shadow-xl"></div>
                  </div>
                )}

                {/* 3rd Place */}
                {topGames[2] && (
                  <div
                    className="group text-center transform transition-all duration-700 hover:scale-110"
                    data-aos="zoom-in"
                    data-aos-delay="600"
                    onMouseEnter={() => setHoveredCard(3)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-t-3xl p-8 lg:p-12 mb-6 shadow-2xl ${getRankGlow(3)} hover:shadow-3xl transition-all duration-700`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-t-3xl"></div>
                      <div className="relative z-10">
                        <div className={`text-6xl mb-6 ${hoveredCard === 3 ? 'animate-bounce scale-125' : ''} transition-all duration-500`}>
                          👑
                        </div>
                        <div className="text-7xl mb-6 animate-pulse">🥉</div>
                        <div className="text-6xl mb-6">{getGameIcon(topGames[2].type)}</div>
                        <h3 className="font-bold text-2xl mb-4 text-white line-clamp-1">
                          {topGames[2].title}
                        </h3>
                        <p className="text-lg opacity-90 mb-4 text-gray-100">
                          by {topGames[2].user?.username}
                        </p>
                        <div className="text-3xl font-bold text-white">
                          {getStatValue(topGames[2], sortBy)}
                          <div className="text-sm mt-1 opacity-80">
                            {getStatLabel(sortBy)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-orange-500 to-orange-700 h-28 rounded-b-xl shadow-xl"></div>
                  </div>
                )}
              </div>

              {/* Mobile: Enhanced Vertical Layout */}
              <div className="block md:hidden space-y-6">
                {topGames.map((game, index) => (
                  <div
                    key={game._id}
                    className={`relative bg-gradient-to-r ${getRankColor(index + 1)} rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-500 shadow-2xl ${getRankGlow(index + 1)} overflow-hidden`}
                    data-aos="zoom-in"
                    data-aos-delay={400 + index * 100}
                  >
                    {/* Mobile sparkles for champion */}
                    {index === 0 && (
                      <div className="absolute inset-0">
                        <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-1000"></div>
                        <div className="absolute bottom-3 left-4 w-2 h-2 bg-white rounded-full animate-bounce animation-delay-2000"></div>
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 animate-bounce">{getTrophyIcon(index + 1)}</div>
                      <div className="text-6xl mb-4">{getRankIcon(index + 1)}</div>
                      <div className="text-5xl mb-4">{getGameIcon(game.type)}</div>
                      <h3 className="font-bold text-2xl mb-3 text-white line-clamp-1">
                        {game.title}
                      </h3>
                      <p className="text-lg opacity-90 mb-4 text-gray-100">by {game.user?.username}</p>
                      <div className="text-3xl font-bold text-white">
                        {getStatValue(game, sortBy)}
                        <div className="text-sm mt-1 opacity-80">
                          {getStatLabel(sortBy)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ultimate Enhanced Rankings Table */}
          <div
            className="relative"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
              <div className="p-8 lg:p-12 border-b border-gray-700/50 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                <h2 className="text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  📊 Complete Championship Rankings
                </h2>
              </div>

              <div className="divide-y divide-gray-700/50">
                {sortedGames.length === 0 ? (
                  <div className="p-16 text-center" data-aos="fade-up">
                    <div className="text-9xl mb-8 animate-bounce">🏆</div>
                    <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Championship Awaits
                    </h3>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                      Be the first legend to claim the throne and start the ultimate gaming championship!
                    </p>
                    <Link
                      to="/templates"
                      className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-6 px-12 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/25"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        🚀 Start Your Legend
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                ) : (
                  sortedGames.map((game, index) => (
                    <div
                      key={game._id}
                      className="group p-6 lg:p-8 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-500 border-l-4 border-transparent hover:border-purple-500"
                      data-aos="slide-right"
                      data-aos-delay={Math.min(800 + index * 50, 1500)}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        {/* Enhanced Rank Section */}
                        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
                          <div className={`relative text-4xl lg:text-5xl font-bold min-w-[80px] lg:min-w-[100px] text-center bg-gradient-to-r ${getRankColor(index + 1)} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500`}>
                            {getRankIcon(index + 1)}
                            {index < 3 && (
                              <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
                                ✨
                              </div>
                            )}
                          </div>
                          <div className="text-4xl lg:text-5xl group-hover:animate-bounce transition-all duration-500">
                            {getTrophyIcon(index + 1)}
                          </div>
                          <div className="text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-500">
                            {getGameIcon(game.type)}
                          </div>
                        </div>

                        {/* Enhanced Game Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl lg:text-3xl font-bold mb-3 line-clamp-1 group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                            {game.title}
                          </h3>
                          <p className="text-gray-300 text-lg mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors duration-500">
                            {game.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full">
                              <span className="text-lg">👤</span>
                              by {game.user?.username || "Unknown"}
                            </span>
                            <span className="capitalize bg-gray-700/50 px-3 py-1 rounded-full">
                              {game.type}
                            </span>
                            <span className="bg-gray-700/50 px-3 py-1 rounded-full">
                              {new Date(game.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Enhanced Stats Section */}
                        <div className="text-center lg:text-right min-w-[140px]">
                          <div className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${getRankColor(index + 1)} bg-clip-text text-transparent`}>
                            {getStatValue(game, sortBy)}
                          </div>
                          <div className="text-sm text-gray-300 mb-4">
                            {getStatLabel(sortBy)}
                          </div>

                          {/* Additional Enhanced Stats */}
                          <div className="grid grid-cols-3 gap-3 text-xs text-gray-400 mb-4">
                            <div className="text-center">
                              <div className="text-lg mb-1">👾</div>
                              <div className="font-bold text-cyan-400">
                                {(game.playCount || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg mb-1">❤️</div>
                              <div className="font-bold text-pink-400">
                                {(game.likesCount || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg mb-1">⭐</div>
                              <div className="font-bold text-yellow-400">
                                {(game.averageRating || 0).toFixed(1)}
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Action Buttons */}
                          <div className="flex gap-3">
                            <Link
                              to={`/games/${game._id}/play`}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
                            >
                              ▶️ Play
                            </Link>
                            <Link
                              to={`/games/${game._id}/reviews`}
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
                            >
                              💬 Reviews
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Ultimate Enhanced Bottom CTA */}
          <div
            className="text-center mt-20 sm:mt-24"
            data-aos="fade-up"
            data-aos-delay="900"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-gray-700/50 shadow-2xl overflow-hidden">
                {/* CTA sparkles */}
                <div className="absolute inset-0">
                  <div className="absolute top-8 left-8 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute top-12 right-12 w-3 h-3 bg-orange-400 rounded-full animate-pulse animation-delay-1000"></div>
                  <div className="absolute bottom-8 left-16 w-4 h-4 bg-red-400 rounded-full animate-bounce animation-delay-2000"></div>
                  <div className="absolute bottom-4 right-8 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-3000"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Ready to Become a Legend? 🚀
                  </h3>
                  <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                    Join the elite ranks of gaming champions! Create your masterpiece and claim your throne in the ultimate gaming championship!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                      to="/templates"
                      className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-6 px-12 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/25"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        🏆 Create Championship Game
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <Link
                      to="/community"
                      className="group relative overflow-hidden bg-transparent border-2 border-white/40 text-white font-bold py-6 px-12 rounded-2xl hover:scale-105 transition-all duration-300 hover:bg-white/10 hover:border-white/60"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        🌟 Explore Community
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default Leaderboard;
