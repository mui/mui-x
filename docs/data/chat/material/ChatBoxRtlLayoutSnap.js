import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import { basicAdapter, demoConversations, demoMessages } from './shared';

const theme = createTheme({
  direction: 'rtl',
});

// This demo is used in visual regression tests to spot regressions in the RTL ChatBox layout.
export default function ChatBoxRtlLayoutSnap() {
  return (
    <ThemeProvider theme={theme}>
      <div dir="rtl">
        <Paper
          elevation={0}
          sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
        >
          <Box sx={{ height: 560, width: 960 }}>
            <ChatBox
              adapter={basicAdapter}
              defaultActiveConversationId="c1"
              defaultConversations={demoConversations}
              defaultMessages={demoMessages}
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
}
