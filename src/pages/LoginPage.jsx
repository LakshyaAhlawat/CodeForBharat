import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, register, clearError } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import AOS from 'aos';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  // Determine if we're on register page
  const isRegister = location.pathname === '/register';
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [focusedField, setFocusedField] = useState(null);

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

    // Generate floating gaming elements
    const generateFloatingElements = () => {
      const elements = [];
      for (let i = 0; i < 30; i++) {
        elements.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 4 + Math.random() * 6,
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
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    dispatch(clearError());
    
    try {
      let result;
      
      if (isRegister) {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        
        result = await dispatch(register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }));
        
        if (result.type === 'auth/register/fulfilled') {
          toast.success('🎉 Welcome to the gaming community!');
          navigate('/dashboard');
        }
      } else {
        // Login
        result = await dispatch(login({
          email: formData.email,
          password: formData.password
        }));
        
        if (result.type === 'auth/login/fulfilled') {
          toast.success('🚀 Welcome back, gamer!');
          navigate('/dashboard');
        }
      }
      
      // Handle rejected cases
      if (result.type.endsWith('/rejected')) {
        toast.error(result.payload || `${isRegister ? 'Registration' : 'Login'} failed`);
      }
      
    } catch (error) {
      toast.error(`${isRegister ? 'Registration' : 'Login'} failed`);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-6000"></div>
        </div>

        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Advanced mouse follower gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-purple-500/30 to-transparent rounded-full pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full" data-aos="zoom-in">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              {/* Floating particles around logo */}
              <div className="absolute -top-8 -left-8 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute -top-6 -right-10 w-3 h-3 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-6 left-10 w-5 h-5 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute -bottom-8 -right-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-3000"></div>
              
              <div className="text-6xl mb-4 animate-pulse">🎮</div>
              <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                {isRegister ? '🚀 Join the Game' : '🎯 Game On!'}
              </h1>
            </div>
            
            <div className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold">
                {isRegister ? 'Create • Build • Dominate' : 'Welcome Back, Gamer!'}
              </span>
              <br />
              <span className="text-lg">
                {isRegister ? 'Join thousands of game creators worldwide' : 'Continue your epic gaming journey'}
              </span>
            </div>

            {/* Enhanced decorative separator */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="w-8 h-8 mx-4 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
              </div>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>
          </div>

          {/* Ultimate Enhanced Form Card */}
          <div className="relative" data-aos="fade-up" data-aos-delay="200">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-gray-700/50 shadow-2xl overflow-hidden">
              {/* Form sparkles */}
              <div className="absolute inset-0">
                <div className="absolute top-6 left-6 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-6 left-8 w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
                <div className="absolute bottom-8 right-6 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-3000"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {isRegister ? '🎨 Create Your Account' : '🔑 Welcome Back'}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {isRegister ? 'Start your game development journey today!' : 'Ready to build some amazing games?'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Enhanced Username Field (Register only) */}
                  {isRegister && (
                    <div className="relative" data-aos="slide-right" data-aos-delay="300">
                      <label className="block text-lg font-semibold mb-3 text-gray-200">
                        👤 Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('username')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full px-6 py-4 pl-14 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                          placeholder="Choose your gamer tag"
                        />
                        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-300 ${
                          focusedField === 'username' ? 'scale-110 animate-bounce' : ''
                        }`}>
                          🎮
                        </div>
                        {focusedField === 'username' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl pointer-events-none"></div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Email Field */}
                  <div className="relative" data-aos="slide-right" data-aos-delay="400">
                    <label className="block text-lg font-semibold mb-3 text-gray-200">
                      📧 Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full px-6 py-4 pl-14 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                        placeholder="your.email@example.com"
                      />
                      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-300 ${
                        focusedField === 'email' ? 'scale-110 animate-bounce' : ''
                      }`}>
                        ✉️
                      </div>
                      {focusedField === 'email' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl pointer-events-none"></div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Password Field */}
                  <div className="relative" data-aos="slide-right" data-aos-delay="500">
                    <label className="block text-lg font-semibold mb-3 text-gray-200">
                      🔒 Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full px-6 py-4 pl-14 pr-14 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                        placeholder={isRegister ? "Create a strong password" : "Enter your password"}
                      />
                      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-300 ${
                        focusedField === 'password' ? 'scale-110 animate-bounce' : ''
                      }`}>
                        🛡️
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform duration-300"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                      {focusedField === 'password' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl pointer-events-none"></div>
                      )}
                    </div>
                    
                    {/* Password Strength Indicator (Register only) */}
                    {isRegister && formData.password && (
                      <div className="mt-3" data-aos="fade-in">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-300">Password Strength</span>
                          <span className={`font-bold ${
                            passwordStrength.strength >= 75 ? 'text-green-400' :
                            passwordStrength.strength >= 50 ? 'text-yellow-400' :
                            passwordStrength.strength >= 25 ? 'text-orange-400' : 'text-red-400'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Confirm Password Field (Register only) */}
                  {isRegister && (
                    <div className="relative" data-aos="slide-right" data-aos-delay="600">
                      <label className="block text-lg font-semibold mb-3 text-gray-200">
                        🔐 Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full px-6 py-4 pl-14 pr-14 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50"
                          placeholder="Confirm your password"
                        />
                        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-300 ${
                          focusedField === 'confirmPassword' ? 'scale-110 animate-bounce' : ''
                        }`}>
                          ✅
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform duration-300"
                        >
                          {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                        {focusedField === 'confirmPassword' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl pointer-events-none"></div>
                        )}
                      </div>
                      
                      {/* Password Match Indicator */}
                      {formData.confirmPassword && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className={`text-2xl ${
                            formData.password === formData.confirmPassword ? 'animate-bounce' : ''
                          }`}>
                            {formData.password === formData.confirmPassword ? '✅' : '❌'}
                          </div>
                          <span className={`text-sm font-medium ${
                            formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {formData.password === formData.confirmPassword ? 'Passwords match!' : 'Passwords do not match'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enhanced Error Display */}
                  {error && (
                    <div 
                      className="relative bg-red-500/20 border border-red-500/50 rounded-2xl p-4"
                      data-aos="shake"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl animate-bounce">⚠️</div>
                        <div className="text-red-300 font-medium">{error}</div>
                      </div>
                    </div>
                  )}

                  {/* Ultimate Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-purple-500 to-cyan-600 text-white font-bold py-6 px-8 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    data-aos="zoom-in"
                    data-aos-delay="700"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-xl">
                      {isLoading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          {isRegister ? '🚀 Creating your account...' : '🔑 Signing you in...'}
                        </>
                      ) : (
                        <>
                          <span className="text-2xl group-hover:animate-bounce">
                            {isRegister ? '🎮' : '⚡'}
                          </span>
                          {isRegister ? 'Create Gaming Account' : 'Enter Game World'}
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>

                {/* Enhanced Toggle Link */}
                <div className="mt-8 text-center" data-aos="fade-up" data-aos-delay="800">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl"></div>
                    <div className="relative p-6 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-2xl border border-gray-600/50">
                      <p className="text-gray-300 text-lg mb-3">
                        {isRegister ? "Already part of our gaming community? 🎯" : "New to our gaming platform? 🚀"}
                      </p>
                      <Link 
                        to={isRegister ? "/login" : "/register"} 
                        className="group inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-xl transition-all duration-300 hover:scale-105"
                      >
                        <span className="text-2xl group-hover:animate-bounce">
                          {isRegister ? '🔑' : '🎮'}
                        </span>
                        {isRegister ? 'Sign In Now' : 'Join the Game'}
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Enhanced Features Showcase */}
                <div className="mt-8 grid grid-cols-3 gap-4" data-aos="fade-up" data-aos-delay="900">
                  {[
                    { icon: '🎮', label: 'Create Games', color: 'from-purple-500 to-pink-500' },
                    { icon: '🏆', label: 'Join Contests', color: 'from-cyan-500 to-blue-500' },
                    { icon: '🌟', label: 'Build Community', color: 'from-green-500 to-emerald-500' }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className={`group text-center p-4 bg-gradient-to-r ${feature.color} bg-opacity-20 rounded-2xl border border-white/10 hover:scale-105 transition-all duration-300`}
                    >
                      <div className="text-2xl mb-2 group-hover:animate-bounce">{feature.icon}</div>
                      <div className="text-sm font-medium text-white">{feature.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
