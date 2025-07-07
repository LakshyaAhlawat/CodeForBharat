import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTemplates } from '../store/slices/templateSlice';
import AOS from 'aos';

const Templates = () => {
  const dispatch = useDispatch();
  const { templates, isLoading, error } = useSelector((state) => state.templates);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    dispatch(fetchTemplates());

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate floating template elements
    const generateFloatingElements = () => {
      const elements = [];
      for (let i = 0; i < 25; i++) {
        elements.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 6 + Math.random() * 8,
          icon: ['🎮', '🕹️', '👾', '🎯', '⭐', '💫', '🌟', '🚀', '⚡', '🔥', '🏆', '🎨'][Math.floor(Math.random() * 12)]
        });
      }
      setFloatingElements(elements);
    };

    window.addEventListener('mousemove', handleMouseMove);
    generateFloatingElements();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dispatch]);

  // Enhanced default templates with more details
  const defaultTemplates = [
    {
      id: 'platformer',
      name: 'platformer',
      type: 'platformer',
      displayName: 'Platformer Adventure',
      description: 'Classic side-scrolling platformer with jumping mechanics, collectibles, and enemies',
      difficulty: 'Beginner',
      estimatedTime: '2-4 hours',
      features: ['Jump mechanics', 'Collectibles', 'Enemy AI', 'Multiple levels'],
      category: 'Adventure',
      popularity: 95,
      icon: '🏃‍♂️',
      color: 'from-blue-500 to-cyan-600',
      previewImage: '/previews/platformer.jpg'
    },
    {
      id: 'runner',
      name: 'runner',
      type: 'runner',
      displayName: 'Endless Runner',
      description: 'Fast-paced endless running game with obstacles, power-ups, and increasing difficulty',
      difficulty: 'Beginner',
      estimatedTime: '1-3 hours',
      features: ['Endless gameplay', 'Power-ups', 'High scores', 'Dynamic obstacles'],
      category: 'Action',
      popularity: 88,
      icon: '🏃‍♀️',
      color: 'from-green-500 to-emerald-600',
      previewImage: '/previews/runner.jpg'
    },
    {
      id: 'flappy',
      name: 'flappy',
      type: 'flappy',
      displayName: 'Flappy Bird Style',
      description: 'Navigate through pipes by tapping to fly in this addictive arcade game',
      difficulty: 'Beginner',
      estimatedTime: '1-2 hours',
      features: ['Simple controls', 'Physics engine', 'Score system', 'Difficulty progression'],
      category: 'Arcade',
      popularity: 92,
      icon: '🐦',
      color: 'from-yellow-500 to-orange-600',
      previewImage: '/previews/flappy.jpg'
    },
    {
      id: 'shooter',
      name: 'shooter',
      type: 'shooter',
      displayName: 'Space Shooter',
      description: 'Shoot enemies and avoid obstacles in space with power-ups and boss battles',
      difficulty: 'Intermediate',
      estimatedTime: '3-5 hours',
      features: ['Multiple weapons', 'Boss battles', 'Upgrade system', 'Special effects'],
      category: 'Action',
      popularity: 85,
      icon: '🚀',
      color: 'from-purple-500 to-pink-600',
      previewImage: '/previews/shooter.jpg'
    },
    {
      id: 'puzzle',
      name: 'puzzle',
      type: 'puzzle',
      displayName: 'Match-3 Puzzle',
      description: 'Classic match-3 puzzle game with cascading effects and special combinations',
      difficulty: 'Intermediate',
      estimatedTime: '4-6 hours',
      features: ['Match mechanics', 'Special tiles', 'Level progression', 'Combo system'],
      category: 'Puzzle',
      popularity: 78,
      icon: '🧩',
      color: 'from-indigo-500 to-purple-600',
      previewImage: '/previews/puzzle.jpg'
    },
    {
      id: 'racing',
      name: 'racing',
      type: 'racing',
      displayName: 'Racing Game',
      description: 'High-speed racing with multiple tracks, cars, and competitive gameplay',
      difficulty: 'Advanced',
      estimatedTime: '5-8 hours',
      features: ['Multiple tracks', 'Car selection', 'Time trials', 'Multiplayer ready'],
      category: 'Racing',
      popularity: 82,
      icon: '🏎️',
      color: 'from-red-500 to-orange-600',
      previewImage: '/previews/racing.jpg'
    }
  ];

  const templatesToShow = Array.isArray(templates) && templates.length > 0 ? templates : defaultTemplates;

  // Filter and search functionality
  const categories = ['all', 'Action', 'Adventure', 'Arcade', 'Puzzle', 'Racing'];
  
  const filteredTemplates = templatesToShow.filter(template => {
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesSearch = template.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-emerald-600';
      case 'Intermediate': return 'from-yellow-500 to-orange-600';
      case 'Advanced': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '🌱';
      case 'Intermediate': return '⚡';
      case 'Advanced': return '🔥';
      default: return '📋';
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
              <div className="w-40 h-40 border-8 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-8"></div>
              <div className="absolute inset-0 w-40 h-40 border-8 border-cyan-500/20 border-b-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
              <div className="absolute inset-4 w-32 h-32 border-4 border-pink-500/20 border-l-pink-500 rounded-full animate-spin mx-auto" style={{ animationDuration: '3s' }}></div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              🎨 Loading Templates...
            </h2>
            <p className="text-2xl text-gray-300 mb-12">Preparing amazing game templates for you</p>
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
        {/* Floating template elements */}
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Ultimate Enhanced Header */}
          <div className="text-center mb-16 sm:mb-20" data-aos="fade-down">
            <div className="relative inline-block mb-12">
              {/* Floating header particles */}
              <div className="absolute -top-12 -left-12 w-6 h-6 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute -top-8 -right-16 w-4 h-4 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-10 left-16 w-8 h-8 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute -bottom-12 -right-12 w-3 h-3 bg-orange-400 rounded-full animate-pulse animation-delay-3000"></div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                🎨 Game Templates
              </h1>
              
              <div className="text-2xl sm:text-3xl lg:text-4xl max-w-4xl mx-auto text-gray-300 leading-relaxed">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold">
                  Choose Your Adventure • Create Your Legend
                </span>
                <br />
                <span className="text-lg sm:text-xl lg:text-2xl">
                  Professional game templates to jumpstart your creativity
                </span>
              </div>
            </div>

            {/* Enhanced decorative separator */}
            <div className="flex items-center justify-center mb-12">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="w-12 h-12 mx-6 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full animate-ping"></div>
              </div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div 
            className="relative mb-16 sm:mb-20"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
              <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                🔍 Find Your Perfect Template
              </h3>
              
              {/* Search Bar */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search templates by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 ${
                      filterCategory === category
                        ? "bg-gradient-to-r from-purple-500 to-cyan-600 text-white shadow-2xl shadow-purple-500/25"
                        : "bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-300 hover:from-gray-600/70 hover:to-gray-700/70 border border-gray-600/50"
                    }`}
                  >
                    {category === 'all' ? '🌟 All Templates' : `🎮 ${category}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Error Display */}
          {error && (
            <div 
              className="relative mb-12"
              data-aos="shake"
            >
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="text-3xl animate-bounce">⚠️</div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">Using Default Templates</h3>
                    <p className="text-yellow-200">Server temporarily unavailable, but you can still create amazing games!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ultimate Enhanced Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
            {filteredTemplates.map((template, index) => (
              <div 
                key={template.id || template.name}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl hover:scale-105 transition-all duration-500"
                data-aos="zoom-in"
                data-aos-delay={300 + index * 100}
                onMouseEnter={() => setHoveredTemplate(template.id || template.name)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                {/* Template sparkles */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                  <div className="absolute top-6 right-6 w-1 h-1 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
                  <div className="absolute bottom-4 left-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
                  <div className="absolute bottom-6 right-4 w-1 h-1 bg-orange-400 rounded-full animate-ping animation-delay-3000"></div>
                </div>

                {/* Enhanced Preview Image */}
                <div className={`relative h-64 bg-gradient-to-br ${template.color || 'from-purple-500 to-cyan-600'} rounded-t-3xl flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className={`text-8xl transform transition-all duration-500 ${
                    hoveredTemplate === (template.id || template.name) ? 'scale-125 animate-bounce' : ''
                  }`}>
                    {template.icon || '🎮'}
                  </div>
                  
                  {/* Popularity Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1 flex items-center gap-2">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="text-white font-bold">{template.popularity || 90}%</span>
                  </div>

                  {/* Difficulty Badge */}
                  <div className={`absolute top-4 left-4 bg-gradient-to-r ${getDifficultyColor(template.difficulty)} rounded-xl px-3 py-1 flex items-center gap-2`}>
                    <span className="text-lg">{getDifficultyIcon(template.difficulty)}</span>
                    <span className="text-white font-bold text-sm">{template.difficulty || 'Beginner'}</span>
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-6 lg:p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-white group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-500">
                      {template.displayName}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      {template.description}
                    </p>
                    
                    {/* Category and Time */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        🎯 {template.category || template.type}
                      </span>
                      <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
                        ⏱️ {template.estimatedTime || '2-4 hours'}
                      </span>
                    </div>

                    {/* Features List */}
                    {template.features && (
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-white mb-3">✨ Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {template.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="space-y-3">
                    <Link
                      to={`/templates/${template.id || template.name}/customize`}
                      className="group w-full bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center gap-3"
                    >
                      <span className="text-2xl group-hover:animate-bounce">🚀</span>
                      <span className="text-lg">Create Game</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                    
                    <Link
                      to={`/templates/${template.id || template.name}/preview`}
                      className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <span className="text-xl group-hover:animate-bounce">👁️</span>
                      <span>Preview Template</span>
                    </Link>
                  </div>
                </div>

                {/* Hover Overlay */}
                {hoveredTemplate === (template.id || template.name) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-20" data-aos="zoom-in">
              <div className="text-9xl mb-8 animate-bounce">🔍</div>
              <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                No templates found
              </h3>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Try adjusting your search terms or category filters to find the perfect template for your game!
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                }}
                className="group bg-gradient-to-r from-purple-500 to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                🔄 Reset Filters
              </button>
            </div>
          )}

          {/* Enhanced Bottom CTA */}
          <div 
            className="text-center mt-20 sm:mt-24"
            data-aos="fade-up"
            data-aos-delay="900"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-gray-700/50 shadow-2xl overflow-hidden">
                {/* CTA sparkles */}
                <div className="absolute inset-0">
                  <div className="absolute top-8 left-8 w-4 h-4 bg-orange-400 rounded-full animate-ping"></div>
                  <div className="absolute top-12 right-12 w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-1000"></div>
                  <div className="absolute bottom-8 left-16 w-4 h-4 bg-purple-400 rounded-full animate-bounce animation-delay-2000"></div>
                  <div className="absolute bottom-4 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping animation-delay-3000"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Can't Find What You're Looking For? 🤔
                  </h3>
                  <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                    Request a custom template or start from scratch with our powerful game editor! Your imagination is the only limit.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                      to="/contact"
                      className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-6 px-12 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        💬 Request Template
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <Link
                      to="/editor"
                      className="group relative overflow-hidden bg-transparent border-2 border-white/40 text-white font-bold py-6 px-12 rounded-2xl hover:scale-105 transition-all duration-300 hover:bg-white/10 hover:border-white/60"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        🛠️ Start From Scratch
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
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

export default Templates;