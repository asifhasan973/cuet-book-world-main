import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Bell, Moon, Sun, User, Menu, X, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef(null);

  // Fetch unread notification count
  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    const fetchCount = async () => {
      try {
        const res = await API.get('/notifications');
        setUnreadCount(res.data.filter(n => !n.read).length);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/books', label: 'Book List' },
    { to: '/ebooks', label: 'E-Books' },
    { to: '/renew', label: 'Renew' },
  ];

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 border-b border-slate-100 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-amber-500" />
            <Link to="/" className="text-xl font-bold text-slate-800 dark:text-white">
              CUET Bookworld
            </Link>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  isActive(link.to)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-slate-700 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <>
                {/* Notification Bell */}
                <Link
                  to="/profile?tab=notifications"
                  className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-700 transition-colors relative"
                  onClick={() => setUnreadCount(0)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-0.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {(dbUser?.name || user.email)?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <p className="font-semibold text-sm text-slate-800 dark:text-white">{dbUser?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {dbUser?.role || 'student'}
                        </span>
                      </div>

                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <User className="h-4 w-4" /> My Profile
                      </Link>

                      {dbUser?.role === 'student' && (
                        <Link to="/home" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                      )}

                      {(dbUser?.role === 'librarian' || dbUser?.role === 'admin') && (
                        <Link to={dbUser.role === 'admin' ? '/admin/dashboard' : '/librarian/dashboard'} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> {dbUser.role === 'admin' ? 'Admin Panel' : 'Librarian Dashboard'}
                        </Link>
                      )}

                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>

                      <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors">
                          <LogOut className="h-4 w-4" /> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 pb-4">
          <div className="px-4 pt-2 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
