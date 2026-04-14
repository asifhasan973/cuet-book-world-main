import { Link } from 'react-router-dom';
import { BookMarked, RefreshCw, Smartphone, Video, ArrowRight, Library, Users, BookOpen, Megaphone } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';

const LandingPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    API.get('/announcements').then(res => setAnnouncements(res.data)).catch(() => { });
    API.get('/books?limit=6&sort=rating').then(res => setFeaturedBooks(res.data.books || [])).catch(() => { });
  }, []);

  return (
    <div className="flex flex-col min-h-screen page-enter">
      {/* Announcement Banner */}
      {announcements.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm">
            <Megaphone className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-amber-800 dark:text-amber-300 font-medium">{announcements[0].message}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10 pt-10 pb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 text-sm text-blue-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now serving 2,500+ academic resources
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Welcome to <span className="text-amber-400">CUET Bookworld</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto font-light">
            Your digital gateway to CUET's academic library — borrow, read, and learn from anywhere.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/books" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Browse Books
            </Link>
            <Link to="/auth" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-full transition-all backdrop-blur-sm flex items-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-slate-800 shadow-lg py-8 relative -mt-8 mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-9xl rounded-2xl z-20 border border-slate-100 dark:border-slate-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center px-10">
          <CounterStat value={2500} label="Total Books" suffix="+" />
          <CounterStat value={1200} label="Registered Students" suffix="+" />
          <CounterStat value={400} label="E-Books Available" suffix="+" />
          <CounterStat value={12} label="Departments Covered" suffix="+" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Everything You Need</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Access resources, manage your borrows, and connect with librarians all in one seamless platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<BookMarked className="h-8 w-8 text-blue-500" />} title="Online Borrowing" desc="Reserve books online and pick them up at your convenience." />
            <FeatureCard icon={<RefreshCw className="h-8 w-8 text-amber-500" />} title="Easy Renewal" desc="Renew your borrowed books with just a few clicks." />
            <FeatureCard icon={<Smartphone className="h-8 w-8 text-emerald-500" />} title="Read Anywhere" desc="Access hundreds of academic e-books on any device." />
            <FeatureCard icon={<Video className="h-8 w-8 text-purple-500" />} title="Video Consultations" desc="Schedule virtual meetings with librarians for research help." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white dark:bg-slate-800 px-4 border-t border-slate-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Simple steps to get your hands on academic resources.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 -z-0" />
            <StepCard number="1" icon={<Users />} title="Register" desc="Sign up with your CUET email" />
            <StepCard number="2" icon={<Library />} title="Browse & Borrow" desc="Find what you need in the catalog" />
            <StepCard number="3" icon={<BookOpen />} title="Read or Pickup" desc="Read online or collect locally" />
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Top Rated Books</h2>
                <p className="text-slate-600 dark:text-slate-400">Discover the most popular books in our collection.</p>
              </div>
              <Link to="/books" className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredBooks.map(book => (
                <Link key={book._id} to={`/books/${book._id}`} className="group bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                  <div className="aspect-[2/3] w-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-lg mb-3 relative overflow-hidden flex items-center justify-center">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-full w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`${book.coverImage ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center`}>
                      <BookOpen className="h-10 w-10 text-blue-400 dark:text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{book.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{book.authors?.[0]}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-amber-500" />
              <span className="text-xl font-bold text-white">CUET Bookworld</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              The digital center for academic excellence at Chittagong University of Engineering & Technology.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to="/books" className="hover:text-amber-400 transition-colors">Book List</Link></li>
              <li><Link to="/ebooks" className="hover:text-amber-400 transition-colors">E-Books</Link></li>
              <li><Link to="/renew" className="hover:text-amber-400 transition-colors">Renew Books</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Email: library@cuet.ac.bd</li>
              <li>Phone: +880-31-XXXXXX</li>
              <li>Address: CUET, Chittagong-4349, Bangladesh</li>
              <li>Hours: Sat–Thu: 8:00 AM – 8:00 PM</li>
              <li>Friday: Closed</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} CUET Bookworld. Built with ❤️ for CUET students — Group A1-06.
        </div>
      </footer>
    </div>
  );
};

// Animated Counter Component
const CounterStat = ({ value, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const duration = 2000;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          setCount(Math.floor(progress * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref}>
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{count.toLocaleString()}{suffix}</div>
      <div className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">{label}</div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow group">
    <div className="bg-blue-50 dark:bg-slate-700 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ number, icon, title, desc }) => (
  <div className="flex flex-col items-center text-center bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-[280px] relative z-10">
    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-blue-200 dark:shadow-none border-4 border-white dark:border-slate-800 ring-4 ring-slate-50 dark:ring-slate-700 transition-transform transform hover:scale-110">
      {number}
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);

export default LandingPage;
