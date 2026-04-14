import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import { User, Mail, BookMarked, Calendar, Shield, Bell, Save } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const ProfilePage = () => {
  const { user, dbUser, setDbUser } = useAuth();
  const location = useLocation();
  const [borrows, setBorrows] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('borrows');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Read ?tab= from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    if (user) {
      Promise.all([
        API.get('/borrows/my').catch(() => ({ data: [] })),
        API.get('/notifications').catch(() => ({ data: [] })),
      ]).then(([b, n]) => {
        setBorrows(b.data);
        setNotifications(n.data);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // Mark all as read when notifications tab is opened
  useEffect(() => {
    if (activeTab === 'notifications' && notifications.some(n => !n.read)) {
      API.put('/notifications/read-all').then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }).catch(() => {});
    }
  }, [activeTab]);

  useEffect(() => {
    if (dbUser) {
      setEditForm({
        name: dbUser.name || '',
        department: dbUser.department || '',
        year: dbUser.year || '',
        studentId: dbUser.studentId || '',
      });
    }
  }, [dbUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', editForm);
      setDbUser(res.data.user);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <EmptyState title="Login Required" message="Please login to view your profile." />;
  if (loading) return <Spinner />;

  const activeBorrows = borrows.filter(b => b.status === 'active' || b.status === 'overdue');
  const history = borrows.filter(b => b.status === 'returned');
  const tabs = [
    { key: 'borrows', label: 'Active Borrows' },
    { key: 'history', label: 'History' },
    { key: 'notifications', label: `Notifications (${notifications.filter(n => !n.read).length})` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Your Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                {dbUser?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{dbUser?.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{dbUser?.email}</p>
              <StatusBadge status={dbUser?.status || 'active'} />
            </div>

            {editing ? (
              <div className="space-y-3">
                <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm" placeholder="Name" />
                <input value={editForm.studentId} onChange={e => setEditForm({...editForm, studentId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm" placeholder="Student ID" />
                <select value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:bg-slate-800 text-sm">
                  {['CSE', 'EEE', 'CE', 'ME', 'URP', 'ECE', 'MSE', 'Architecture'].map(d => <option key={d}>{d}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-1">
                    <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-700 pt-4">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span>ID: {dbUser?.studentId || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <BookMarked className="h-4 w-4 flex-shrink-0" />
                    <span>{dbUser?.department} • {dbUser?.year} Year</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    <span className="capitalize">Role: {dbUser?.role}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Since {new Date(dbUser?.memberSince || dbUser?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => setEditing(true)} className="w-full mt-4 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              {activeTab === 'borrows' && (
                activeBorrows.length === 0 ? <EmptyState title="No active borrows" message="You don't have any borrowed books." /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          <th className="pb-3 font-medium">Book</th>
                          <th className="pb-3 font-medium">Due Date</th>
                          <th className="pb-3 font-medium">Days</th>
                          <th className="pb-3 font-medium">Fine</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBorrows.map(b => (
                          <tr key={b._id} className="border-b border-slate-100 dark:border-slate-700/50">
                            <td className="py-3 font-medium text-slate-800 dark:text-white">{b.bookId?.title || 'Book'}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">{new Date(b.dueDate).toLocaleDateString()}</td>
                            <td className={`py-3 ${b.remaining < 0 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>
                              {b.remaining < 0 ? `${Math.abs(b.remaining)}d late` : `${b.remaining}d left`}
                            </td>
                            <td className="py-3">{b.fine > 0 ? `${b.fine} Tk` : '-'}</td>
                            <td className="py-3"><StatusBadge status={b.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {activeTab === 'history' && (
                history.length === 0 ? <EmptyState title="No history" message="Your completed borrows will appear here." /> : (
                  <div className="space-y-3">
                    {history.map(b => (
                      <div key={b._id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm text-slate-800 dark:text-white">{b.bookId?.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Returned: {new Date(b.returnDate).toLocaleDateString()}</p>
                        </div>
                        <StatusBadge status="returned" />
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'notifications' && (
                notifications.length === 0 ? <EmptyState title="No notifications" message="You're all caught up!" /> : (
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n._id} className={`p-4 rounded-xl border text-sm ${
                        n.read ? 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400' 
                        : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 text-slate-800 dark:text-slate-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <Bell className={`h-4 w-4 mt-0.5 flex-shrink-0 ${n.read ? 'text-slate-400' : 'text-blue-500'}`} />
                          <div>
                            <p>{n.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
