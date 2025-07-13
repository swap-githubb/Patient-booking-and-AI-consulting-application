import React, { useState, useRef } from 'react';
import { Card, CardContent, Button, Box, CircularProgress, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { keyframes } from '@emotion/react';
import api from '../../utils/api';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AudioRecorder = ({ onUploadSuccess }) => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (e) => e.data.size > 0 && audioChunksRef.current.push(e.data);
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        uploadAudio(audioBlob);
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setRecording(true);
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required. Please allow access and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    setProcessing(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    
    try {
      const response = await api.post('/conversation/conversation_turn', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      onUploadSuccess(response.data);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome to Your AI Consultation
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This is Dr. Steve, your AI assistant. Please tell me your name, age, and a description of your problem to begin.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color={recording ? 'error' : 'primary'}
              onClick={recording ? stopRecording : startRecording}
              disabled={processing}
              startIcon={recording ? <StopIcon /> : <MicIcon />}
              sx={{
                minWidth: '200px',
                py: 1.5,
                animation: recording ? `${pulseAnimation} 1.5s infinite` : 'none',
              }}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {processing && <CircularProgress size={24} />}
          </Box>
        </CardContent>
    </Card>
  );
};

export default AudioRecorder;