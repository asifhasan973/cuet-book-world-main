import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Video as VideoIcon, Calendar, Clock, Users, Plus, ExternalLink } from 'lucide-react';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

const VideoPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ topic: '', preferredDate: '', preferredTime: '10:00 AM', type: 'one-on-one' });

  useEffect(() => {
    if (user) {
      API.get('/videos/my').then(res => setSessions(res.data)).catch(console.error).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/videos', form);
      setMessage('Session request submitted!');
      const res = await API.get('/videos/my');
      setSessions(res.data);
      setForm({ topic: '', preferredDate: '', preferredTime: '10:00 AM', type: 'one-on-one' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <EmptyState title="Login Required" message="Please login to schedule video consultations." />
    </div>
  );

  const upcoming = sessions.filter(s => s.status === 'approved');
  const pending = sessions.filter(s => s.status === 'pending');
  const past = sessions.filter(s => s.status === 'completed' || s.status === 'rejected');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Academic Video Consultations</h1>
          <p className="text-slate-500 dark:text-slate-400">Connect with librarians or join group study sessions</p>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5" /> Request a Session
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Topic / Reason</label>
                <input type="text" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} required
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-sm"
                  placeholder="e.g. Research paper discussion" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Date</label>
                  <input type="date" value={form.preferredDate} onChange={e => setForm({...form, preferredDate: e.target.value})} required
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Time</label>
                  <select value={form.preferredTime} onChange={e => setForm({...form, preferredTime: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent dark:bg-slate-800 text-sm">
                    {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Session Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent dark:bg-slate-800 text-sm">
                  <option value="one-on-one">One-on-One with Librarian</option>
                  <option value="group">Group Study Session</option>
                </select>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-60 transition-colors">
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>

          {/* Sessions List */}
          <div className="space-y-6">
            {/* Upcoming */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-emerald-500" /> Upcoming Sessions
              </h2>
              {upcoming.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">No upcoming sessions</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map(s => (
                    <div key={s._id} className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{s.topic}</h3>
                        <StatusBadge status={s.status} />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <p className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(s.preferredDate).toLocaleDateString()} at {s.preferredTime}</p>
                        {s.hostName && <p className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Host: {s.hostName}</p>}
                      </div>
                      {s.meetingLink && (
                        <a href={s.meetingLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" /> Join Meeting
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending */}
            {pending.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Pending Requests</h2>
                <div className="space-y-3">
                  {pending.map(s => (
                    <div key={s._id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{s.topic}</h3>
                        <StatusBadge status="pending" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(s.preferredDate).toLocaleDateString()} at {s.preferredTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
