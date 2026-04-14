const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  renewalDate: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'active', 'returned', 'overdue', 'rejected'], default: 'pending' },
  fine: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
