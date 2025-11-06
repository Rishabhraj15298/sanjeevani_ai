// src/services/gemini.js
const { GoogleGenAI } = require('@google/genai');

/**
 * Wrapper for Gemini using @google/genai and the GoogleGenAI client.
 * Expects process.env.GEMINI_API_KEY to be set.
 *
 * The SDK returns a response object; we use .text or .output[0].content[0].text depending on SDK shape.
 * This function returns parsed JSON (or uses rules fallback).
 */

async function generateWithGeminiRaw(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  const ai = new GoogleGenAI({ apiKey });

  // According to the snippet user provided:
  // const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: "..." });
  // response.text
  const resp = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt
  });

  // The SDK sometimes provides `.text` or `.output[0].content[0].text` depending on version.
  if (resp?.text) return resp.text;
  // try nested shape
  if (resp?.output && resp.output[0] && resp.output[0].content && resp.output[0].content[0]) {
    return resp.output[0].content[0].text || JSON.stringify(resp);
  }
  return JSON.stringify(resp);
}

// rules fallback (guarantee)
function rulesFallback(readings) {
  if (!readings?.length) {
    return {
      summary: 'No readings available.',
      possible_conditions: [],
      suggested_medicines: [],
      lifestyle_tips: ['Record BP daily at same time']
    };
  }
  const avgSys = Math.round(readings.reduce((a, r) => a + r.systolic, 0) / readings.length);
  const avgDia = Math.round(readings.reduce((a, r) => a + r.diastolic, 0) / readings.length);
  const stage =
    avgSys >= 140 || avgDia >= 90
      ? 'Stage 2 Hypertension'
      : avgSys >= 130 || avgDia >= 80
      ? 'Stage 1 Hypertension'
      : 'Normal';
  const meds = stage.includes('Hypertension') ? ['Losartan 50mg', 'Amlodipine 5mg'] : [];
  const last = readings[readings.length - 1];
  return {
    summary: `Avg BP ${avgSys}/${avgDia}. Last reading ${last.systolic}/${last.diastolic}.`,
    possible_conditions: [stage],
    suggested_medicines: meds,
    lifestyle_tips: ['Reduce salt intake', '30-min brisk walk', 'Hydrate well']
  };
}

async function generateAIReportFromReadings({ readings, extraNotes }) {
  const recent = readings.slice(-7);
  const prompt = `You are a cautious medical assistant. Analyze these BP readings and produce STRICT JSON with keys: summary, possible_conditions (array), suggested_medicines (array), lifestyle_tips (array). Be concise and safe.\n\nReadings: ${JSON.stringify(
    recent
  )}\nNotes: ${extraNotes || ''}\nReturn ONLY JSON object.`;

  try {
    const raw = await generateWithGeminiRaw(prompt);
    // extract JSON object from raw text
    const match = String(raw).match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini did not return parseable JSON');
    const content = JSON.parse(match[0]);
    return { generatedBy: 'gemini', content, inputContext: { recentWindowDays: 7, extraNotes } };
  } catch (e) {
    // fallback to simple rule
    const fb = rulesFallback(recent);
    return { generatedBy: 'rules', content: fb, inputContext: { recentWindowDays: 7, extraNotes } };
  }
}

module.exports = { generateAIReportFromReadings };
