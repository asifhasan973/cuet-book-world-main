import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, BookMarked, Users, FileText, Upload, ChevronLeft, ChevronRight, LogOut, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ role: roleProp }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { dbUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Use prop if explicitly passed (for safety), else fall back to dbUser
  const role = roleProp || dbUser?.role || 'librarian';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const librarianLinks = [
    { to: '/librarian/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/librarian/books', icon: BookMarked, label: 'Manage Books' },
    { to: '/librarian/ebooks', icon: Upload, label: 'E-Books' },
    { to: '/librarian/students', icon: Users, label: 'Students' },
    { to: '/librarian/reports', icon: FileText, label: 'Reports' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/analytics', icon: FileText, label: 'Analytics' },
    { to: '/librarian/books', icon: BookMarked, label: 'Manage Books' },
    { to: '/librarian/ebooks', icon: Upload, label: 'E-Books' },
    { to: '/librarian/students', icon: Users, label: 'Students' },
  ];

  const links = role === 'admin' ? adminLinks : librarianLinks;

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-screen transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-amber-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">
              {role === 'admin' ? 'Admin Panel' : 'Librarian'}
            </span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && dbUser && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {dbUser.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{dbUser.name}</p>
              <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                role === 'admin' 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' 
                  : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              }`}>{role}</span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-2 space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
              title={collapsed ? link.label : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors w-full"
          title={collapsed ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : ''}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 flex-shrink-0" /> : <Moon className="h-5 w-5 flex-shrink-0" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          title={collapsed ? 'Back to Site' : ''}
        >
          <BookOpen className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
          title={collapsed ? 'Log Out' : ''}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

