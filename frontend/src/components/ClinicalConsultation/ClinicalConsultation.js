import React, { useState } from 'react';
import { Container, Button, Typography, ThemeProvider, Stack, Paper, Box, CircularProgress, AppBar, Toolbar } from '@mui/material';
import { theme } from './styles/globalStyles';
import AudioRecorder from './AudioRecorder';
import ChatPanel from './ChatPanel';
import DisplayPanel from './DisplayPanel';
import PsychologyIcon from '@mui/icons-material/Psychology';
import api from '../../utils/api';

export default function ConsultationApp() {
  const [conversation, setConversation] = useState([]);
  const [soapNote, setSoapNote] = useState('');
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);

  const cleanOutput = (text) => {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  };

  const handleTurnUploadSuccess = (data) => {
    setConversation((prev) => [
      ...prev,
      { role: 'patient', message: data.transcript },
      { role: 'doctor', message: cleanOutput(data.doctor_response) }
    ]);
  };

  const finalizeConversation = async () => {
    const conversationStr = conversation
      .map(turn => `${turn.role === 'doctor' ? 'Dr. Steve' : 'Patient'}: ${turn.message}`)
      .join('\n');
    
    setIsFinalizing(true);
    try {
      const response = await api.post('/conversation/finalize_conversation', {
        conversation: conversationStr
      });
      setSoapNote(cleanOutput(response.data.soap_note));
      setDifferentialDiagnosis(cleanOutput(response.data.differential_diagnosis));
    } catch (error) {
      console.error("Finalization error:", error);
    }
    setIsFinalizing(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: '#f4f6f8', minHeight: '100vh' }}>
        <AppBar position="sticky">
            <Toolbar>
                <PsychologyIcon sx={{ mr: 2, fontSize: '32px' }}/>
                <Typography variant="h6" sx={{fontWeight: 700}}>
                    AI-Powered Clinical Support System
                </Typography>
            </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Stack spacing={4}>
            {/* 1. The recorder is the first main interaction element. */}
            <AudioRecorder
              onUploadSuccess={handleTurnUploadSuccess}
              conversation={conversation}
            />

            {/* 2. The chat transcript appears below the recorder. */}
            <ChatPanel conversation={conversation} />

            {/* 3. The finish button is clearly placed after the conversation area. */}
            <Box sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={finalizeConversation}
                    disabled={conversation.length === 0 || isFinalizing}
                >
                    Finish Conversation & Generate Report
                </Button>
            </Box>

            {/* 4. The loading indicator and the final report appear at the bottom. */}
             {isFinalizing && (
                <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <CircularProgress size={24} />
                    <Typography>Generating clinical documentation, please wait...</Typography>
                </Paper>
              )}
            
            { (soapNote || differentialDiagnosis) &&
              <DisplayPanel
                soapNote={soapNote}
                differentialDiagnosis={differentialDiagnosis}
              />
            }
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}