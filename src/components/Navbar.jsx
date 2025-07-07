import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import Logo from "../assets/game-controller.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const publicNavItems = [
    { name: "Home", path: "/" },
    { name: "Community", path: "/community" },
    { name: "Games", path: "/games" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const privateNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Templates", path: "/templates" },
    { name: "My Games", path: "/my-games" },
  ];

  const navItems = isAuthenticated ? [...publicNavItems, ...privateNavItems] : publicNavItems;

  return (
    <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50 navbar-compact">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Title - More compact */}
          <Link
            to="/"
            className="flex items-center logo-responsive font-extrabold text-white tracking-tight flex-shrink-0 mr-2 sm:mr-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={Logo} alt="Logo" className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
            {/* Responsive logo text */}
            <span className="hidden xl:inline">CodeToGame</span>
            <span className="hidden lg:inline xl:hidden">C2G</span>
            <span className="lg:hidden">CTG</span>
          </Link>

          {/* Desktop Navigation - More compact */}
          <div className="hidden lg:flex items-center justify-center flex-1 desktop-nav">
            <div className="nav-items-container">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-item font-medium hover:text-indigo-400 transition rounded-md ${
                    location.pathname === item.path
                      ? "text-indigo-400 font-semibold bg-gray-700"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Section - Compact */}
          <div className="hidden lg:flex items-center auth-section">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-300 username-text">
                  Hi, {user?.username || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-full transition text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-3 py-1.5 rounded-full transition text-xs"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* Close icon */}
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mobile-nav">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-700 rounded-lg mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600 transition ${
                    location.pathname === item.path
                      ? "text-indigo-400 font-semibold bg-gray-600"
                      : "text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="pt-2 border-t border-gray-600">
                  <div className="px-3 py-2 text-sm text-gray-300">
                    Hi, {user?.username || 'User'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-600">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-cyan-400 text-black hover:bg-cyan-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
