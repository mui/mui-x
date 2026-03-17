import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { ChatBox } from '@mui/x-chat';
import { createClosedStream } from './shared';

const adapter = {
  async listConversations() {
    return new Promise(() => {});
  },
  async sendMessage() {
    return createClosedStream();
  },
};

// This demo is used in visual regression tests to spot regressions in loading and skeleton states.
export default function ChatBoxSkeletonSnap() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560, width: 960 }}>
        <ChatBox adapter={adapter} defaultConversations={[]} />
      </Box>
    </Paper>
  );
}
