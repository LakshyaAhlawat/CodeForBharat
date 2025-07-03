// Create: src/pages/TemplatePreview.jsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplateById } from '../store/slices/templateSlice';

const TemplatePreview = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTemplate, isLoading, error } = useSelector((state) => state.templates);

  useEffect(() => {
    if (templateId) {
      dispatch(fetchTemplateById(templateId));
    }
  }, [dispatch, templateId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !currentTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Template Not Found</h2>
          <p className="text-indigo-200 mb-6">{error || 'The template you requested could not be found.'}</p>
          <Link
            to="/templates"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  const getTemplateIcon = (type) => {
    switch (type) {
      case 'platformer': return '🏃‍♂️';
      case 'runner': return '🏃‍♀️';
      case 'flappy': return '🐦';
      case 'shooter': return '🚀';
      default: return '🎮';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/templates"
            className="text-indigo-300 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Templates
          </Link>
        </div>

        {/* Template Header */}
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-4xl">
              {getTemplateIcon(currentTemplate.type)}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{currentTemplate.displayName}</h1>
              <p className="text-indigo-200 text-lg">{currentTemplate.description}</p>
            </div>
          </div>

          {/* Template Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-200 mb-2">Game Type</h3>
              <p className="text-lg font-semibold capitalize">{currentTemplate.type}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-200 mb-2">Difficulty</h3>
              <p className={`text-lg font-semibold ${getDifficultyColor(currentTemplate.difficulty)}`}>
                {currentTemplate.difficulty || 'Medium'}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-200 mb-2">Controls</h3>
              <p className="text-lg font-semibold">{currentTemplate.controls || 'Arrow Keys / Space'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-200 mb-2">Genre</h3>
              <p className="text-lg font-semibold capitalize">{currentTemplate.genre || currentTemplate.type}</p>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur mb-8">
          <h2 className="text-2xl font-bold mb-6">Template Preview</h2>
          
          {/* Mock Game Screen */}
          <div className="bg-black/50 rounded-xl p-8 mb-6">
            <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{getTemplateIcon(currentTemplate.type)}</div>
                <h3 className="text-2xl font-bold mb-2">{currentTemplate.displayName}</h3>
                <p className="text-indigo-200">Interactive preview coming soon!</p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2 text-indigo-200">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Responsive game controls
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Score tracking system
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Collision detection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Mobile-friendly design
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Customization Options</h3>
              <ul className="space-y-2 text-indigo-200">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">⚙️</span>
                  Player appearance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">⚙️</span>
                  Game speed & difficulty
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">⚙️</span>
                  Background themes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">⚙️</span>
                  Sound effects
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to={`/templates/${templateId}/customize`}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
          >
            Customize This Template
          </Link>
          <button
            onClick={() => navigate('/templates')}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 border border-white/20"
          >
            Browse Other Templates
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;