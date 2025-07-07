import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, fetchGameReviews, addGameReview } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';
import AOS from 'aos';

const GameReviews = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const { currentGame, gameReviews, isLoading } = useSelector((state) => state.games);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    if (gameId) {
      dispatch(fetchGame(gameId));
      dispatch(fetchGameReviews(gameId));
    }

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate floating gaming elements
    const generateFloatingElements = () => {
      const elements = [];
      for (let i = 0; i < 25; i++) {
        elements.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 8 + Math.random() * 10,
          icon: ['🎮', '🕹️', '👾', '🎯', '⭐', '💫', '🌟', '🚀', '⚡', '🔥', '🏆', '🎊', '💯', '✨'][Math.floor(Math.random() * 14)]
        });
      }
      setFloatingElements(elements);
    };

    window.addEventListener('mousemove', handleMouseMove);
    generateFloatingElements();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dispatch, gameId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('🎮 Please login to share your gaming experience!');
      return;
    }

    if (!newReview.comment.trim() || newReview.comment.trim().length < 5) {
      toast.error('🎯 Please share at least 5 characters about your experience!');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(addGameReview({
        gameId,
        reviewData: {
          rating: newReview.rating,
          comment: newReview.comment.trim()
        }
      }));

      if (result.type === 'games/addGameReview/fulfilled') {
        toast.success('🎉 Your review has been shared! Thank you!');
        setNewReview({ rating: 5, comment: '' });
        setHoverRating(0);
        dispatch(fetchGameReviews(gameId));
      } else {
        toast.error('❌ Failed to share your review. Please try again!');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('❌ Failed to share your review. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null, onStarHover = null, onStarLeave = null) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      const isActive = interactive 
        ? (hoverRating > 0 ? starNumber <= hoverRating : starNumber <= rating)
        : starNumber <= rating;
      
      return (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={interactive ? () => onStarClick(starNumber) : undefined}
          onMouseEnter={interactive ? () => onStarHover(starNumber) : undefined}
          onMouseLeave={interactive ? onStarLeave : undefined}
          className={`text-2xl sm:text-3xl lg:text-4xl transition-all duration-300 ${
            interactive 
              ? 'hover:scale-125 cursor-pointer active:scale-110 hover:animate-pulse' 
              : 'cursor-default'
          } ${
            isActive 
              ? 'text-yellow-400 drop-shadow-xl animate-pulse' 
              : 'text-gray-500'
          }`}
        >
          ⭐
        </button>
      );
    });
  };

  const getRatingLevel = (rating) => {
    const levels = {
      1: { text: 'Poor', emoji: '😞', color: 'text-red-400' },
      2: { text: 'Fair', emoji: '😐', color: 'text-orange-400' },
      3: { text: 'Good', emoji: '😊', color: 'text-yellow-400' },
      4: { text: 'Great', emoji: '😄', color: 'text-green-400' },
      5: { text: 'Excellent', emoji: '🤩', color: 'text-blue-400' }
    };
    return levels[rating] || levels[5];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Loading Background */}
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
              🎮 Loading Game Reviews...
            </h2>
            <p className="text-2xl text-gray-300 mb-12">Preparing the ultimate gaming experience</p>
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

  if (!currentGame) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
            <div className="absolute -bottom-8 right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
          <div className="text-center max-w-2xl mx-auto px-4" data-aos="zoom-in">
            <div className="text-9xl mb-8 animate-bounce">🎮</div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Game Not Found
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              This game seems to have disappeared! Let's find you some amazing games to play!
            </p>
            <Link
              to="/community"
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 mx-auto"
            >
              <span className="text-2xl group-hover:animate-bounce">🚀</span>
              Back to Community
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = gameReviews && gameReviews.length > 0 
    ? (gameReviews.reduce((sum, review) => sum + review.rating, 0) / gameReviews.length).toFixed(1)
    : 0;

  const ratingLevel = getRatingLevel(Math.round(averageRating));

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
              to="/community"
              className="group inline-flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-105 text-lg font-medium"
            >
              <span className="text-2xl group-hover:animate-bounce">←</span>
              Back to Community
            </Link>
          </div>

          {/* Ultimate Enhanced Game Header */}
          <div 
            className="relative mb-16"
            data-aos="fade-up"
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
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  {/* Enhanced Game Icon */}
                  <div className="relative">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-400 via-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center text-6xl lg:text-7xl shadow-2xl group hover:scale-110 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                      <div className="relative z-10">
                        {currentGame.type === 'platformer' && '🏃‍♂️'}
                        {currentGame.type === 'runner' && '🏃‍♀️'}
                        {currentGame.type === 'flappy' && '🐦'}
                        {currentGame.type === 'shooter' && '🚀'}
                        {(!currentGame.type || currentGame.type === 'arcade') && '🎮'}
                      </div>
                    </div>
                    {/* Review indicator */}
                    <div className="absolute -top-3 -right-3 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      💬 {gameReviews?.length || 0}
                    </div>
                  </div>

                  {/* Enhanced Game Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-purple-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-tight">
                      {currentGame.title}
                    </h1>
                    <p className="text-xl lg:text-2xl text-cyan-200 mb-4 font-medium">
                      🎯 Created by {currentGame.user?.username}
                    </p>
                    <p className="text-lg lg:text-xl text-gray-300 leading-relaxed mb-6">
                      {currentGame.description}
                    </p>
                    
                    {/* Rating Level Badge */}
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl px-6 py-3 border border-cyan-400/30">
                      <span className="text-2xl">{ratingLevel.emoji}</span>
                      <span className={`font-bold text-lg ${ratingLevel.color}`}>{ratingLevel.text} Game</span>
                    </div>
                  </div>

                  {/* Enhanced Rating Display */}
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="text-lg font-bold text-gray-300 mb-3">🌟 Player Rating</div>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {renderStars(Math.round(averageRating))}
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl px-6 py-4 border border-cyan-400/30">
                        <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                          {averageRating}
                        </div>
                        <div className="text-sm text-gray-300">
                          ({gameReviews?.length || 0} review{(gameReviews?.length || 0) !== 1 ? 's' : ''})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
            {/* Enhanced Reviews List */}
            <div className="xl:col-span-2">
              <div 
                className="relative mb-12"
                data-aos="fade-right"
              >
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  💬 Player Reviews
                </h2>
                <p className="text-xl text-gray-300">
                  See what the gaming community says about this game
                </p>
              </div>
              
              {!gameReviews || gameReviews.length === 0 ? (
                <div 
                  className="relative"
                  data-aos="fade-up"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-gray-700/50 shadow-2xl text-center">
                    <div className="text-8xl mb-8 animate-bounce">📝</div>
                    <h3 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      No reviews yet
                    </h3>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                      Be the first to share your gaming experience! Help other players discover this awesome game.
                    </p>
                    <div className="text-6xl animate-pulse">🎮</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 lg:space-y-8">
                  {gameReviews.map((review, index) => (
                    <div 
                      key={review._id}
                      className="relative group"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-700/50 shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                        {/* Review sparkles */}
                        <div className="absolute inset-0">
                          <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                          <div className="absolute top-6 right-6 w-1 h-1 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
                          <div className="absolute bottom-4 left-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
                        </div>

                        <div className="relative z-10">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div className="flex items-center gap-4">
                              {/* Enhanced User Avatar */}
                              <div className="relative">
                                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-400 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-lg">
                                  {review.user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                                  🎮
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-lg lg:text-xl text-white mb-2">
                                  {review.user?.username}
                                </h4>
                                <div className="flex items-center gap-2">
                                  {renderStars(review.rating)}
                                </div>
                                <div className="mt-2">
                                  <span className={`text-sm font-medium ${getRatingLevel(review.rating).color}`}>
                                    {getRatingLevel(review.rating).emoji} {getRatingLevel(review.rating).text}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-400 bg-gray-700/30 px-3 py-1 rounded-full">
                                📅 {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl p-6 border border-cyan-400/20">
                            <p className="text-gray-200 text-lg lg:text-xl leading-relaxed italic">
                              "{review.comment}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Add Review Form & Actions */}
            <div className="space-y-8">
              {/* Enhanced Add Review Form */}
              <div data-aos="fade-left">
                <div className="relative mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    ✍️ Write a Review
                  </h2>
                  <p className="text-lg text-gray-300">
                    Share your gaming experience with the community!
                  </p>
                </div>
                
                {isAuthenticated ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                      <form onSubmit={handleSubmitReview} className="space-y-6">
                        <div>
                          <label className="block text-lg font-bold mb-4 text-white flex items-center gap-2">
                            <span className="text-2xl">⭐</span>
                            Rate this game
                          </label>
                          <div className="text-center mb-4">
                            <div className="flex gap-2 justify-center mb-4">
                              {renderStars(
                                newReview.rating,
                                true,
                                (rating) => setNewReview({ ...newReview, rating }),
                                (rating) => setHoverRating(rating),
                                () => setHoverRating(0)
                              )}
                            </div>
                            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl px-4 py-3 border border-cyan-400/30 inline-block">
                              <span className={`font-bold text-lg ${getRatingLevel(hoverRating || newReview.rating).color}`}>
                                {getRatingLevel(hoverRating || newReview.rating).emoji} {getRatingLevel(hoverRating || newReview.rating).text}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-lg font-bold mb-4 text-white flex items-center gap-2">
                            <span className="text-2xl">📝</span>
                            Your review
                          </label>
                          <div className="relative">
                            <textarea
                              value={newReview.comment}
                              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              placeholder="Share your gaming experience! What did you love about this game? What could be improved? Help other players decide! 🎮"
                              rows={5}
                              className="w-full px-6 py-4 rounded-2xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:bg-gray-600/50 resize-none text-lg"
                              required
                              minLength={5}
                              maxLength={500}
                            />
                            <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                              {newReview.comment.length}/500 🎯
                            </div>
                          </div>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting || !newReview.comment.trim() || newReview.comment.length < 5}
                          className="group relative overflow-hidden w-full bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white py-4 px-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-3">
                            {isSubmitting ? (
                              <>
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                🚀 Posting Review...
                              </>
                            ) : (
                              <>
                                <span className="text-3xl group-hover:animate-bounce">🎉</span>
                                Post Review
                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                              </>
                            )}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl text-center">
                      <div className="text-6xl mb-6 animate-pulse">🔐</div>
                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Login to Review
                      </h3>
                      <p className="text-lg text-gray-300 mb-8">
                        Join our gaming community to share your thoughts and experiences! 🎮
                      </p>
                      <Link
                        to="/login"
                        className="group bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 inline-flex items-center gap-3"
                      >
                        <span className="text-2xl group-hover:animate-bounce">💖</span>
                        Login with Love
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Game Actions */}
              <div className="space-y-4" data-aos="fade-left" data-aos-delay="200">
                <Link
                  to={`/games/${gameId}/play`}
                  className="group relative overflow-hidden block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-3xl group-hover:animate-bounce">🎮</span>
                    Play This Amazing Game
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <Link
                  to="/community"
                  className="group relative overflow-hidden block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 px-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-3xl group-hover:animate-bounce">🌟</span>
                    Discover More Games
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Love Section */}
          <div 
            className="text-center mt-20"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-12 border border-gray-700/50 shadow-2xl">
                <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                  💕 Spread the Love!
                </h3>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Every game is created with love and deserves to be appreciated. Share your thoughts and help other players discover amazing games!
                </p>
                <div className="flex justify-center items-center gap-8 text-lg text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl animate-bounce">💖</span>
                    <span>Share Love</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl animate-pulse">🌟</span>
                    <span>Discover Games</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl animate-bounce animation-delay-1000">🎮</span>
                    <span>Play Together</span>
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

export default GameReviews;