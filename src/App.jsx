// App.jsx (setup for AOS)
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { store } from './store';
import { checkAuth } from './store/slices/authSlice';

// Import your game components
import FlappyBirdGame from './games/FlappyBirdGame';
import PlatformerGame from './games/PlatformerGame';

// Import all other components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import TemplateCustomize from './pages/TemplateCustomize';
import MyGames from './pages/MyGames';
import GameEditor from './pages/GameEditor';
import GamePlayer from './pages/GamePlayer'; // This handles template-based games
import Assets from './pages/Assets';
import Profile from './pages/Profile';
import About from './pages/About';
import Leaderboard from './pages/Leaderboard';
import Contact from './pages/Contact';
import Games from './pages/Games';
import TemplatePreview from './pages/TemplatePreview';
import Community from './pages/Community';
import GameReviews from './pages/GameReviews';

// App Content Component
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });
    
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/community" element={<Community />} />
          
          {/* Standalone Game Routes - These use your custom game components */}
          <Route path="/game/flappy" element={<FlappyBirdGame />} />
          <Route path="/game/platformer" element={<PlatformerGame />} />
          
          {/* Template-based Game Routes - These use GamePlayer */}
          <Route path="/games" element={<Games />} />
          <Route path="/games/:gameId/play" element={<GamePlayer />} />
          <Route path="/games/:gameId/reviews" element={<GameReviews />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/templates" element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          } />
          <Route path="/templates/:templateId/preview" element={
            <ProtectedRoute>
              <TemplatePreview />
            </ProtectedRoute>
          } />
          <Route path="/templates/:templateId/customize" element={
            <ProtectedRoute>
              <TemplateCustomize />
            </ProtectedRoute>
          } />
          <Route path="/my-games" element={
            <ProtectedRoute>
              <MyGames />
            </ProtectedRoute>
          } />
          <Route path="/assets" element={
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/games/:gameId/edit" element={
            <ProtectedRoute>
              <GameEditor />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1b4b',
            color: '#fff',
            border: '1px solid #3730a3'
          }
        }}
      />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
