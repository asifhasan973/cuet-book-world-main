import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { AlertCircle, CheckCircle, Info, Calendar, Clock, Video, ExternalLink, RefreshCw, XCircle } from 'lucide-react';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

const RenewPage = () => {
  const { user, dbUser } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [form, setForm] = useState({ preferredDate: '', preferredTime: '9:00 AM', notes: '' });
  const [selectedBorrow, setSelectedBorrow] = useState('');
  const [activeTab, setActiveTab] = useState('apply');

  const fetchData = async () => {
    if (!user) { setLoading(false); return; }
    try {
      const [borrowRes, renewalRes] = await Promise.all([
        API.get('/borrows/my'),
        API.get('/renewals/my'),
      ]);
      setBorrows((borrowRes.data || []).filter(b => b.status === 'active' || b.status === 'overdue'));
      setRenewals(renewalRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBorrow) { setMessage({ text: 'Please select a book to renew.', type: 'error' }); return; }
    setSubmitting(true);
    try {
      const res = await API.post('/renewals', { borrowId: selectedBorrow, ...form });
      setMessage({ text: res.data.message || 'Renewal request submitted!', type: 'success' });
      setSelectedBorrow('');
      setForm({ preferredDate: '', preferredTime: '9:00 AM', notes: '' });
      setActiveTab('requests');
      await fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error submitting renewal', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <EmptyState title="Login Required" message="Please login to manage your book renewals." />
    </div>
  );

  const approvedRenewals = renewals.filter(r => r.status === 'approved');
  const pendingRenewals = renewals.filter(r => r.status === 'pending');
  const completedRenewals = renewals.filter(r => r.status === 'completed');
  const rejectedRenewals = renewals.filter(r => r.status === 'rejected');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Renew Your Borrowed Books</h1>
          <p className="text-slate-500 dark:text-slate-400">Apply for renewal, track your requests, and join video consultations</p>
        </div>

        {/* Rules Panel */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-blue-800 dark:text-blue-300">Borrowing Rules & Renewal Process</h2>
          </div>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li>• 1st, 2nd, and 3rd year students can borrow up to <strong>3 books</strong></li>
            <li>• 4th year students can borrow up to <strong>4 books</strong></li>
            <li>• Books can be renewed within <strong>30 days</strong> from the borrow date</li>
            <li>• After 30 days, a fine of <strong>1 Tk per day per book</strong> will be applied</li>
            <li>• Renewal requires a <strong>video consultation</strong> — you'll receive a meeting link when approved</li>
          </ul>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {[
            { key: 'apply', label: 'Apply for Renewal', icon: RefreshCw },
            { key: 'requests', label: `My Requests (${renewals.length})`, icon: Calendar },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : (
          <>
            {/* Apply Tab */}
            {activeTab === 'apply' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Renewal Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Apply for Renewal Slot</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Select Book to Renew</label>
                      <select value={selectedBorrow} onChange={e => setSelectedBorrow(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent dark:bg-slate-800 text-sm">
                        <option value="">-- Select a book --</option>
                        {borrows.map(b => (
                          <option key={b._id} value={b._id}>{b.bookId?.title || 'Book'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Preferred Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="date" value={form.preferredDate} onChange={e => setForm({...form, preferredDate: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-sm" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Preferred Time Slot</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select value={form.preferredTime} onChange={e => setForm({...form, preferredTime: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent dark:bg-slate-800 text-sm">
                          {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Additional Notes</label>
                      <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-sm resize-none" rows={3}
                        placeholder="Any additional information..." />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-60 transition-colors">
                      {submitting ? 'Submitting...' : 'Apply for Renewal'}
                    </button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">After approval, you'll receive a video meeting link for the consultation.</p>
                  </form>
                </div>

                {/* Current Borrows Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">My Current Borrows</h2>
                  {borrows.length === 0 ? (
                    <EmptyState title="No active borrows" message="You don't have any borrowed books to renew." />
                  ) : (
                    <div className="space-y-4">
                      {borrows.map(b => (
                        <div key={b._id} className={`p-4 rounded-xl border ${b.status === 'overdue' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{b.bookId?.title}</h3>
                            <StatusBadge status={b.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>Borrow: {new Date(b.borrowDate).toLocaleDateString()}</span>
                            <span>Due: {new Date(b.dueDate).toLocaleDateString()}</span>
                            <span className={b.remaining < 0 ? 'text-red-500 font-medium' : ''}>
                              {b.remaining < 0 ? `${Math.abs(b.remaining)} days late` : `${b.remaining} days left`}
                            </span>
                            {b.fine > 0 && <span className="text-red-500 font-medium">Fine: {b.fine} Tk</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                {/* Approved — with meeting links */}
                {approvedRenewals.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-emerald-200 dark:border-emerald-800">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Video className="h-5 w-5 text-emerald-500" />
                      Scheduled Consultations
                    </h2>
                    <div className="space-y-4">
                      {approvedRenewals.map(r => (
                        <div key={r._id} className="p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-slate-800 dark:text-white">{r.borrowId?.bookId?.title || 'Book'}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Approved by: {r.approvedBy?.name || 'Librarian'}
                              </p>
                            </div>
                            <StatusBadge status="approved" />
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-emerald-500" />
                              {r.scheduledDate ? new Date(r.scheduledDate).toLocaleDateString() : new Date(r.preferredDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-emerald-500" />
                              {r.scheduledTime || r.preferredTime}
                            </span>
                          </div>
                          {r.meetingLink && (
                            <a
                              href={r.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                            >
                              <Video className="h-4 w-4" />
                              Join Video Meeting
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending */}
                {pendingRenewals.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      Pending Requests
                    </h2>
                    <div className="space-y-3">
                      {pendingRenewals.map(r => (
                        <div key={r._id} className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{r.borrowId?.bookId?.title || 'Book'}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Requested: {new Date(r.preferredDate).toLocaleDateString()} at {r.preferredTime}
                              </p>
                              {r.notes && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Note: {r.notes}</p>
                              )}
                            </div>
                            <StatusBadge status="pending" />
                          </div>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Waiting for librarian approval. You'll be notified when scheduled.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed */}
                {completedRenewals.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      Completed Renewals
                    </h2>
                    <div className="space-y-3">
                      {completedRenewals.map(r => (
                        <div key={r._id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{r.borrowId?.bookId?.title || 'Book'}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Completed on: {r.completedAt ? new Date(r.completedAt).toLocaleDateString() : '--'}
                              </p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              Renewed ✓
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected */}
                {rejectedRenewals.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Rejected Requests
                    </h2>
                    <div className="space-y-3">
                      {rejectedRenewals.map(r => (
                        <div key={r._id} className="p-4 border border-red-200 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{r.borrowId?.bookId?.title || 'Book'}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Requested: {new Date(r.preferredDate).toLocaleDateString()}
                              </p>
                            </div>
                            <StatusBadge status="rejected" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {renewals.length === 0 && (
                  <EmptyState title="No renewal requests" message="You haven't submitted any renewal requests yet. Go to the 'Apply for Renewal' tab to get started." />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RenewPage;
