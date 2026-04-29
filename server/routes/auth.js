const express = require('express');
const router = express.Router();
const User = require('../models/User');

const ALLOWED_EMAIL_DOMAINS = new Set(['cuet.ac.bd', 'student.cuet.ac.bd']);

const isAllowedCuetEmail = (email = '') => {
  const normalized = String(email).trim().toLowerCase();
  const atIndex = normalized.lastIndexOf('@');

  if (atIndex <= 0 || atIndex === normalized.length - 1) {
    return false;
  }

  return ALLOWED_EMAIL_DOMAINS.has(normalized.slice(atIndex + 1));
};

// POST /api/auth/sync — Sync Firebase user to MongoDB
router.post('/sync', async (req, res) => {
  try {
    const { firebaseUid, name, email, studentId, department, year, avatar, requestedRole } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ message: 'firebaseUid and email are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!isAllowedCuetEmail(normalizedEmail)) {
      return res.status(403).json({
        message: 'Use a CUET email ending in @cuet.ac.bd or @student.cuet.ac.bd.',
      });
    }

    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update existing user
      if (name) user.name = name;
      if (avatar) user.avatar = avatar;
      await user.save();
    } else {
      // Check if a user with this email already exists (e.g. seeded with a placeholder UID)
      // If so, update that record's firebaseUid so the role/data is preserved
      let existingByEmail = await User.findOne({ email: normalizedEmail });
      if (existingByEmail) {
        existingByEmail.firebaseUid = firebaseUid;
        if (name) existingByEmail.name = name;
        if (avatar) existingByEmail.avatar = avatar;
        await existingByEmail.save();
        user = existingByEmail;
      } else {
        // Brand new user — determine role based on email pattern
        let role = ['student', 'librarian'].includes(requestedRole) ? requestedRole : 'student';
        if (normalizedEmail === 'librarian@cuet.ac.bd') role = 'librarian';
        if (normalizedEmail === 'admin@cuet.ac.bd') role = 'admin';

        // Determine borrow limit — all students get 3, staff get 6
        let borrowLimit = 3;
        if (role === 'librarian' || role === 'admin') borrowLimit = 6;

        user = await User.create({
          firebaseUid,
          name: name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          studentId: studentId || '',
          department: department || 'CSE',
          year: (role !== 'student') ? 'Faculty' : (year || '1st'),
          role,
          status: 'active',
          avatar: avatar || '',
          borrowLimit,
        });
      }
    }

    res.json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error('Auth sync error:', error);
    res.status(500).json({ message: 'Error syncing user', error: error.message });
  }
});

// GET /api/auth/me — Get current user profile
router.get('/me', async (req, res) => {
  try {
    const firebaseUid = req.headers['x-firebase-uid'];
    if (!firebaseUid) {
      return res.status(401).json({ message: 'No firebase UID provided' });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// PUT /api/auth/profile — Update user profile
router.put('/profile', async (req, res) => {
  try {
    const firebaseUid = req.headers['x-firebase-uid'];
    if (!firebaseUid) {
      return res.status(401).json({ message: 'No firebase UID provided' });
    }

    const updates = req.body;
    // Don't allow role or status changes through this endpoint
    delete updates.role;
    delete updates.status;
    delete updates.firebaseUid;

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;
