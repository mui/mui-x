import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function LocaleTextDemo() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 400 }}>
        <ChatBox
          adapter={adapter}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'This demo uses custom locale text. The composer placeholder, send button label, and thread empty text are all customized.',
                },
              ],
            },
          ]}
          localeText={{
            composerInputPlaceholder: 'Ask me anything...',
            composerSendButtonLabel: 'Submit',
            composerAttachButtonLabel: 'Upload file',
            threadNoMessagesLabel: 'Start a conversation',
            scrollToBottomLabel: 'Jump to latest',
          }}
        />
      </Box>
    </Paper>
  );
}
