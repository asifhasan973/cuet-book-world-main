require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS — allow localhost in dev, Vercel URLs in production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://client-asifhasan973s-projects.vercel.app',
  'https://client-mu-five-98.vercel.app',
  /\.vercel\.app$/,   // any *.vercel.app subdomain
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server / curl
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
  },
  credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ Error connecting to MongoDB:', err));
} else {
  console.warn('⚠️ MONGODB_URI is not set. Running without database connection.');
}

// Basic API routes
app.get('/', (req, res) => {
  res.json({ message: 'CUET Bookworld API is running...', status: 'ok' });
});

// Route registrations
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/borrows', require('./routes/borrows'));
app.use('/api/renewals', require('./routes/renewals'));
app.use('/api/users', require('./routes/users'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/stats', require('./routes/stats'));

// Start server only in non-serverless environments
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
