const { validationResult } = require('express-validator');
const BPReading = require('../models/BPReading');
const AIReport = require('../models/AIReport');
const ApprovedReport = require('../models/ApprovedReport');
const { getIO } = require('../socket');
const { generateAIReportFromReadings } = require('../services/gemini');

exports.addReading = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { systolic, diastolic, pulse, symptoms, measuredAt, notes } = req.body;
    const reading = await BPReading.create({
      patient: req.user.id,
      systolic,
      diastolic,
      pulse,
      symptoms,
      measuredAt: measuredAt ? new Date(measuredAt) : Date.now()
    });

    // Emit to doctors immediately
    try {
      const io = getIO();
      io.to('doctors').emit('reading:created', {
        readingId: reading._id,
        patientId: req.user.id,
        systolic: reading.systolic,
        diastolic: reading.diastolic,
        pulse: reading.pulse,
        symptoms: reading.symptoms,
        measuredAt: reading.measuredAt
      });
    } catch (_) {}

    // Kick off async AI report generation (no blocking)
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const recent = await BPReading.find({ patient: req.user.id, measuredAt: { $gte: since } }).sort({ measuredAt: 1 });
      const aiRes = await generateAIReportFromReadings({ readings: recent, extraNotes: notes });

      const aiReport = await AIReport.create({
        patient: req.user.id,
        generatedBy: aiRes.generatedBy,
        inputContext: aiRes.inputContext,
        content: aiRes.content,
        status: 'pending'
      });

      try {
        const io = getIO();
        io.to('doctors').emit('ai_report:generated', {
          aiReportId: aiReport._id,
          patientId: req.user.id,
          content: aiReport.content,
          generatedBy: aiReport.generatedBy,
          createdAt: aiReport.createdAt
        });
      } catch (_) {}
    })();

    // Return quickly
    res.status(201).json({ reading, aiStatus: 'processing' });
  } catch (e) {
    next(e);
  }
};

exports.getReadings = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = { patient: req.user.id };
    if (from || to) {
      filter.measuredAt = {};
      if (from) filter.measuredAt.$gte = new Date(from);
      if (to) filter.measuredAt.$lte = new Date(to);
    }
    const readings = await BPReading.find(filter).sort({ measuredAt: -1 });
    res.json({ readings });
  } catch (e) {
    next(e);
  }
};

exports.getAIReports = async (req, res, next) => {
  try {
    const reports = await AIReport.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (e) {
    next(e);
  }
};

exports.getApprovedReports = async (req, res, next) => {
  try {
    const approved = await ApprovedReport.find({ patient: req.user.id })
      .populate('doctor', 'name email')
      .sort({ approvedAt: -1 });
    res.json({ approved });
  } catch (e) {
    next(e);
  }
};
