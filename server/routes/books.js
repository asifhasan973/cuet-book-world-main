const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Review = require('../models/Review');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/books — List books with filters
router.get('/', async (req, res) => {
  try {
    const { search, department, category, availability, sort, page = 1, limit = 12, ebook } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (category && category !== 'All') {
      query.subject = category;
    }

    if (availability === 'available') {
      query.availableCopies = { $gt: 0 };
    } else if (availability === 'borrowed') {
      query.availableCopies = 0;
    }

    if (ebook === 'true') {
      query.isEbook = true;
    } else if (ebook === 'false') {
      query.isEbook = false;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'alphabetical') sortOption = { title: 1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popular') sortOption = { reviewCount: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      books,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// GET /api/books/:id — Single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ bookId: book._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ book, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

// POST /api/books — Add book (librarian/admin)
router.post('/', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ message: 'Book added', book });
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
});

// PUT /api/books/:id — Edit book
router.put('/:id', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book updated', book });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
});

// DELETE /api/books/:id — Delete book
router.delete('/:id', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});

// POST /api/books/:id/review — Add review
router.post('/:id/review', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check if user already reviewed
    const existing = await Review.findOne({ bookId: book._id, userId: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this book' });

    const review = await Review.create({
      bookId: book._id,
      userId: req.user._id,
      userName: req.user.name,
      rating,
      comment,
    });

    // Update book rating
    const allReviews = await Review.find({ bookId: book._id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    book.rating = Math.round(avgRating * 10) / 10;
    book.reviewCount = allReviews.length;
    await book.save();

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

module.exports = router;
