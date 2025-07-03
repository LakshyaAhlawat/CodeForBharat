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

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    if (gameId) {
      dispatch(fetchGame(gameId));
      dispatch(fetchGameReviews(gameId));
    }
  }, [dispatch, gameId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }

    if (!newReview.comment.trim() || newReview.comment.trim().length < 5) {
      toast.error('Comment must be at least 5 characters long');
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
        toast.success('Review added successfully!');
        setNewReview({ rating: 5, comment: '' });
        setHoverRating(0);
        dispatch(fetchGameReviews(gameId));
      } else {
        toast.error(result.payload || 'Failed to add review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to add review');
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
          className={`text-xl sm:text-2xl lg:text-3xl transition-all duration-200 ${
            interactive 
              ? 'hover:scale-110 cursor-pointer active:scale-95' 
              : 'cursor-default'
          } ${
            isActive 
              ? 'text-yellow-400 drop-shadow-lg' 
              : 'text-gray-400'
          }`}
        >
          ★
        </button>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 sm:border-b-4 border-white"></div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center text-white px-4">
        <div className="text-center" data-aos="fade-up">
          <div className="text-6xl sm:text-8xl mb-6">😕</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Game Not Found</h2>
          <p className="text-indigo-200 mb-8 text-base sm:text-lg">
            The game you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/community" 
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = gameReviews && gameReviews.length > 0 
    ? (gameReviews.reduce((sum, review) => sum + review.rating, 0) / gameReviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8" data-aos="fade-right">
          <Link 
            to="/community" 
            className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-sm sm:text-base group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Community
          </Link>
        </div>

        {/* Game Header */}
        <div 
          className="bg-white/10 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur mb-6 sm:mb-8 lg:mb-12"
          data-aos="fade-up"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
            {/* Game Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl flex-shrink-0">
              {currentGame.type === 'platformer' && '🏃‍♂️'}
              {currentGame.type === 'runner' && '🏃‍♀️'}
              {currentGame.type === 'flappy' && '🐦'}
              {currentGame.type === 'shooter' && '🚀'}
              {(!currentGame.type || currentGame.type === 'arcade') && '🎮'}
            </div>
            
            {/* Game Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3">
                {currentGame.title}
              </h1>
              <p className="text-indigo-200 mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
                by {currentGame.user?.username}
              </p>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                {currentGame.description}
              </p>
            </div>
            
            {/* Rating Display */}
            <div className="text-center flex-shrink-0">
              <div className="flex items-center justify-center gap-1 mb-2 sm:mb-3">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm sm:text-base text-gray-300">
                <span className="font-bold text-yellow-400">{averageRating}</span>
                <span className="text-xs sm:text-sm text-gray-400 block sm:inline sm:ml-2">
                  ({gameReviews?.length || 0} review{(gameReviews?.length || 0) !== 1 ? 's' : ''})
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Reviews List */}
          <div className="xl:col-span-2">
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8"
              data-aos="fade-right"
            >
              💬 Reviews
            </h2>
            
            {!gameReviews || gameReviews.length === 0 ? (
              <div 
                className="bg-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 backdrop-blur text-center"
                data-aos="fade-up"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">💬</div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">No reviews yet</h3>
                <p className="text-indigo-200 text-sm sm:text-base lg:text-lg">
                  Be the first to review this amazing game!
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {gameReviews.map((review, index) => (
                  <div 
                    key={review._id} 
                    className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur hover:bg-white/20 transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* User Avatar */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg flex-shrink-0">
                          {review.user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base lg:text-lg truncate">
                            {review.user?.username}
                          </h4>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review Form & Actions */}
          <div className="space-y-6 sm:space-y-8">
            {/* Add Review Form */}
            <div data-aos="fade-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">✍️ Add Your Review</h2>
              
              {isAuthenticated ? (
                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur">
                  <form onSubmit={handleSubmitReview} className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm sm:text-base font-medium mb-2 sm:mb-3">
                        Rating
                      </label>
                      <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
                        {renderStars(
                          newReview.rating,
                          true,
                          (rating) => setNewReview({ ...newReview, rating }),
                          (rating) => setHoverRating(rating),
                          () => setHoverRating(0)
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 text-center sm:text-left">
                        {hoverRating > 0 
                          ? `${hoverRating} star${hoverRating !== 1 ? 's' : ''}`
                          : `${newReview.rating} star${newReview.rating !== 1 ? 's' : ''}`
                        }
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm sm:text-base font-medium mb-2 sm:mb-3">
                        Comment
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Share your thoughts about this game..."
                        rows={4}
                        className="w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm sm:text-base"
                        required
                        minLength={5}
                        maxLength={500}
                      />
                      <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                        {newReview.comment.length}/500 characters
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !newReview.comment.trim() || newReview.comment.length < 5}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-105 active:scale-95"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur text-center">
                  <div className="text-4xl sm:text-5xl mb-4">🔐</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Login to Review</h3>
                  <p className="text-indigo-200 mb-4 sm:mb-6 text-sm sm:text-base">
                    Sign in to share your thoughts about this game
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    Login Now
                  </Link>
                </div>
              )}
            </div>

            {/* Game Actions */}
            <div className="space-y-3 sm:space-y-4" data-aos="fade-left" data-aos-delay="200">
              <Link
                to={`/games/${gameId}/play`}
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-center text-sm sm:text-base hover:scale-105 active:scale-95"
              >
                🎮 Play Game
              </Link>
              <Link
                to="/community"
                className="block w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-center text-sm sm:text-base hover:scale-105 active:scale-95"
              >
                🌟 Browse More Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameReviews;