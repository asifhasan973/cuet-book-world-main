import { useState, useEffect } from 'react';
import { Search, Filter, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ebook: 'false' };
      if (searchTerm) params.search = searchTerm;
      if (deptFilter !== 'All') params.department = deptFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (sortBy === 'alphabetical') params.sort = 'alphabetical';
      if (sortBy === 'rating') params.sort = 'rating';

      const res = await API.get('/books', { params });
      setBooks(res.data.books || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, deptFilter, categoryFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchBooks();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const departments = ['All', 'CSE', 'EEE', 'CE', 'ME', 'URP'];
  const categories = ['All', 'Algorithms', 'Networks', 'Operating Systems', 'AI', 'Database', 'Mathematics', 'Programming', 'Circuits', 'Structures', 'Thermodynamics'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Book Catalog</h1>
            <p className="text-slate-500 dark:text-slate-400">Browse and borrow academic books from CUET Bookworld</p>
          </div>
          <div className="flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 w-full md:w-auto overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <div className="pl-4 flex items-center"><Search className="h-5 w-5 text-slate-400" /></div>
            <input 
              type="text" 
              placeholder="Search by title or author..."
              className="bg-transparent border-none focus:ring-0 px-4 py-2.5 w-full md:w-64 outline-none text-slate-700 dark:text-slate-200 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Department:</span>
          </div>
          <div className="flex flex-wrap gap-2 flex-grow">
            {departments.map(dept => (
              <button key={dept} onClick={() => { setDeptFilter(dept); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${deptFilter === dept ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                {dept}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm outline-none text-slate-700 dark:text-slate-300">
              <option value="newest">Newest</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Book Grid */}
        {loading ? (
          <Spinner />
        ) : books.length === 0 ? (
          <EmptyState title="No books found" message="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map(book => (
                <div key={book._id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all flex flex-col group">
                  <div className="aspect-[2/3] w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
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
                      <BookOpen className="h-16 w-16 text-blue-300 dark:text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    {book.availableCopies === 1 && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">1 Left!</span>
                    )}
                    {book.availableCopies === 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">Unavailable</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">{book.subject?.[0]}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{book.department?.[0]}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">{book.authors?.join(', ')}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-2 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${book.availableCopies > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className={book.availableCopies > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                          {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Borrowed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="h-4 w-4 fill-current" /> {book.rating}
                      </div>
                    </div>
                    <Link to={`/books/${book._id}`} className="w-full text-center block bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 py-2.5 rounded-xl font-medium transition-colors text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default BookCatalog;
