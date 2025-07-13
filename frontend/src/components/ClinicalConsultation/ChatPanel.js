import React, { useEffect, useRef } from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const ChatPanel = ({ conversation }) => {
  const scrollRef = useRef(null);

  // This effect will now just manage scrolling within the overall page flow.
  useEffect(() => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
  }, [conversation]);

  if (conversation.length === 0) {
    return null; // Don't render the panel if there's no conversation yet.
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Consultation Transcript</Typography>
        <Box ref={scrollRef} sx={{ mt: 2 }}>
            {conversation.map((turn, index) => (
            <Box
                key={index}
                sx={{
                display: 'flex',
                justifyContent: turn.role === 'doctor' ? 'flex-start' : 'flex-end',
                mb: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexDirection: turn.role === 'doctor' ? 'row' : 'row-reverse', maxWidth: '85%' }}>
                <Avatar sx={{ bgcolor: turn.role === 'doctor' ? 'primary.main' : 'secondary.main', width: 32, height: 32, mt: 0.5, flexShrink: 0 }}>
                    {turn.role === 'doctor' ? <MedicalServicesIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                </Avatar>
                <Paper
                    elevation={1}
                    sx={{
                    p: 1.5,
                    bgcolor: turn.role === 'doctor' ? 'primary.light' : '#e0e0e0',
                    color: turn.role === 'doctor' ? 'primary.contrastText' : 'text.primary',
                    borderRadius: turn.role === 'doctor' ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                    }}
                >
                    <Typography variant="body2" component="div">
                    <ReactMarkdown>{turn.message}</ReactMarkdown>
                    </Typography>
                </Paper>
                </Box>
            </Box>
            ))}
        </Box>
    </Paper>
  );
};

export default ChatPanel;