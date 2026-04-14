import { Link } from 'react-router-dom';
import { BookMarked, RefreshCw, Smartphone, User, Bell, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';

const StudentDashboard = () => {
  const { user, dbUser } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recBooks, setRecBooks] = useState([]);

  useEffect(() => {
    if (user) {
      Promise.all([
        API.get('/borrows/my').catch(() => ({ data: [] })),
        API.get('/notifications').catch(() => ({ data: [] })),
        API.get(`/books?department=${dbUser?.department || 'CSE'}&limit=4`).catch(() => ({ data: { books: [] } })),
      ]).then(([b, n, rb]) => {
        setBorrows(b.data);
        setNotifications(n.data.slice(0, 5));
        setRecBooks(rb.data.books || []);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, dbUser]);

  if (loading) return <Spinner />;

  const activeBorrows = borrows.filter(b => b.status === 'active' || b.status === 'overdue' || b.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 page-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-100 dark:border-slate-700">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Hello, {dbUser?.name || 'Student'} 👋</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Department of {dbUser?.department || 'CSE'}, {dbUser?.year || '1st'} Year
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Borrowed</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-amber-500">
              {activeBorrows.length} <span className="text-lg font-normal text-slate-800 dark:text-slate-200">/ {dbUser?.borrowLimit || 3}</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionCard to="/books" icon={<BookMarked className="h-6 w-6 text-blue-600" />} label="Browse Books" />
          <ActionCard to="/renew" icon={<RefreshCw className="h-6 w-6 text-amber-500" />} label="Renew a Book" />
          <ActionCard to="/ebooks" icon={<Smartphone className="h-6 w-6 text-emerald-500" />} label="Read E-Books" />
          <ActionCard to="/profile" icon={<User className="h-6 w-6 text-purple-600" />} label="My Profile" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Borrowed Books */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Borrowed Books</h2>
                <Link to="/renew" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Manage & Renew</Link>
              </div>
              
              {activeBorrows.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="font-medium">No borrowed books</p>
                  <Link to="/books" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block">Browse the catalog</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                        <th className="pb-3 font-medium">Book Title</th>
                        <th className="pb-3 font-medium">Due Date</th>
                        <th className="pb-3 font-medium">Remaining</th>
                        <th className="pb-3 font-medium">Fine</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {activeBorrows.map(book => (
                        <tr key={book._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-4">
                            <p className="font-semibold">{book.bookId?.title || 'Book'}</p>
                            <p className="text-slate-500 text-xs">{book.bookId?.authors?.join(', ')}</p>
                          </td>
                          <td className="py-4 whitespace-nowrap">{new Date(book.dueDate).toLocaleDateString()}</td>
                          <td className={`py-4 font-medium ${book.remaining < 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                            {book.remaining < 0 ? `${Math.abs(book.remaining)} days late` : `${book.remaining} days`}
                          </td>
                          <td className="py-4">Tk {book.fine || 0}</td>
                          <td className="py-4"><StatusBadge status={book.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-blue-600 dark:text-amber-500" />
                <h2 className="text-lg font-bold">Recent Alerts</h2>
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">No new notifications</p>
              ) : (
                <ul className="space-y-3">
                  {notifications.map(n => (
                    <li key={n._id} className={`p-3 rounded-lg text-sm border ${
                      n.type === 'error' || n.type === 'warning'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-100 dark:border-red-900/30'
                        : n.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30'
                        : 'bg-blue-50 dark:bg-slate-700 text-blue-800 dark:text-slate-200 border-blue-100 dark:border-slate-600'
                    }`}>
                      {n.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold mb-4">Recommended for You</h2>
              <div className="space-y-4">
                {recBooks.map(book => (
                  <Link key={book._id} to={`/books/${book._id}`} className="flex gap-3 items-center group">
                    <div className="h-16 w-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded shadow-sm flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-400 dark:text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold group-hover:text-amber-600 transition-colors line-clamp-1">{book.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{book.authors?.[0]}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/books" className="block text-center text-sm font-medium text-blue-600 dark:text-blue-400 mt-6 hover:underline">
                View all {dbUser?.department || 'CSE'} books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ to, icon, label }) => (
  <Link to={to} className="bg-white dark:bg-slate-800 p-6 flex flex-col items-center justify-center rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all hover:-translate-y-1 group">
    <div className="mb-3 bg-blue-50 dark:bg-slate-700 p-3 rounded-full group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm text-center">{label}</span>
  </Link>
);

export default StudentDashboard;
