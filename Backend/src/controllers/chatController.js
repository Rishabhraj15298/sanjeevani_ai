// src/controllers/chatController.js
const ChatMessage = require('../models/ChatMessage');

// GET /api/patient/chat
exports.getChat = async (req, res, next) => {
  try {
    const { conversationId } = req.query;
    const filter = { patient: req.user.id };
    if (conversationId) filter.conversationId = conversationId;
    // default: if no conversationId provided, return nothing (safer)
    else return res.json({ messages: [] });

    const msgs = await ChatMessage.find(filter).sort({ createdAt: 1 }).lean();
    res.json({ messages: msgs });
  } catch (e) { next(e); }
};

// POST /api/patient/chat  -> save a user/system message
exports.postChat = async (req, res, next) => {
  try {
    const { sender='user', type='text', content = {}, conversationId = null } = req.body;
    const msg = await ChatMessage.create({
      patient: req.user.id,
      sender, type, content,
      conversationId
    });
    res.status(201).json({ message: msg });
  } catch (e) { next(e); }
};