import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';

// ✅ Import images correctly from src/assets/
import shubhamImg from '../assets/shubham.jpg';
import lakImg from '../assets/lak.jpg';
import shriyaImg from '../assets/shriya.jpg';
import shabImg from '../assets/shab.jpg';

const team = [
  {
    name: "Shubham Tandon",
    role: "Frontend Developer",
    image: shubhamImg,
    bio: "Crafting beautiful user interfaces with React and Tailwind CSS. Specialized in responsive design and user experience optimization.",
    skills: ["React", "Tailwind CSS", "JavaScript", "UI/UX"],
    color: "from-blue-500 to-purple-600",
    accent: "blue",
    github: "#",
    linkedin: "#"
  },
  {
    name: "Lakshya Ahlawat",
    role: "Backend Developer",
    image: lakImg,
    bio: "Building robust APIs and database architectures. Expert in Node.js, Express, and MongoDB for scalable backend solutions.",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
    color: "from-green-500 to-teal-600",
    accent: "green",
    github: "#",
    linkedin: "#"
  },
  {
    name: "Shriya Devarakonda",
    role: "Game Developer",
    image: shriyaImg,
    bio: "Creating engaging game experiences with JavaScript and Phaser.js. Passionate about game mechanics and interactive storytelling.",
    skills: ["Phaser.js", "JavaScript", "Game Logic", "Canvas"],
    color: "from-pink-500 to-rose-600",
    accent: "pink",
    github: "#",
    linkedin: "#"
  },
  {
    name: "Shabdgya Jha",
    role: "Frontend & QA",
    image: shabImg,
    bio: "Ensuring quality through comprehensive testing and beautiful design. Expert in component design and cross-browser compatibility.",
    skills: ["Testing", "QA", "React", "Design"],
    color: "from-amber-500 to-orange-600",
    accent: "amber",
    github: "#",
    linkedin: "#"
  },
];

const techStack = [
  { 
    name: "Frontend", 
    tech: "React, Tailwind CSS, React Router",
    icon: "⚛️",
    color: "from-cyan-400 to-blue-500",
    description: "Modern UI frameworks"
  },
  { 
    name: "Games", 
    tech: "JavaScript + Phaser.js",
    icon: "🎮",
    color: "from-purple-400 to-pink-500",
    description: "Interactive game engines"
  },
  { 
    name: "Backend", 
    tech: "Node.js, Express.js",
    icon: "🚀",
    color: "from-green-400 to-emerald-500",
    description: "Server-side technologies"
  },
  { 
    name: "Database", 
    tech: "MongoDB",
    icon: "🗄️",
    color: "from-yellow-400 to-orange-500",
    description: "NoSQL data storage"
  },
  { 
    name: "Deployment", 
    tech: "Vercel + Render",
    icon: "☁️",
    color: "from-indigo-400 to-purple-500",
    description: "Cloud hosting platforms"
  },
  { 
    name: "Authentication", 
    tech: "JWT, Redux",
    icon: "🔐",
    color: "from-red-400 to-pink-500",
    description: "Secure user management"
  }
];

