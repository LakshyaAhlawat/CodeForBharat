import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTemplates } from '../store/slices/templateSlice';

const Templates = () => {
  const dispatch = useDispatch();
  const { templates, isLoading, error } = useSelector((state) => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  // Use default templates if server doesn't respond
  const defaultTemplates = [
    {
      id: 'platformer',
      name: 'platformer',
      type: 'platformer',
      displayName: 'Platformer Game',
      description: 'Classic side-scrolling platformer with jumping mechanics'
    },
    {
      id: 'runner',
      name: 'runner',
      type: 'runner',
      displayName: 'Endless Runner',
      description: 'Fast-paced endless running game with obstacles'
    },
    {
      id: 'flappy',
      name: 'flappy',
      type: 'flappy',
      displayName: 'Flappy Bird',
      description: 'Navigate through pipes by tapping to fly'
    },
    {
      id: 'shooter',
      name: 'shooter',
      type: 'shooter',
      displayName: 'Space Shooter',
      description: 'Shoot enemies and avoid obstacles in space'
    }
  ];

  const templatesToShow = Array.isArray(templates) && templates.length > 0 ? templates : defaultTemplates;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Game Templates</h1>
          <p className="text-indigo-200">
            Choose from our collection of game templates to create your next masterpiece
          </p>
        </div>

        {error && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-200">Using default templates (server not available)</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesToShow.map((template) => (
            <div key={template.id || template.name} className="bg-white/10 rounded-xl p-6 backdrop-blur hover:bg-white/20 transition-all duration-300">
              <div className="mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl">
                    {template.type === 'platformer' && '🏃‍♂️'}
                    {template.type === 'runner' && '🏃‍♀️'}
                    {template.type === 'flappy' && '🐦'}
                    {template.type === 'shooter' && '🚀'}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{template.displayName}</h3>
                <p className="text-indigo-200 text-sm mb-4">{template.description}</p>
                
                <div className="flex items-center justify-between text-xs text-indigo-300 mb-4">
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    {template.type}
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    Template
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  to={`/templates/${template.id || template.name}/customize`}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg font-semibold transition text-center block"
                >
                  Customize & Create
                </Link>
                <Link
                  to={`/templates/${template.id || template.name}/preview`}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition text-center block"
                >
                  Preview Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;