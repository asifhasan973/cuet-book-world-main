import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Contact & Support</h1>
          <p className="text-slate-500 dark:text-slate-400">Get in touch with the CUET Library team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Send Us a Message</h2>

            {sent && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-sm" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-sm" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-sm" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Message</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-sm resize-none" rows={5} placeholder="Tell us more..." />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Contact Information</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg"><Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-white">Email</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">library@cuet.ac.bd</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg"><Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div>
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-white">Phone</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">+880-31-XXXXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg"><MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" /></div>
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-white">Address</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">CUET Library, Chittagong-4349, Bangladesh</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg"><Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div>
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-white">Library Hours</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Sat–Thu: 8:00 AM – 8:00 PM</p>
                    <p className="text-sm text-red-500">Friday: Closed</p>
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

export default ContactPage;
