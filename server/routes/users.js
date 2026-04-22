const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BorrowRecord = require('../models/BorrowRecord');
const Notification = require('../models/Notification');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/users — All users (admin)
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { search, role, status, department } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;
    if (department && department !== 'All') query.department = department;

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// GET /api/users/students — All students (librarian/admin)
router.get('/students', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query).sort({ name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// GET /api/users/:id/borrows — Student's borrow history (librarian/admin)
router.get('/:id/borrows', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const borrows = await BorrowRecord.find({ userId: req.params.id })
      .populate('bookId', 'title authors')
      .sort({ createdAt: -1 });
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student borrows', error: error.message });
  }
});

// DELETE /api/users/:userId/borrows/:borrowId — Remove a borrow from student (admin only)
const Book = require('../models/Book');
router.delete('/:userId/borrows/:borrowId', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const borrow = await BorrowRecord.findOne({ _id: req.params.borrowId, userId: req.params.userId });
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

    // Restore book availability if it was active/pending
    if (['active', 'pending', 'overdue'].includes(borrow.status)) {
      const book = await Book.findById(borrow.bookId);
      if (book) {
        book.availableCopies = Math.min(book.availableCopies + 1, book.totalCopies);
        await book.save();
      }
    }

    await BorrowRecord.findByIdAndDelete(req.params.borrowId);

    await Notification.create({
      userId: req.params.userId,
      message: `An admin has removed a borrow record from your account.`,
      type: 'info',
      link: '/profile?tab=notifications',
    });

    res.json({ message: 'Borrow record deleted and book availability restored' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting borrow record', error: error.message });
  }
});

// PUT /api/users/:id/role — Change role (admin only)
router.put('/:id/role', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'librarian', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Notification.create({
      userId: user._id,
      message: `Your role has been changed to ${role}.`,
      type: 'info',
      link: '/profile?tab=notifications',
    });

    res.json({ message: 'Role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
});

// PUT /api/users/:id/status — Activate/suspend (admin only)
router.put('/:id/status', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

// DELETE /api/users/:id — Delete user (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;
