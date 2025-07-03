// Home.jsx
import { Link } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  const games = [
    {
      title: "Flappy Bird",
      path: "/game/flappy",
      color: "bg-green-500",
      description: "Tap to fly through pipes and beat your high score!",
      icon: "🐦"
    },
    {
      title: "Platformer",
      path: "/game/platformer",
      color: "bg-purple-500",
      description: "Jump, dodge, and collect coins in this retro adventure.",
      icon: "🏃‍♂️"
    },
    {
      title: "Game Templates",
      path: "/templates",
      color: "bg-cyan-500",
      description: "Create your own games using our templates!",
      icon: "🎮"
    },
    {
      title: "Community",
      path: "/community",
      color: "bg-pink-500",
      description: "Play games created by our amazing community!",
      icon: "👥"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-7xl mx-auto">
          {/* Main Title */}
          <div 
            className="mb-8 sm:mb-12 lg:mb-16"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              🎮 GameZone
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto text-gray-200 leading-relaxed px-4">
              Play amazing JavaScript games, create your own masterpieces, and compete with players worldwide!
            </p>
          </div>

          {/* Stats Section */}
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20 max-w-4xl mx-auto px-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {[
              { number: "1000+", label: "Games Created", icon: "🎯" },
              { number: "5000+", label: "Active Players", icon: "👥" },
              { number: "50K+", label: "Games Played", icon: "🎮" },
              { number: "4.9★", label: "User Rating", icon: "⭐" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                data-aos="zoom-in"
                data-aos-delay={300 + index * 100}
              >
                <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-300 mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Featured Games Grid */}
          <div className="max-w-7xl mx-auto px-4">
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              🚀 Start Your Gaming Journey
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {games.map((game, index) => (
                <div
                  key={index}
                  className={`${game.color} rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white transform transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl group cursor-pointer`}
                  data-aos="flip-up"
                  data-aos-delay={500 + index * 100}
                >
                  {/* Game Icon */}
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 text-center group-hover:animate-bounce">
                    {game.icon}
                  </div>
                  
                  {/* Game Info */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-yellow-200 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                  
                  {/* Play Button */}
                  <div className="text-center">
                    <Link
                      to={game.path}
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold bg-white text-gray-800 hover:bg-yellow-200 hover:text-gray-900 transition-all duration-300 hover:scale-110 hover:shadow-lg text-sm sm:text-base"
                    >
                      Play Now 
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full group-hover:animate-ping"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/20 rounded-full group-hover:animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div 
            className="mt-16 sm:mt-20 lg:mt-24"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 mx-4 max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                Ready to Create Your Own Game? 🚀
              </h3>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-200">
                Join thousands of creators and build amazing games with our easy-to-use tools!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/templates"
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-yellow-200 transition-all duration-300 hover:scale-105 hover:shadow-xl text-center"
                >
                  Start Creating
                </Link>
                <Link
                  to="/community"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transition-all duration-300 hover:scale-105 text-center"
                >
                  Browse Games
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
