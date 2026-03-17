import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { markdownMessages } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function MarkdownMessages() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560 }}>
        <ChatBox adapter={adapter} defaultMessages={markdownMessages} />
      </Box>
    </Paper>
  );
}
