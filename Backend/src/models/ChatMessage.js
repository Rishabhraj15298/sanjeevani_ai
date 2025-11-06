// src/models/ChatMessage.js
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: String, enum: ['user', 'doctor', 'system'], required: true },
  type: { type: String, enum: ['text', 'reading', 'report'], default: 'text' },
  content: { type: Object, default: {} }, // flexible (text:{text}, reading:{systolic,...}, report:{...})
   conversationId: { type: String, default: null }  
}, { timestamps: true });

ChatMessageSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
