const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const RenewalRequest = require('../models/RenewalRequest');
const BorrowRecord = require('../models/BorrowRecord');
const Notification = require('../models/Notification');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Generate a unique Jitsi Meet link
const generateMeetingLink = () => {
  const roomId = crypto.randomBytes(8).toString('hex');
  return `https://meet.jit.si/cuet-bookworld-${roomId}`;
};

// POST /api/renewals — Request renewal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { borrowId, preferredDate, preferredTime, notes } = req.body;

    const borrow = await BorrowRecord.findById(borrowId);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    if (borrow.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your borrow record' });
    }

    // Check for existing pending/approved renewal
    const existing = await RenewalRequest.findOne({ borrowId, status: { $in: ['pending', 'approved'] } });
    if (existing) return res.status(400).json({ message: 'A renewal request is already pending or scheduled' });

    const renewal = await RenewalRequest.create({
      userId: req.user._id,
      borrowId,
      year: req.user.year,
      preferredDate,
      preferredTime,
      notes,
    });

    res.status(201).json({ message: 'Renewal request submitted! You will be notified when approved.', renewal });
  } catch (error) {
    res.status(500).json({ message: 'Error creating renewal request', error: error.message });
  }
});

// GET /api/renewals — List renewals (librarian/admin)
router.get('/', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const renewals = await RenewalRequest.find()
      .populate('userId', 'name email studentId department year')
      .populate({
        path: 'borrowId',
        populate: { path: 'bookId', select: 'title authors coverImage' },
      })
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(renewals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching renewals', error: error.message });
  }
});

// GET /api/renewals/my — My renewals (student)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const renewals = await RenewalRequest.find({ userId: req.user._id })
      .populate({
        path: 'borrowId',
        populate: { path: 'bookId', select: 'title authors coverImage' },
      })
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(renewals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching renewals', error: error.message });
  }
});

// PUT /api/renewals/:id/approve — Approve with auto-generated meeting link
router.put('/:id/approve', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const { scheduledDate, scheduledTime } = req.body;
    const renewal = await RenewalRequest.findById(req.params.id)
      .populate({
        path: 'borrowId',
        populate: { path: 'bookId', select: 'title' },
      });
    if (!renewal) return res.status(404).json({ message: 'Renewal not found' });
    if (renewal.status !== 'pending') {
      return res.status(400).json({ message: 'This renewal is not in pending status' });
    }

    // Auto-generate a unique Jitsi Meet link
    const meetingLink = generateMeetingLink();

    renewal.status = 'approved';
    renewal.meetingLink = meetingLink;
    renewal.approvedBy = req.user._id;
    renewal.scheduledDate = scheduledDate || renewal.preferredDate;
    renewal.scheduledTime = scheduledTime || renewal.preferredTime;
    await renewal.save();

    const bookTitle = renewal.borrowId?.bookId?.title || 'your book';
    const meetDate = new Date(renewal.scheduledDate).toLocaleDateString();
    const meetTime = renewal.scheduledTime;

    // Notify student
    await Notification.create({
      userId: renewal.userId,
      message: `📹 Your renewal for "${bookTitle}" has been approved! A video consultation is scheduled for ${meetDate} at ${meetTime}. Click the meeting link in your Renew page to join.`,
      type: 'success',
      link: '/renew?tab=status',
    });

    res.json({ message: 'Renewal approved with meeting link', renewal, meetingLink });
  } catch (error) {
    res.status(500).json({ message: 'Error approving renewal', error: error.message });
  }
});

// PUT /api/renewals/:id/complete — Mark consultation as done & extend due date
router.put('/:id/complete', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const renewal = await RenewalRequest.findById(req.params.id);
    if (!renewal) return res.status(404).json({ message: 'Renewal not found' });
    if (renewal.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved renewals can be completed' });
    }

    renewal.status = 'completed';
    renewal.completedAt = new Date();
    await renewal.save();

    // Extend the borrow due date by 30 days
    const borrow = await BorrowRecord.findById(renewal.borrowId).populate('bookId', 'title');
    if (borrow) {
      const newDue = new Date(borrow.dueDate);
      newDue.setDate(newDue.getDate() + 30);
      borrow.dueDate = newDue;
      borrow.renewalDate = new Date();
      borrow.fine = 0;
      borrow.status = 'active';
      await borrow.save();
    }

    await Notification.create({
      userId: renewal.userId,
      message: `✅ Your renewal for "${borrow?.bookId?.title}" is complete! Your new due date is ${borrow?.dueDate?.toLocaleDateString()}.`,
      type: 'success',
      link: '/renew?tab=status',
    });

    res.json({ message: 'Renewal completed, due date extended', renewal });
  } catch (error) {
    res.status(500).json({ message: 'Error completing renewal', error: error.message });
  }
});

// PUT /api/renewals/:id/reject — Reject renewal
router.put('/:id/reject', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const { reason } = req.body;
    const renewal = await RenewalRequest.findById(req.params.id)
      .populate({
        path: 'borrowId',
        populate: { path: 'bookId', select: 'title' },
      });
    if (!renewal) return res.status(404).json({ message: 'Renewal not found' });

    renewal.status = 'rejected';
    await renewal.save();

    const bookTitle = renewal.borrowId?.bookId?.title || 'your book';

    await Notification.create({
      userId: renewal.userId,
      message: `❌ Your renewal request for "${bookTitle}" has been rejected.${reason ? ' Reason: ' + reason : ''}`,
      type: 'error',
      link: '/renew?tab=status',
    });

    res.json({ message: 'Renewal rejected', renewal });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting renewal', error: error.message });
  }
});

module.exports = router;
