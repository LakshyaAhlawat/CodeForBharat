// Create: src/pages/TemplatePreview.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplateById } from '../store/slices/templateSlice';
import AOS from 'aos';

const TemplatePreview = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTemplate, isLoading, error } = useSelector((state) => state.templates);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [previewPlaying, setPreviewPlaying] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    if (templateId) {
      dispatch(fetchTemplateById(templateId));
    }

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate floating preview elements
    const generateFloatingElements = () => {
      const elements = [];
      for (let i = 0; i < 20; i++) {
        elements.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 5 + Math.random() * 8,
          icon: ['🎮', '🕹️', '👾', '🎯', '⭐', '💫', '🌟', '🚀', '⚡', '🔥'][Math.floor(Math.random() * 10)]
        });
      }
      setFloatingElements(elements);
    };

    window.addEventListener('mousemove', handleMouseMove);
    generateFloatingElements();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dispatch, templateId]);

  // Enhanced template data with fallbacks
  const getTemplateData = (templateId) => {
    const templates = {
      'platformer': {
        displayName: 'Platformer Adventure',
        description: 'Classic side-scrolling platformer with jumping mechanics, collectibles, and enemies',
        type: 'platformer',
        difficulty: 'Beginner',
        icon: '🏃‍♂️',
        color: 'from-blue-500 to-cyan-600',
        estimatedTime: '2-4 hours',
        category: 'Adventure',
        popularity: 95,
        controls: 'Arrow Keys + Space',
        genre: 'Platform Adventure',
        features: [
          'Smooth jumping mechanics',
          'Collectible items system',
          'Enemy AI behavior',
          'Multiple level progression',
          'Power-up system',
          'Checkpoint saves'
        ],
        customization: [
          'Character sprites & animations',
          'Level design & obstacles',
          'Background themes & music',
          'Game speed & physics',
          'Collectible types & effects',
          'Enemy behavior patterns'
        ],
        techFeatures: [
          'Physics-based movement',
          'Collision detection system',
          'Parallax scrolling backgrounds',
          'Responsive touch controls',
          'Local storage for progress',
          'Performance optimized rendering'
        ]
      },
      'runner': {
        displayName: 'Endless Runner',
        description: 'Fast-paced endless running game with obstacles, power-ups, and increasing difficulty',
        type: 'runner',
        difficulty: 'Beginner',
        icon: '🏃‍♀️',
        color: 'from-green-500 to-emerald-600',
        estimatedTime: '1-3 hours',
        category: 'Action',
        popularity: 88,
        controls: 'Space / Tap',
        genre: 'Endless Runner',
        features: [
          'Infinite procedural generation',
          'Progressive difficulty scaling',
          'Power-up collection system',
          'High score leaderboards',
          'Combo multiplier system',
          'Achievement unlocks'
        ],
        customization: [
          'Runner character design',
          'Obstacle types & patterns',
          'Power-up effects & visuals',
          'Environment themes',
          'Speed progression curves',
          'Audio & sound effects'
        ],
        techFeatures: [
          'Procedural level generation',
          'Smooth 60fps gameplay',
          'Touch & keyboard support',
          'Score persistence system',
          'Particle effect system',
          'Mobile-optimized performance'
        ]
      },
      'flappy': {
        displayName: 'Flappy Bird Style',
        description: 'Navigate through pipes by tapping to fly in this addictive arcade game',
        type: 'flappy',
        difficulty: 'Beginner',
        icon: '🐦',
        color: 'from-yellow-500 to-orange-600',
        estimatedTime: '1-2 hours',
        category: 'Arcade',
        popularity: 92,
        controls: 'Space / Tap',
        genre: 'Arcade Flying',
        features: [
          'Simple one-tap controls',
          'Physics-based flight',
          'Pipe obstacle generation',
          'Score tracking system',
          'Death & restart mechanics',
          'Progressive difficulty'
        ],
        customization: [
          'Bird character & animations',
          'Pipe designs & colors',
          'Background scenery',
          'Flight physics tuning',
          'Scoring system tweaks',
          'Sound effect customization'
        ],
        techFeatures: [
          'Precise collision detection',
          'Smooth physics simulation',
          'Responsive input handling',
          'Optimized rendering pipeline',
          'Cross-platform compatibility',
          'Minimal resource usage'
        ]
      },
      'shooter': {
        displayName: 'Space Shooter',
        description: 'Shoot enemies and avoid obstacles in space with power-ups and boss battles',
        type: 'shooter',
        difficulty: 'Intermediate',
        icon: '🚀',
        color: 'from-purple-500 to-pink-600',
        estimatedTime: '3-5 hours',
        category: 'Action',
        popularity: 85,
        controls: 'WASD + Mouse',
        genre: 'Space Combat',
        features: [
          'Multiple weapon systems',
          'Epic boss battles',
          'Upgrade progression',
          'Special attack combos',
          'Shield & armor systems',
          'Multiple enemy types'
        ],
        customization: [
          'Spaceship designs & stats',
          'Weapon types & effects',
          'Enemy AI & behaviors',
          'Boss battle mechanics',
          'Power-up systems',
          'Visual effects & particles'
        ],
        techFeatures: [
          'Advanced particle systems',
          'Multi-layered backgrounds',
          'Smooth projectile physics',
          'Dynamic lighting effects',
          'Audio mixing & 3D sound',
          'Scalable difficulty system'
        ]
      }
    };

    return templates[templateId] || currentTemplate || {
      displayName: 'Game Template',
      description: 'Create amazing games with this template',
      type: 'game',
      difficulty: 'Beginner',
      icon: '🎮',
      color: 'from-purple-500 to-cyan-600'
    };
  };

  const template = getTemplateData(templateId);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-yellow-500 to-orange-600';
      case 'advanced': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return '🌱';
      case 'intermediate': return '⚡';
      case 'advanced': return '🔥';
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
            <div className="relative mb-16">
              <div className="w-48 h-48 border-8 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-12"></div>
              <div className="absolute inset-0 w-48 h-48 border-8 border-cyan-500/20 border-b-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
              <div className="absolute inset-6 w-36 h-36 border-6 border-pink-500/20 border-l-pink-500 rounded-full animate-spin mx-auto" style={{ animationDuration: '3s' }}></div>
            </div>
            <h2 className="text-6xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              🎮 Loading Template Preview...
            </h2>
            <p className="text-2xl text-gray-300 mb-12">Preparing your gaming masterpiece</p>
            <div className="flex justify-center items-center gap-4 text-gray-500">
              <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce animation-delay-500"></div>
              <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !template) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-red-900 to-purple-900">
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
            <div className="absolute -bottom-8 right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
          <div className="text-center" data-aos="zoom-in">
            <div className="text-9xl mb-12 animate-bounce">😵</div>
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Template Not Found
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              {error || 'The template you requested could not be found. It might have been removed or is temporarily unavailable.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/templates"
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3"
              >
                <span className="text-2xl group-hover:animate-bounce">🎮</span>
                Back to Templates
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3"
              >
                <span className="text-2xl group-hover:animate-spin">🔄</span>
                Try Again
              </button>
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
        {/* Floating preview elements */}
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
          {/* Enhanced Back Button */}
          <div className="mb-8" data-aos="fade-right">
            <Link
              to="/templates"
              className="group inline-flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105 text-lg font-medium"
            >
              <span className="text-2xl group-hover:animate-bounce">←</span>
              Back to Templates
            </Link>
          </div>

          {/* Ultimate Enhanced Template Header */}
          <div 
            className="relative mb-12 sm:mb-16"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl overflow-hidden">
              {/* Header sparkles */}
              <div className="absolute inset-0">
                <div className="absolute top-6 left-6 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-6 left-8 w-3 h-3 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
                <div className="absolute bottom-8 right-6 w-2 h-2 bg-orange-400 rounded-full animate-ping animation-delay-3000"></div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-8">
                  {/* Enhanced Template Icon */}
                  <div className={`relative w-32 h-32 bg-gradient-to-br ${template.color} rounded-3xl flex items-center justify-center shadow-2xl group hover:scale-110 transition-all duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                    <div className="text-6xl group-hover:animate-bounce transition-all duration-500">
                      {template.icon}
                    </div>
                    {/* Popularity indicator */}
                    <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      ⭐ {template.popularity || 90}%
                    </div>
                  </div>

                  {/* Enhanced Template Info */}
                  <div className="flex-1">
                    <div className="mb-6">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                        {template.displayName}
                      </h1>
                      <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-6">
                        {template.description}
                      </p>
                    </div>

                    {/* Enhanced Template Badges */}
                    <div className="flex flex-wrap gap-4">
                      <div className={`bg-gradient-to-r ${getDifficultyColor(template.difficulty)} px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg`}>
                        <span className="text-lg">{getDifficultyIcon(template.difficulty)}</span>
                        <span>{template.difficulty}</span>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg">
                        <span className="text-lg">🎯</span>
                        <span>{template.category}</span>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg">
                        <span className="text-lg">⏱️</span>
                        <span>{template.estimatedTime}</span>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg">
                        <span className="text-lg">🎮</span>
                        <span>{template.controls}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div 
            className="relative mb-12"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex justify-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
                {[
                  { id: 'overview', label: 'Overview', icon: '📋' },
                  { id: 'features', label: 'Features', icon: '✨' },
                  { id: 'customize', label: 'Customize', icon: '🎨' },
                  { id: 'technical', label: 'Technical', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Template Preview */}
          <div 
            className="relative mb-16"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  🎮 Interactive Preview
                </h2>
                <button
                  onClick={() => setPreviewPlaying(!previewPlaying)}
                  className={`group px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 flex items-center gap-3 ${
                    previewPlaying 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  } text-white shadow-lg`}
                >
                  <span className="text-xl group-hover:animate-bounce">
                    {previewPlaying ? '⏸️' : '▶️'}
                  </span>
                  {previewPlaying ? 'Pause' : 'Play'} Demo
                </button>
              </div>
              
              {/* Enhanced Mock Game Screen */}
              <div className="relative bg-black/70 rounded-2xl p-8 mb-8 overflow-hidden">
                <div className={`aspect-video bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center relative overflow-hidden`}>
                  {/* Animated background elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
                    <div className="absolute top-8 right-12 w-6 h-6 bg-white/15 rounded-full animate-pulse animation-delay-1000"></div>
                    <div className="absolute bottom-8 left-16 w-10 h-10 bg-white/10 rounded-full animate-bounce animation-delay-2000"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 bg-white/25 rounded-full animate-pulse animation-delay-3000"></div>
                  </div>
                  
                  <div className="text-center relative z-10">
                    <div className={`text-8xl mb-6 transition-all duration-1000 ${previewPlaying ? 'animate-bounce scale-110' : ''}`}>
                      {template.icon}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">
                      {template.displayName}
                    </h3>
                    <p className="text-xl text-white/80 mb-6">
                      {previewPlaying ? '🎮 Demo is running...' : 'Click Play to see it in action!'}
                    </p>
                    {previewPlaying && (
                      <div className="flex justify-center items-center gap-4 text-white/60">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-500"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-1000"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-96">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-aos="fade-in">
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <span className="text-3xl">🎯</span>
                        Game Overview
                      </h3>
                      <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                        <p>{template.description}</p>
                        <p>Perfect for {template.difficulty?.toLowerCase()} developers looking to create engaging {template.category?.toLowerCase()} games.</p>
                        <p>This template provides a solid foundation with professional-grade features and customization options.</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <span className="text-3xl">📊</span>
                        Quick Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Difficulty', value: template.difficulty, icon: '🎚️' },
                          { label: 'Time to Build', value: template.estimatedTime, icon: '⏱️' },
                          { label: 'Category', value: template.category, icon: '🎮' },
                          { label: 'Controls', value: template.controls, icon: '🕹️' }
                        ].map((stat, index) => (
                          <div key={index} className="bg-gray-700/30 rounded-xl p-4 text-center">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                            <div className="font-bold text-white">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div data-aos="fade-in">
                    <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                      <span className="text-3xl">✨</span>
                      Included Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(template.features || [
                        'Professional game mechanics',
                        'Responsive controls',
                        'Score tracking system',
                        'Mobile-friendly design',
                        'Sound effects integration',
                        'Performance optimized'
                      ]).map((feature, index) => (
                        <div 
                          key={index}
                          className="group flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-600/30 transition-all duration-300 hover:scale-105"
                          data-aos="slide-right"
                          data-aos-delay={index * 100}
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl group-hover:animate-bounce">
                            ✓
                          </div>
                          <span className="text-lg text-white font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'customize' && (
                  <div data-aos="fade-in">
                    <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                      <span className="text-3xl">🎨</span>
                      Customization Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(template.customization || [
                        'Character appearance & animations',
                        'Game speed & difficulty settings',
                        'Background themes & colors',
                        'Sound effects & music',
                        'UI elements & styling',
                        'Game mechanics tweaking'
                      ]).map((option, index) => (
                        <div 
                          key={index}
                          className="group flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-600/30 transition-all duration-300 hover:scale-105"
                          data-aos="slide-left"
                          data-aos-delay={index * 100}
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:animate-bounce">
                            ⚙️
                          </div>
                          <span className="text-lg text-white font-medium">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'technical' && (
                  <div data-aos="fade-in">
                    <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                      <span className="text-3xl">⚙️</span>
                      Technical Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(template.techFeatures || [
                        'Cross-platform compatibility',
                        'Optimized performance',
                        'Modern JavaScript/HTML5',
                        'Responsive design system',
                        'Local storage integration',
                        'Touch & keyboard support'
                      ]).map((tech, index) => (
                        <div 
                          key={index}
                          className="group flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-600/30 transition-all duration-300 hover:scale-105"
                          data-aos="zoom-in"
                          data-aos-delay={index * 100}
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-2xl group-hover:animate-bounce">
                            🔧
                          </div>
                          <span className="text-lg text-white font-medium">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ultimate Enhanced Action Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            data-aos="zoom-in"
            data-aos-delay="500"
          >
            <Link
              to={`/templates/${templateId}/customize`}
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-3xl group-hover:animate-bounce">🚀</span>
                Customize This Template
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <button
              onClick={() => navigate('/templates')}
              className="group relative overflow-hidden bg-transparent border-2 border-white/40 hover:border-white/60 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:bg-white/10 text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-3xl group-hover:animate-bounce">🎮</span>
                Browse Other Templates
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
          </div>

          {/* Enhanced Bottom CTA */}
          <div 
            className="text-center mt-20"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-12 border border-gray-700/50 shadow-2xl">
                <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  🎯 Ready to Start Creating?
                </h3>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Join thousands of game creators who have brought their ideas to life with our professional templates!
                </p>
                <div className="flex justify-center items-center gap-8 text-lg text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    <span>50K+ Creators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎮</span>
                    <span>100K+ Games Created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span>4.9/5 Rating</span>
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

export default TemplatePreview;