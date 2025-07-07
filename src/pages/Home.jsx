// Home.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: 'ease-out-cubic',
    });
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  const games = [
    {
      title: "Flappy Bird",
      path: "/game/flappy",
      gradient: "from-emerald-500 to-green-600",
      description: "Navigate through pipes in this addictive arcade classic!",
      icon: "🐦",
      difficulty: "Easy",
      players: "2.3K",
      category: "Arcade"
    },
    {
      title: "Platformer",
      path: "/game/platformer",
      gradient: "from-purple-500 to-indigo-600",
      description: "Jump, dodge, and collect coins in this retro adventure.",
      icon: "🏃‍♂️",
      difficulty: "Medium",
      players: "1.8K",
      category: "Adventure"
    },
    {
      title: "Game Templates",
      path: "/templates",
      gradient: "from-cyan-500 to-blue-600",
      description: "Create your own games using our powerful templates!",
      icon: "🛠️",
      difficulty: "Custom",
      players: "5.2K",
      category: "Create"
    },
    {
      title: "Community Hub",
      path: "/community",
      gradient: "from-pink-500 to-rose-600",
      description: "Discover amazing games created by our community!",
      icon: "👥",
      difficulty: "Varied",
      players: "12.5K",
      category: "Social"
    },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Instant loading with optimized performance"
    },
    {
      icon: "🎯",
      title: "Skill-Based",
      description: "Progress tracking and achievement system"
    },
    {
      icon: "🌍",
      title: "Global Community",
      description: "Connect with players from around the world"
    },
    {
      icon: "🏆",
      title: "Competitive",
      description: "Real-time leaderboards and tournaments"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Cursor Following */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-yellow-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-6000"></div>
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
        {/* Enhanced Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto text-center">
            {/* Floating particles around title */}
            <div className="relative mb-12">
              <div className="absolute -top-8 -left-8 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute -top-4 -right-12 w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-6 left-12 w-5 h-5 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute -bottom-8 -right-8 w-2 h-2 bg-yellow-400 rounded-full animate-pulse animation-delay-3000"></div>
              
              <div 
                className={`transition-all duration-1500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                data-aos="fade-down"
              >
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                  GameZone
                </h1>
                
                {/* Animated subtitle with typewriter effect */}
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-5xl mx-auto text-gray-300 leading-relaxed mb-8">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    Play, Create, Compete
                  </span>
                  <br />
                  <span className="text-lg sm:text-xl md:text-2xl">
                    The ultimate JavaScript gaming platform where creativity meets competition
                  </span>
                </div>

                {/* Live stats ticker */}
                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg px-6 py-3 rounded-full border border-white/10 mb-12">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">
                    {currentTime.toLocaleTimeString()} • Live Gaming Platform
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 max-w-6xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {[
                { number: "15K+", label: "Games Created", icon: "🎯", color: "from-cyan-500 to-blue-500" },
                { number: "50K+", label: "Active Players", icon: "👥", color: "from-purple-500 to-pink-500" },
                { number: "1M+", label: "Games Played", icon: "🎮", color: "from-green-500 to-emerald-500" },
                { number: "4.9★", label: "User Rating", icon: "⭐", color: "from-yellow-500 to-orange-500" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group relative p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-700 hover:scale-105 hover:shadow-2xl"
                  data-aos="zoom-in"
                  data-aos-delay={300 + index * 100}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-all duration-500`}></div>
                  <div className="relative z-10 text-center">
                    <div className="text-4xl lg:text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
                    <div className="text-2xl lg:text-3xl font-bold text-cyan-300 mb-2 group-hover:text-white transition-colors duration-500">{stat.number}</div>
                    <div className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20" data-aos="fade-up" data-aos-delay="400">
              <Link
                to="/games"
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center gap-3">
                  🎮 Play Now
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/templates"
                className="group relative overflow-hidden bg-transparent border-2 border-white/30 text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-all duration-300 hover:bg-white/10 hover:border-white/50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  🛠️ Create Game
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto">
            <h2 
              className="text-4xl lg:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent"
              data-aos="fade-up"
            >
              Why Choose GameZone?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-700 hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-500">{feature.title}</h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Games Grid */}
        <div className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 
              className="text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent"
              data-aos="fade-up"
            >
              🚀 Featured Games
            </h2>
            <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              Discover our most popular games or create your own masterpiece
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {games.map((game, index) => (
                <Link to={game.path} key={index}>
                  <div
                    className="group relative h-full transform transition-all duration-700 hover:scale-105"
                    data-aos="flip-up"
                    data-aos-delay={200 + index * 100}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Enhanced glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110`}></div>
                    
                    <div className={`relative h-full bg-gradient-to-br ${game.gradient} rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-700 shadow-2xl`}>
                      {/* Category badge */}
                      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
                        {game.category}
                      </div>

                      {/* Game Icon with enhanced animation */}
                      <div className={`text-6xl lg:text-7xl mb-6 text-center transform transition-all duration-500 ${hoveredCard === index ? 'scale-110 animate-bounce' : ''}`}>
                        {game.icon}
                      </div>
                      
                      {/* Game Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-yellow-200 transition-colors duration-500">
                          {game.title}
                        </h3>
                        <p className="text-white/90 leading-relaxed mb-4 group-hover:text-white transition-colors duration-500">
                          {game.description}
                        </p>
                        
                        {/* Game stats */}
                        <div className="flex justify-between items-center text-sm text-white/80 mb-6">
                          <span className="bg-white/20 px-3 py-1 rounded-full">
                            {game.difficulty}
                          </span>
                          <span className="bg-white/20 px-3 py-1 rounded-full">
                            {game.players} players
                          </span>
                        </div>
                      </div>
                      
                      {/* Enhanced Play Button */}
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-2xl border border-white/30 hover:border-white">
                          Play Now 
                          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </div>
                      </div>
                      
                      {/* Enhanced decorative elements */}
                      <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full group-hover:animate-ping"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-3 bg-white/20 rounded-full group-hover:animate-pulse"></div>
                      <div className="absolute top-1/2 left-2 w-2 h-2 bg-white/20 rounded-full group-hover:animate-bounce"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto text-center" data-aos="zoom-in" data-aos-delay="500">
            <div className="relative">
              {/* Enhanced background with multiple layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-12 lg:p-16 rounded-3xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                    Ready to Create Gaming Magic? ✨
                  </h3>
                  <p className="text-xl lg:text-2xl mb-10 text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Join our community of creators and players. Build incredible games, compete in tournaments, and become a gaming legend!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                      to="/templates"
                      className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-5 px-10 rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        🚀 Start Creating
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    
                    <Link
                      to="/community"
                      className="group relative overflow-hidden bg-transparent border-2 border-white/40 text-white font-bold py-5 px-10 rounded-full hover:scale-105 transition-all duration-300 hover:bg-white/10 hover:border-white/60"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        🌟 Explore Games
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                    </Link>
                  </div>
                  
                  {/* Social proof */}
                  <div className="mt-12 flex justify-center items-center gap-8 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>50K+ Active Players</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
                      <span>15K+ Games Created</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
                      <span>4.9★ Rating</span>
                    </div>
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

export default Home;
