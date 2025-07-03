import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishedGames } from "../store/slices/gameSlice";
import { Link } from "react-router-dom";
import AOS from "aos";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { publishedGames, isLoading } = useSelector((state) => state.games);
  const [sortBy, setSortBy] = useState("mostPlayed");

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: "ease-in-out",
    });
    dispatch(fetchPublishedGames());
  }, [dispatch]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getGameIcon = (type) => {
    switch (type) {
      case "platformer":
        return "🏃‍♂️";
      case "runner":
        return "🏃‍♀️";
      case "flappy":
        return "🐦";
      case "shooter":
        return "🚀";
      default:
        return "🎮";
    }
  };

  const getTrophyIcon = (rank) => {
    if (rank <= 3) return "👑";
    if (rank <= 10) return "🏆";
    if (rank <= 20) return "🎖️";
    return "🏅";
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    if (rank <= 10) return "from-purple-400 to-purple-600";
    return "from-blue-400 to-blue-600";
  };

  const sortedGames = [...publishedGames].sort((a, b) => {
    switch (sortBy) {
      case "mostPlayed":
        return (b.playCount || 0) - (a.playCount || 0);
      case "mostLiked":
        return (b.likesCount || 0) - (a.likesCount || 0);
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const topGames = sortedGames.slice(0, 3);
  const otherGames = sortedGames.slice(3);

  const getStatValue = (game, type) => {
    switch (type) {
      case "mostPlayed":
        return game.playCount || 0;
      case "mostLiked":
        return game.likesCount || 0;
      case "newest":
        return new Date(game.createdAt).toLocaleDateString();
      default:
        return 0;
    }
  };

  const getStatLabel = (type) => {
    switch (type) {
      case "mostPlayed":
        return "plays";
      case "mostLiked":
        return "likes";
      case "newest":
        return "created";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg sm:text-xl">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          data-aos="fade-down"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-indigo-200 max-w-3xl mx-auto leading-relaxed px-4">
            Top performing games in our amazing community
          </p>
        </div>

        {/* Filter Buttons */}
        <div
          className="bg-white/10 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur mb-8 sm:mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center">
            {[
              { key: "mostPlayed", label: "Most Played", icon: "👾" },
              { key: "mostLiked", label: "Most Liked", icon: "❤️" },
              { key: "newest", label: "Newest", icon: "🆕" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSortBy(filter.key)}
                className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base lg:text-lg hover:scale-105 active:scale-95 ${
                  sortBy === filter.key
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl"
                    : "bg-white/10 text-white hover:bg-white/20 hover:shadow-lg"
                }`}
              >
                <span className="text-lg sm:text-xl">{filter.icon}</span>
                <span className="hidden sm:inline">{filter.label}</span>
                <span className="sm:hidden">{filter.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        {topGames.length > 0 && (
          <div
            className="mb-12 sm:mb-16 lg:mb-20"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
              🌟 Hall of Fame
            </h2>

            {/* Mobile: Vertical Layout */}
            <div className="block sm:hidden space-y-4">
              {topGames.map((game, index) => (
                <div
                  key={game._id}
                  className={`bg-gradient-to-r ${getRankColor(index + 1)} rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl`}
                  data-aos="zoom-in"
                  data-aos-delay={300 + index * 100}
                >
                  <div className="text-4xl mb-3">{getTrophyIcon(index + 1)}</div>
                  <div className="text-3xl mb-2">{getRankIcon(index + 1)}</div>
                  <div className="text-2xl mb-2">{getGameIcon(game.type)}</div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {game.title}
                  </h3>
                  <p className="text-sm opacity-90 mb-2">by {game.user?.username}</p>
                  <div className="text-xl font-bold">
                    {getStatValue(game, sortBy)}
                    {sortBy !== "newest" && (
                      <span className="text-sm ml-1">{getStatLabel(sortBy)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Podium Layout */}
            <div className="hidden sm:flex items-end justify-center gap-4 lg:gap-8">
              {/* 2nd Place */}
              {topGames[1] && (
                <div
                  className="text-center transform hover:scale-105 transition-all duration-300"
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  <div className="bg-gradient-to-r from-gray-300 to-gray-500 rounded-t-2xl lg:rounded-t-3xl p-4 sm:p-6 lg:p-8 mb-4 shadow-xl">
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
                      {getTrophyIcon(2)}
                    </div>
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                      🥈
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
                      {getGameIcon(topGames[1].type)}
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-2 line-clamp-1">
                      {topGames[1].title}
                    </h3>
                    <p className="text-sm sm:text-base opacity-90 mb-3">
                      by {topGames[1].user?.username}
                    </p>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                      {getStatValue(topGames[1], sortBy)}
                      {sortBy !== "newest" && (
                        <div className="text-xs sm:text-sm">
                          {getStatLabel(sortBy)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-400 h-20 sm:h-24 lg:h-32 rounded-b-lg"></div>
                </div>
              )}

              {/* 1st Place */}
              {topGames[0] && (
                <div
                  className="text-center transform hover:scale-105 transition-all duration-300"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-2xl lg:rounded-t-3xl p-6 sm:p-8 lg:p-10 mb-4 shadow-2xl">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 animate-pulse">
                      {getTrophyIcon(1)}
                    </div>
                    <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">
                      🥇
                    </div>
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">
                      {getGameIcon(topGames[0].type)}
                    </div>
                    <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-3 line-clamp-1">
                      {topGames[0].title}
                    </h3>
                    <p className="text-base sm:text-lg opacity-90 mb-4">
                      by {topGames[0].user?.username}
                    </p>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                      {getStatValue(topGames[0], sortBy)}
                      {sortBy !== "newest" && (
                        <div className="text-sm sm:text-base">
                          {getStatLabel(sortBy)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-yellow-500 h-28 sm:h-32 lg:h-40 rounded-b-lg"></div>
                </div>
              )}

              {/* 3rd Place */}
              {topGames[2] && (
                <div
                  className="text-center transform hover:scale-105 transition-all duration-300"
                  data-aos="zoom-in"
                  data-aos-delay="500"
                >
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-2xl lg:rounded-t-3xl p-4 sm:p-6 lg:p-8 mb-4 shadow-xl">
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
                      {getTrophyIcon(3)}
                    </div>
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                      🥉
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
                      {getGameIcon(topGames[2].type)}
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-2 line-clamp-1">
                      {topGames[2].title}
                    </h3>
                    <p className="text-sm sm:text-base opacity-90 mb-3">
                      by {topGames[2].user?.username}
                    </p>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                      {getStatValue(topGames[2], sortBy)}
                      {sortBy !== "newest" && (
                        <div className="text-xs sm:text-sm">
                          {getStatLabel(sortBy)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-orange-500 h-16 sm:h-20 lg:h-28 rounded-b-lg"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div
          className="bg-white/10 rounded-xl sm:rounded-2xl lg:rounded-3xl backdrop-blur overflow-hidden shadow-2xl"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="p-4 sm:p-6 lg:p-8 border-b border-white/20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
              📊{" "}
              {sortBy === "mostPlayed" && "Top Games by Plays"}
              {sortBy === "mostLiked" && "Top Games by Likes"}
              {sortBy === "newest" && "Newest Games"}
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {sortedGames.length === 0 ? (
              <div className="p-8 sm:p-12 lg:p-16 text-center" data-aos="fade-up">
                <div className="text-6xl sm:text-7xl lg:text-8xl mb-6 sm:mb-8">
                  🏆
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  No Games Yet
                </h3>
                <p className="text-indigo-200 text-base sm:text-lg lg:text-xl mb-8">
                  Be the first to create and publish a game!
                </p>
                <Link
                  to="/templates"
                  className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Create First Game
                </Link>
              </div>
            ) : (
              sortedGames.map((game, index) => (
                <div
                  key={game._id}
                  className="p-4 sm:p-6 lg:p-8 hover:bg-white/5 transition-all duration-300 group"
                  data-aos="fade-up"
                  data-aos-delay={700 + index * 50}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Rank */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold min-w-[60px] sm:min-w-[80px] text-center bg-gradient-to-r ${getRankColor(
                          index + 1
                        )} bg-clip-text text-transparent`}
                      >
                        {getRankIcon(index + 1)}
                      </div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl">
                        {getTrophyIcon(index + 1)}
                      </div>
                      <div className="text-3xl sm:text-4xl lg:text-5xl">
                        {getGameIcon(game.type)}
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-indigo-200 text-sm sm:text-base mb-2 line-clamp-2">
                        {game.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
                        <span>by {game.user?.username || "Unknown"}</span>
                        <span className="capitalize bg-purple-500/20 px-2 py-1 rounded-full">
                          {game.type}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-center sm:text-right min-w-[100px] sm:min-w-[120px]">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-400 mb-1">
                        {getStatValue(game, sortBy)}
                      </div>
                      <div className="text-xs sm:text-sm text-indigo-200 mb-2 sm:mb-3">
                        {getStatLabel(sortBy)}
                      </div>

                      {/* Additional Stats */}
                      <div className="flex justify-center sm:justify-end gap-3 sm:gap-4 text-xs text-gray-400">
                        {sortBy !== "mostPlayed" && (
                          <span className="flex items-center gap-1">
                            <span>👾</span>
                            <span>{game.playCount || 0}</span>
                          </span>
                        )}
                        {sortBy !== "mostLiked" && (
                          <span className="flex items-center gap-1">
                            <span>❤️</span>
                            <span>{game.likesCount || 0}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                      <Link
                        to={`/games/${game._id}/play`}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-center text-sm sm:text-base hover:scale-105 active:scale-95"
                      >
                        <span className="sm:hidden">▶️ Play</span>
                        <span className="hidden sm:inline">Play</span>
                      </Link>
                      <Link
                        to={`/games/${game._id}/reviews`}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-center text-sm sm:text-base hover:scale-105 active:scale-95"
                      >
                        <span className="sm:hidden">💬 Reviews</span>
                        <span className="hidden sm:inline">Reviews</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center mt-12 sm:mt-16 lg:mt-20"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Climb the Leaderboard? 🚀
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-indigo-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Create an amazing game and compete with the best creators in our
              community!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/templates"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-center"
              >
                Start Creating
              </Link>
              <Link
                to="/community"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 hover:scale-105 text-center"
              >
                Browse Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
