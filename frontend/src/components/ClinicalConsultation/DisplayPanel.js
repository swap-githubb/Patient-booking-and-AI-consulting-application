import React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ArticleIcon from '@mui/icons-material/Article';

const MarkdownComponent = ({ children }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }) {
        return (
          <SyntaxHighlighter style={atomDark} language="javascript" PreTag="div" {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }
    }}
  >
    {children}
  </ReactMarkdown>
);

const DisplayPanel = ({ soapNote, differentialDiagnosis }) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const hasContent = soapNote || differentialDiagnosis;

  if (!hasContent) {
    return (
        <Box sx={{ textAlign: 'center', color: 'text.secondary', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <ArticleIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" gutterBottom>Clinical Documentation</Typography>
            <Typography>The generated SOAP note and differential diagnosis will appear here after you finish the conversation and click "Analyze".</Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">Generated Report</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="SOAP Note" />
          <Tab label="Differential Diagnosis" />
        </Tabs>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {tabIndex === 0 && <MarkdownComponent>{soapNote}</MarkdownComponent>}
        {tabIndex === 1 && <MarkdownComponent>{differentialDiagnosis}</MarkdownComponent>}
      </Box>
    </Box>
  );
};

export default DisplayPanel;