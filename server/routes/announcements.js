const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/announcements — Get active announcements (public)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const query = all === 'true' ? {} : { active: true };
    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
});

// POST /api/announcements — Create announcement (admin)
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ message: 'Announcement created', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
});

// PUT /api/announcements/:id — Update announcement (admin)
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement updated', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
});

// DELETE /api/announcements/:id — Delete announcement (admin)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
});

module.exports = router;
