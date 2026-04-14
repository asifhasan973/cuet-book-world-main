const express = require('express');
const router = express.Router();
const VideoSession = require('../models/VideoSession');
const Notification = require('../models/Notification');
const { authMiddleware, requireRole } = require('../middleware/auth');

// POST /api/videos — Request a video session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const session = await VideoSession.create({
      userId: req.user._id,
      ...req.body,
    });
    res.status(201).json({ message: 'Session requested', session });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
});

// GET /api/videos/my — My sessions
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const sessions = await VideoSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

// GET /api/videos — All sessions (librarian/admin)
router.get('/', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const sessions = await VideoSession.find()
      .populate('userId', 'name email studentId department')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

// PUT /api/videos/:id/approve — Approve session
router.put('/:id/approve', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const { meetingLink } = req.body;
    const session = await VideoSession.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', meetingLink, hostName: req.user.name },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });

    await Notification.create({
      userId: session.userId,
      message: `Your video consultation "${session.topic}" has been approved! Join link: ${meetingLink}`,
      type: 'success',
    });

    res.json({ message: 'Session approved', session });
  } catch (error) {
    res.status(500).json({ message: 'Error approving session', error: error.message });
  }
});

// PUT /api/videos/:id/reject — Reject session
router.put('/:id/reject', authMiddleware, requireRole('librarian', 'admin'), async (req, res) => {
  try {
    const session = await VideoSession.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });

    await Notification.create({
      userId: session.userId,
      message: `Your video consultation request "${session.topic}" has been rejected.`,
      type: 'error',
    });

    res.json({ message: 'Session rejected', session });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting session', error: error.message });
  }
});

module.exports = router;
