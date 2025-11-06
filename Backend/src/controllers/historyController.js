// src/controllers/historyController.js
const ChatMessage = require('../models/ChatMessage');

/**
 * GET /api/patient/history/reports?limit=30&page=1
 * Returns ALL approved report messages across ALL conversations for the logged-in patient.
 */
exports.getApprovedReportsHistory = async (req, res, next) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit || '30', 10));
    const page  = Math.max(1, parseInt(req.query.page || '1', 10));
    const skip  = (page - 1) * limit;

    const filter = { patient: req.user.id, type: 'report' };
    const [items, total] = await Promise.all([
      ChatMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ChatMessage.countDocuments(filter)
    ]);

    res.json({
      page, limit, total,
      items
    });
  } catch (e) { next(e); }
};
