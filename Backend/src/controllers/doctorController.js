const AIReport = require('../models/AIReport');
const ApprovedReport = require('../models/ApprovedReport');
const { getIO } = require('../socket');

exports.listPendingReports = async (req, res, next) => {
  try {
    const { patientId } = req.query;
    const filter = { status: 'pending' };
    if (patientId) filter.patient = patientId;
    const reports = await AIReport.find(filter)
      .populate('patient', 'name email age gender')
      .sort({ createdAt: -1 });
    res.json({ reports });
  } catch (e) {
    next(e);
  }
};

exports.approveReport = async (req, res, next) => {
  try {
    const { id } = req.params; // AIReport id
    const { finalSummary, meds, doctorNotes } = req.body;
    const aiReport = await AIReport.findById(id);
    if (!aiReport) return res.status(404).json({ message: 'AI report not found' });

    aiReport.status = 'reviewed';
    await aiReport.save();

    const approved = await ApprovedReport.create({
      aiReport: aiReport._id,
      patient: aiReport.patient,
      doctor: req.user.id,
      finalSummary: finalSummary || aiReport.content.summary,
      meds: meds && meds.length ? meds : aiReport.content.suggested_medicines || [],
      doctorNotes
    });

    // Notify patient in realtime
    try {
      const io = getIO();
      io.to(`patient:${aiReport.patient.toString()}`).emit('report:approved', {
        approvedId: approved._id,
        patientId: aiReport.patient,
        finalSummary: approved.finalSummary,
        meds: approved.meds,
        doctorNotes: approved.doctorNotes,
        approvedAt: approved.approvedAt
      });
    } catch (_) {}

    res.json({ approved });
  } catch (e) {
    next(e);
  }
};

exports.rejectReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const aiReport = await AIReport.findById(id);
    if (!aiReport) return res.status(404).json({ message: 'AI report not found' });
    aiReport.status = 'rejected';
    await aiReport.save();
    res.json({ message: 'Report rejected', reason });
  } catch (e) {
    next(e);
  }
};
