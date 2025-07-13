const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function transcribeAudio(filePath) {
  const audioData = fs.readFileSync(filePath);
  const response = await axios.post('https://api.deepgram.com/v1/listen', audioData, {
    headers: {
      'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
      'Content-Type': 'audio/webm'
    }
  });
  return response.data.results.channels[0].alternatives[0].transcript;
} 

module.exports = {
  transcribeAudio
};