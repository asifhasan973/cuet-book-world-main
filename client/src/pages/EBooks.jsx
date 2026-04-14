import { useState, useEffect } from 'react';
import { Search, BookOpen, Eye, Download, ExternalLink } from 'lucide-react';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const EBooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchEbooks = async () => {
      setLoading(true);
      try {
        const params = { ebook: 'true' };
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        const res = await API.get('/books', { params });
        setEbooks(res.data.books || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchEbooks, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const categories = ['All', 'Algorithms', 'Programming', 'Artificial Intelligence', 'Data Science', 'Deep Learning', 'Software Engineering', 'Mathematics', 'Python'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">E-Books Library</h1>
          <p className="text-slate-500 dark:text-slate-400">Search and read academic e-books online from anywhere</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <div className="pl-4 flex items-center"><Search className="h-5 w-5 text-slate-400" /></div>
            <input type="text" placeholder="Search e-books..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 px-4 py-2.5 w-full outline-none text-slate-700 dark:text-slate-200 text-sm" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-700 dark:text-slate-300 shadow-sm">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? <Spinner /> : ebooks.length === 0 ? (
          <EmptyState title="No e-books found" message="Try a different search term." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ebooks.map(book => (
              <div key={book._id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group">
                <div className="aspect-[2/3] w-full bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-700 dark:to-slate-600 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="h-full w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`${book.coverImage ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center`}>
                    <BookOpen className="h-16 w-16 text-emerald-300 dark:text-emerald-500 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{book.subject?.[0]}</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1 mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">{book.authors?.join(', ')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{book.description}</p>
                <div className="flex items-center justify-between mb-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {book.viewCount || 0} reads</span>
                  <span className="flex items-center gap-1 text-amber-500"><span className="font-semibold">★ {book.rating}</span></span>
                </div>
                <div className="flex gap-2">
                  {book.ebookLink && (
                    <>
                      <a href={book.ebookLink} target="_blank" rel="noopener noreferrer"
                        className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Read Online
                      </a>
                      <a href={book.ebookLink} download target="_blank" rel="noopener noreferrer"
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
                        title="Download PDF">
                        <Download className="h-4 w-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EBooks;
