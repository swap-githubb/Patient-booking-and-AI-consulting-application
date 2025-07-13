const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { transcribeAudio } = require('../services/transcription');
const {
  generateSOAPNote,
  generateDifferentialDiagnosis,
  generateDoctorResponse
} = require('../services/nlpProcessing');

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

router.post('/conversation_turn', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ detail: 'No file uploaded' });
  
  try {
    const patientTranscript = await transcribeAudio(req.file.path);
    const fullConversation = `${req.body.conversation || ''}\nPatient: ${patientTranscript}`;
    const doctorResponse = await generateDoctorResponse(fullConversation);
    fs.unlinkSync(req.file.path);
    res.json({ transcript: patientTranscript, doctor_response: doctorResponse });
  } catch (err) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ detail: `Processing failed: ${err.message}` });
  }
});

router.post('/finalize_conversation', async (req, res) => {
  try {
    const [soapNote, differential] = await Promise.all([
      generateSOAPNote(req.body.conversation),
      generateDifferentialDiagnosis(req.body.conversation)
    ]);
    res.json({ soap_note: soapNote, differential_diagnosis: differential });
  } catch (err) {
    res.status(500).json({ detail: `Finalization failed: ${err.message}` });
  }
});

module.exports = router;