const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: 'ease-out-cubic'
    });
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStartGaming = () => {
    navigate('/games');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🌟 Enhanced Background with Darker Base */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Animated background elements - More subtle */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Mouse follower gradient - More subtle */}
        <div 
          className="absolute w-80 h-80 bg-gradient-radial from-blue-500/5 to-transparent rounded-full pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 160,
            top: mousePosition.y - 160,
          }}
        />
      </div>

      <div className="relative z-10 text-white px-4 sm:px-6 lg:px-8 py-16">
        {/* 🎯 Enhanced Hero Section */}
        <div className="text-center mb-24">
          <div 
            className={`transition-all duration-1500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {/* Floating particles around title */}
            <div className="relative inline-block">
              <div className="absolute -top-4 -left-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-4 left-8 w-4 h-4 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                About CodeToGame
              </h1>
            </div>
            
            <div className="flex items-center justify-center mb-10">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="w-6 h-6 mx-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
            
            <p className="text-xl md:text-2xl max-w-5xl mx-auto text-gray-300 leading-relaxed font-light">
              A revolutionary browser-based gaming platform where developers showcase their creativity 
              through interactive JavaScript games, compete in real-time, and build a thriving gaming community.
            </p>
            
            {/* Scroll indicator */}
            <div className="mt-16 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto">
                <div className="w-1 h-3 bg-gray-400 rounded-full mx-auto mt-2 animate-pulse"></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">Scroll to explore</p>
            </div>
          </div>
        </div>

        {/* 🎮 Enhanced Project Features */}
        <div className="max-w-7xl mx-auto mb-24" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
            🚀 What Makes Us Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Multi-Game Platform",
                desc: "Play various JavaScript games including Flappy Bird, Platformer, and more in one place.",
                gradient: "from-purple-600/20 to-pink-600/20",
                border: "border-purple-500/30"
              },
              {
                icon: "🏆",
                title: "Global Leaderboard",
                desc: "Compete with players worldwide and track your progress across all games.",
                gradient: "from-blue-600/20 to-cyan-600/20",
                border: "border-blue-500/30"
              },
              {
                icon: "👥",
                title: "Community Driven",
                desc: "Connect with fellow gamers, share strategies, and build lasting friendships.",
                gradient: "from-green-600/20 to-emerald-600/20",
                border: "border-green-500/30"
              },
              {
                icon: "📱",
                title: "Responsive Design",
                desc: "Seamless gaming experience across desktop, tablet, and mobile devices.",
                gradient: "from-orange-600/20 to-red-600/20",
                border: "border-orange-500/30"
              },
              {
                icon: "⚡",
                title: "Real-time Updates",
                desc: "Live score tracking and instant leaderboard updates for competitive gaming.",
                gradient: "from-indigo-600/20 to-purple-600/20",
                border: "border-indigo-500/30"
              },
              {
                icon: "🔒",
                title: "Secure Authentication",
                desc: "Safe and secure user accounts with JWT-based authentication system.",
                gradient: "from-pink-600/20 to-rose-600/20",
                border: "border-pink-500/30"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group relative p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border ${feature.border} hover:border-white/30 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10`}
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-500">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🧰 Enhanced Tech Stack Section */}
        <div className="max-w-7xl mx-auto mb-24" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            🧰 Our Tech Arsenal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-700 hover:scale-105 hover:shadow-xl"
                data-aos="flip-left"
                data-aos-delay={idx * 100}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`}></div>
                <div className="relative z-10 text-center">
                  <div className={`text-6xl mb-6 transform transition-all duration-500 ${hoveredCard === idx ? 'scale-125 rotate-12' : ''}`}>{tech.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-500">{tech.name}</h3>
                  <p className="text-gray-300 text-sm mb-2 group-hover:text-gray-200 transition-colors duration-500">{tech.tech}</p>
                  <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-500">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 👥 Enhanced Team Section with Darker, More Elegant Cards */}
        <div className="max-w-7xl mx-auto mb-24">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-20 text-center bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            👥 Meet Our Amazing Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="group relative"
                data-aos="fade-up"
                data-aos-delay={idx * 150}
              >
                {/* Enhanced card with darker theme */}
                <div className="relative transform transition-all duration-700 hover:scale-105">
                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${member.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-110`}></div>
                  
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-700 shadow-2xl">
                    {/* Profile Image with enhanced styling */}
                    <div className="relative mb-8">
                      <div className={`absolute inset-0 bg-gradient-to-r ${member.color} rounded-full blur-md opacity-30 group-hover:opacity-50 transition-all duration-700`}></div>
                      <div className="relative w-28 h-28 mx-auto">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full border-4 border-gray-600/50 group-hover:border-gray-500/70 transition-all duration-700 shadow-xl"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.fallback-avatar').style.display = 'flex';
                          }}
                        />
                        {/* Enhanced fallback avatar */}
                        <div className={`fallback-avatar w-full h-full bg-gradient-to-br ${member.color} rounded-full border-4 border-gray-600/50 hidden items-center justify-center text-3xl font-bold text-white shadow-xl`}>
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      
                      {/* Status indicator */}
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-800 animate-pulse"></div>
                    </div>

                    {/* Enhanced Member Info */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2 text-white group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-700">
                        {member.name}
                      </h3>
                      <p className={`text-sm font-semibold mb-4 bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                        {member.role}
                      </p>
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
                        {member.bio}
                      </p>

                      {/* Enhanced Skills with better spacing */}
                      <div className="flex flex-wrap gap-2 mb-6 justify-center">
                        {member.skills.map((skill, skillIdx) => (
                          <span
                            key={skillIdx}
                            className="px-3 py-1.5 text-xs font-medium bg-gray-700/70 text-gray-200 rounded-full border border-gray-600/50 hover:bg-gray-600/70 hover:border-gray-500/70 transition-all duration-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Enhanced Social Links */}
                      <div className="flex justify-center space-x-4">
                        <a
                          href={member.github}
                          className="w-12 h-12 bg-gray-700/50 hover:bg-gray-600/70 border border-gray-600/50 hover:border-gray-500/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        >
                          <span className="text-white text-lg">📧</span>
                        </a>
                        <a
                          href={member.linkedin}
                          className="w-12 h-12 bg-gray-700/50 hover:bg-gray-600/70 border border-gray-600/50 hover:border-gray-500/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        >
                          <span className="text-blue-400 text-lg">💼</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 Enhanced Call to Action */}
        <div className="text-center" data-aos="zoom-in" data-aos-delay="500">
          <div className="relative inline-block">
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-12 rounded-3xl border border-gray-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Ready to Join the Adventure?
                </h3>
                <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Start playing, compete with others, and become a gaming legend in our incredible community!
                </p>
                <button 
                  onClick={handleStartGaming}
                  className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Gaming Now 
                    <span className="text-2xl group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
