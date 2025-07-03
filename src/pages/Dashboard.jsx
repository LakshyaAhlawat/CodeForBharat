// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserDashboard } from '../store/slices/authSlice';
import { fetchMyGames } from '../store/slices/gameSlice';
import { fetchTemplates } from '../store/slices/templateSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, dashboardData, isLoading } = useSelector((state) => state.auth);
  const { myGames } = useSelector((state) => state.games);
  const { templates } = useSelector((state) => state.templates);

  useEffect(() => {
    dispatch(fetchUserDashboard());
    dispatch(fetchMyGames());
    dispatch(fetchTemplates());
  }, [dispatch]);

  // Add null checks for arrays
  const recentGames = Array.isArray(myGames) ? myGames.slice(0, 4) : [];
  const featuredTemplates = Array.isArray(templates) ? templates.slice(0, 3) : [];

  // Get stats from dashboardData or fallback to default values
  const stats = dashboardData?.stats || {
    gamesCreated: Array.isArray(myGames) ? myGames.length : 0,
    totalPlays: 0,
    totalLikes: 0,
    reviewsGiven: 0
  };

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.username || user?.displayName || 'User'}! 👋
          </h1>
          <p className="text-indigo-200">Ready to create some amazing games today?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {stats.gamesCreated}
            </div>
            <div className="text-sm text-indigo-200">Games Created</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {stats.totalPlays}
            </div>
            <div className="text-sm text-indigo-200">Total Plays</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {stats.totalLikes}
            </div>
            <div className="text-sm text-indigo-200">Likes Received</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {stats.reviewsGiven}
            </div>
            <div className="text-sm text-indigo-200">Reviews Given</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/templates"
              className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-lg text-center font-semibold transition"
            >
              <div className="text-2xl mb-2">🎮</div>
              Create New Game
            </Link>
            <Link
              to="/my-games"
              className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center font-semibold transition"
            >
              <div className="text-2xl mb-2">📁</div>
              My Games
            </Link>
            <Link
              to="/assets"
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center font-semibold transition"
            >
              <div className="text-2xl mb-2">🖼️</div>
              Manage Assets
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Games */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recent Games</h2>
              <Link
                to="/my-games"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {recentGames.length > 0 ? (
              <div className="space-y-4">
                {recentGames.map((game) => (
                  <div key={game._id || game.id} className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{game.title}</h3>
                        <p className="text-sm text-indigo-200">{game.type || 'Game'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          game.status === 'published' ? 'bg-green-500' : game.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}>
                          {game.status || 'draft'}
                        </span>
                        <Link
                          to={`/games/${game._id || game.id}/edit`}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-indigo-300">
                <div className="text-4xl mb-4">🎮</div>
                <p>No games created yet</p>
                <Link
                  to="/templates"
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Create your first game →
                </Link>
              </div>
            )}
          </div>

          {/* Featured Templates */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Featured Templates</h2>
              <Link
                to="/templates"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {featuredTemplates.length > 0 ? (
              <div className="space-y-4">
                {featuredTemplates.map((template) => (
                  <div key={template._id || template.id || template.name} className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{template.displayName || template.name}</h3>
                        <p className="text-sm text-indigo-200">{template.description}</p>
                      </div>
                      <Link
                        to={`/templates/${template.name || template._id}/customize`}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Use
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-indigo-300">
                <div className="text-4xl mb-4">📋</div>
                <p>No templates available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;