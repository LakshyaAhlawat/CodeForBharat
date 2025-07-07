// src/pages/TemplateCustomize.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createGameFromTemplate } from '../store/slices/templateSlice';
import { toast } from 'react-hot-toast';
import AOS from 'aos';

const TemplateCustomize = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isCreating, error } = useSelector((state) => state.templates);
  
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    customizations: {}
  });

  const [template, setTemplate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);
  const [activeSection, setActiveSection] = useState('details');
  const [previewAnimation, setPreviewAnimation] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate floating creation elements
    const generateFloatingElements = () => {
      const elements = [];
      for (let i = 0; i < 20; i++) {
        elements.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 6 + Math.random() * 8,
          icon: ['🎨', '⚡', '🚀', '✨', '🎮', '🔧', '💫', '🌟', '🎯', '🔥'][Math.floor(Math.random() * 10)]
        });
      }
      setFloatingElements(elements);
    };

    const defaultTemplates = [
      {
        id: 'platformer',
        name: 'platformer',
        type: 'platformer',
        displayName: 'Platformer Adventure',
        description: 'Classic side-scrolling platformer with jumping mechanics, collectibles, and enemies',
        icon: '🏃‍♂️',
        color: 'from-blue-500 to-cyan-600',
        difficulty: 'Beginner',
        estimatedTime: '2-4 hours',
        features: ['Jump mechanics', 'Collectibles', 'Enemy AI', 'Multiple levels'],
        defaultConfig: {
          width: 800,
          height: 600,
          player: { speed: 160, jumpForce: 500, color: '#00ff00' },
          world: { gravity: 300, background: '#87CEEB' }
        }
      },
      {
        id: 'runner',
        name: 'runner',
        type: 'runner',
        displayName: 'Endless Runner',
        description: 'Fast-paced endless running game with obstacles, power-ups, and increasing difficulty',
        icon: '🏃‍♀️',
        color: 'from-green-500 to-emerald-600',
        difficulty: 'Beginner',
        estimatedTime: '1-3 hours',
        features: ['Endless gameplay', 'Power-ups', 'High scores', 'Dynamic obstacles'],
        defaultConfig: {
          width: 800,
          height: 600,
          player: { speed: 200, jumpForce: 400, color: '#ff6b6b' },
          world: { gravity: 400, background: '#ffd93d' }
        }
      },
      {
        id: 'flappy',
        name: 'flappy',
        type: 'flappy',
        displayName: 'Flappy Bird Style',
        description: 'Navigate through pipes by tapping to fly in this addictive arcade game',
        icon: '🐦',
        color: 'from-yellow-500 to-orange-600',
        difficulty: 'Beginner',
        estimatedTime: '1-2 hours',
        features: ['Simple controls', 'Physics engine', 'Score system', 'Difficulty progression'],
        defaultConfig: {
          width: 800,
          height: 600,
          player: { flapForce: 250, color: '#ffd93d' },
          world: { gravity: 400, background: '#87CEEB' }
        }
      },
      {
        id: 'shooter',
        name: 'shooter',
        type: 'shooter',
        displayName: 'Space Shooter',
        description: 'Shoot enemies and avoid obstacles in space with power-ups and boss battles',
        icon: '🚀',
        color: 'from-purple-500 to-pink-600',
        difficulty: 'Intermediate',
        estimatedTime: '3-5 hours',
        features: ['Multiple weapons', 'Boss battles', 'Upgrade system', 'Special effects'],
        defaultConfig: {
          width: 800,
          height: 600,
          player: { speed: 200, color: '#00ffff' },
          world: { gravity: 0, background: '#000014' }
        }
      }
    ];
    
    const foundTemplate = defaultTemplates.find(t => t.id === templateId || t.name === templateId);
    if (foundTemplate) {
      setTemplate(foundTemplate);
      setGameData(prev => ({
        ...prev,
        title: `My ${foundTemplate.displayName}`,
        description: foundTemplate.description,
        customizations: foundTemplate.defaultConfig || {}
      }));
    }

    window.addEventListener('mousemove', handleMouseMove);
    generateFloatingElements();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [templateId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gameData.title.trim()) {
      toast.error('🎮 Please enter a game title');
      return;
    }

    if (!template) {
      toast.error('❌ Template not found');
      return;
    }

    setIsSubmitting(true);
    setPreviewAnimation(true);

    try {
      const gameConfig = {
        type: template.type,
        width: template.defaultConfig?.width || 800,
        height: template.defaultConfig?.height || 600,
        player: template.defaultConfig?.player || {},
        world: template.defaultConfig?.world || {}
      };

      const gamePayload = {
        title: gameData.title.trim(),
        description: gameData.description.trim() || template.description,
        type: template.type,
        gameData: gameConfig,
        phaserConfig: gameConfig
      };
      
      const result = await dispatch(createGameFromTemplate({
        templateId: template.id,
        gameData: gamePayload
      }));
      
      if (result.type === 'templates/createGameFromTemplate/fulfilled') {
        toast.success('🎉 Game created successfully! Time to play!');
        setTimeout(() => {
          navigate('/my-games');
        }, 1500);
      } else {
        const errorMessage = result.payload || 'Failed to create game';
        toast.error(`❌ ${errorMessage}`);
        console.error('Creation failed:', result);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('❌ Failed to create game');
    } finally {
      setIsSubmitting(false);
      setPreviewAnimation(false);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Error Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-red-900 to-purple-900">
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
            <div className="absolute -bottom-8 right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
          <div className="text-center max-w-2xl mx-auto px-4" data-aos="zoom-in">
            <div className="text-9xl mb-8 animate-bounce">😵</div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Template Not Found
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              The template "{templateId}" could not be found. Let's get you back to creating awesome games!
            </p>
            <button
              onClick={() => navigate('/templates')}
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 mx-auto"
            >
              <span className="text-2xl group-hover:animate-bounce">🎮</span>
              Back to Templates
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultimate Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Floating creation elements */}
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
            <button
              onClick={() => navigate('/templates')}
              className="group inline-flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105 text-lg font-medium"
            >
              <span className="text-2xl group-hover:animate-bounce">←</span>
              Back to Templates
            </button>
          </div>

          {/* Ultimate Enhanced Header */}
          <div 
            className="text-center mb-16"
            data-aos="fade-down"
          >
            <div className="relative inline-block mb-8">
              {/* Floating header particles */}
              <div className="absolute -top-8 -left-8 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute -top-6 -right-12 w-3 h-3 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-6 left-12 w-5 h-5 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute -bottom-8 -right-8 w-2 h-2 bg-orange-400 rounded-full animate-pulse animation-delay-3000"></div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                🎨 Create Your Game
              </h1>
              
              <div className="text-2xl sm:text-3xl max-w-4xl mx-auto text-gray-300 leading-relaxed">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold">
                  Customize • Build • Launch
                </span>
                <br />
                <span className="text-lg sm:text-xl">
                  Transform your vision into an amazing game experience
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
              {/* Enhanced Game Configuration */}
              <div className="xl:col-span-2">
                <div 
                  className="relative"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl overflow-hidden">
                    {/* Configuration sparkles */}
                    <div className="absolute inset-0">
                      <div className="absolute top-6 left-6 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                      <div className="absolute top-8 right-8 w-1 h-1 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
                      <div className="absolute bottom-6 left-8 w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
                      <div className="absolute bottom-8 right-6 w-1 h-1 bg-orange-400 rounded-full animate-ping animation-delay-3000"></div>
                    </div>

                    <div className="relative z-10">
                      <h2 className="text-3xl lg:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        🎯 Game Configuration
                      </h2>

                      <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Enhanced Game Details Section */}
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                            <span className="text-3xl">📝</span>
                            Game Details
                          </h3>
                          
                          <div className="space-y-6">
                            <div className="relative">
                              <label className="block text-lg font-semibold mb-3 text-gray-200">
                                🎮 Game Title
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={gameData.title}
                                  onChange={(e) => setGameData(prev => ({ ...prev, title: e.target.value }))}
                                  className="w-full px-6 py-4 pl-14 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                                  placeholder="Enter your epic game title..."
                                  required
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
                                  🏆
                                </div>
                              </div>
                            </div>

                            <div className="relative">
                              <label className="block text-lg font-semibold mb-3 text-gray-200">
                                📖 Game Description
                              </label>
                              <div className="relative">
                                <textarea
                                  value={gameData.description}
                                  onChange={(e) => setGameData(prev => ({ ...prev, description: e.target.value }))}
                                  rows={4}
                                  className="w-full px-6 py-4 pl-14 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50 resize-none"
                                  placeholder="Describe your amazing game adventure..."
                                />
                                <div className="absolute left-4 top-4 text-2xl">
                                  ✨
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Submit Button */}
                        <div className="flex flex-col sm:flex-row gap-6">
                          <button
                            type="submit"
                            disabled={isSubmitting || !gameData.title.trim()}
                            className="group relative overflow-hidden flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                              {isSubmitting ? (
                                <>
                                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  🚀 Creating Your Game...
                                </>
                              ) : (
                                <>
                                  <span className="text-3xl group-hover:animate-bounce">🎮</span>
                                  Create My Game
                                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                </>
                              )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => navigate('/templates')}
                            className="group relative overflow-hidden bg-transparent border-2 border-gray-500/50 hover:border-gray-400/50 text-white py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:bg-gray-700/20"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                              <span className="text-3xl group-hover:animate-bounce">❌</span>
                              Cancel
                            </span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ultimate Enhanced Template Preview */}
              <div className="xl:col-span-1">
                <div 
                  className="relative sticky top-8"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl overflow-hidden">
                    {/* Preview sparkles */}
                    <div className="absolute inset-0">
                      <div className="absolute top-4 left-4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                      <div className="absolute top-6 right-6 w-1 h-1 bg-pink-400 rounded-full animate-pulse animation-delay-1000"></div>
                      <div className="absolute bottom-4 left-6 w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-2000"></div>
                      <div className="absolute bottom-6 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-ping animation-delay-3000"></div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                        ✨ Template Preview
                      </h3>
                      
                      {/* Enhanced Template Card */}
                      <div className={`relative bg-gradient-to-br ${template.color} rounded-2xl p-6 mb-6 overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <div className="relative z-10 text-center">
                          <div className={`text-6xl mb-4 transition-all duration-1000 ${previewAnimation ? 'animate-bounce scale-125' : ''}`}>
                            {template.icon}
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-2">{template.displayName}</h4>
                          <p className="text-white/80 text-sm">{template.description}</p>
                        </div>
                      </div>

                      {/* Enhanced Template Stats */}
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                            <div className="text-2xl mb-2">🎚️</div>
                            <div className="text-xs text-gray-400 mb-1">Difficulty</div>
                            <div className="font-bold text-white">{template.difficulty}</div>
                          </div>
                          <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                            <div className="text-2xl mb-2">⏱️</div>
                            <div className="text-xs text-gray-400 mb-1">Build Time</div>
                            <div className="font-bold text-white">{template.estimatedTime}</div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Features List */}
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <span className="text-2xl">🌟</span>
                          Included Features
                        </h4>
                        <div className="space-y-3">
                          {(template.features || []).map((feature, index) => (
                            <div 
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-600/30 transition-all duration-300"
                              data-aos="slide-left"
                              data-aos-delay={400 + index * 100}
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-lg">
                                ✓
                              </div>
                              <span className="text-white font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Error Display */}
            {error && (
              <div 
                className="mt-8 relative"
                data-aos="shake"
              >
                <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl animate-bounce">⚠️</div>
                    <div>
                      <h3 className="text-xl font-bold text-red-300 mb-2">Creation Error</h3>
                      <p className="text-red-200">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Bottom Encouragement */}
            <div 
              className="text-center mt-16"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
                  <h3 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    🎊 You're About to Create Something Amazing!
                  </h3>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Every great game starts with a simple idea. Your creativity combined with our powerful template will create an unforgettable gaming experience!
                  </p>
                  <div className="flex justify-center items-center gap-8 text-lg text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl animate-bounce">🚀</span>
                      <span>Quick Setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl animate-pulse">💫</span>
                      <span>Endless Possibilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl animate-bounce animation-delay-1000">🏆</span>
                      <span>Epic Results</span>
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

export default TemplateCustomize;