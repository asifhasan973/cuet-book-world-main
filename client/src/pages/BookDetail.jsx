import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Star, ArrowLeft, Calendar, Users, Tag, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';

const BookDetail = () => {
  const { id } = useParams();
  const { user, dbUser } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowModal, setBorrowModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [message, setMessage] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data.book);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    setBorrowing(true);
    try {
      await API.post('/borrows', { bookId: id });
      setMessage('Borrow request submitted successfully!');
      setBorrowModal(false);
      // Refresh book data
      const res = await API.get(`/books/${id}`);
      setBook(res.data.book);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting borrow request');
    } finally {
      setBorrowing(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await API.post(`/books/${id}/review`, reviewForm);
      const res = await API.get(`/books/${id}`);
      setBook(res.data.book);
      setReviews(res.data.reviews || []);
      setReviewForm({ rating: 5, comment: '' });
      setMessage('Review submitted!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Spinner size="lg" />;
  if (!book) return <div className="p-8 text-center text-slate-500">Book not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-5xl mx-auto">
        <Link to="/books" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> {message}
          </div>
        )}

        {/* Book Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center p-8 min-h-[300px]">
              {book.coverImage && !imgError ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="max-h-[350px] w-auto object-contain rounded-lg shadow-lg"
                  onError={() => setImgError(true)}
                />
              ) : (
                <BookOpen className="h-32 w-32 text-blue-300 dark:text-blue-500" />
              )}
            </div>
            <div className="md:w-2/3 p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {book.subject?.map(s => (
                  <span key={s} className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">{s}</span>
                ))}
                {book.department?.map(d => (
                  <span key={d} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{d}</span>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{book.title}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">{book.authors?.join(', ')}</p>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                {book.publisher && <span>Publisher: {book.publisher}</span>}
                {book.edition && <span>• Edition: {book.edition}</span>}
                {book.year && <span>• Year: {book.year}</span>}
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(book.rating)} />
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{book.rating}</span>
                  <span className="text-sm text-slate-500">({book.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <StatusBadge status={book.availableCopies > 0 ? 'available' : 'overdue'} />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {book.availableCopies} of {book.totalCopies} copies available
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{book.description}</p>

              <div className="flex gap-3">
                {user && book.availableCopies > 0 && (
                  <button onClick={() => setBorrowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
                    Borrow This Book
                  </button>
                )}
                {book.ebookLink && (
                  <a href={book.ebookLink} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
                    Read Online
                  </a>
                )}
                {!user && (
                  <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
                    Login to Borrow
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Student Reviews</h2>

          {user && (
            <form onSubmit={handleReview} className="mb-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">Write a Review</h3>
              <div className="mb-4">
                <StarRating rating={reviewForm.rating} onChange={(r) => setReviewForm({...reviewForm, rating: r})} interactive />
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-sm resize-none"
                rows={3}
                placeholder="Share your thoughts about this book..."
              />
              <button type="submit" disabled={submittingReview} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-60">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">
                        {review.userName?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-sm text-slate-800 dark:text-white">{review.userName}</span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  {review.comment && <p className="text-sm text-slate-600 dark:text-slate-400 ml-11">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Borrow Modal */}
        <Modal isOpen={borrowModal} onClose={() => setBorrowModal(false)} title="Borrow Book" size="sm">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
              {book.coverImage && (
                <img src={book.coverImage} alt="" className="h-16 w-12 object-cover rounded-lg" />
              )}
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">{book.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{book.authors?.join(', ')}</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Borrowing Rules:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                <li>1st-3rd year: max 3 books</li>
                <li>4th year: max 4 books</li>
                <li>30-day borrow period</li>
                <li>Fine: 1 Tk/day after due date</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setBorrowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                Cancel
              </button>
              <button onClick={handleBorrow} disabled={borrowing} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-60">
                {borrowing ? 'Submitting...' : 'Confirm Borrow'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BookDetail;
