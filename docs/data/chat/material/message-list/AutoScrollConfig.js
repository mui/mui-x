'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

export default function AutoScrollConfig() {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="subtitle2" gutterBottom>
          Custom buffer (300 px)
        </Typography>
        <ChatBox
          adapter={adapter}
          initialActiveConversationId={minimalConversation.id}
          initialConversations={[minimalConversation]}
          initialMessages={minimalMessages}
          features={{ autoScroll: { buffer: 300 } }}
          sx={{
            height: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </div>
      <div>
        <Typography variant="subtitle2" gutterBottom>
          Auto-scroll disabled
        </Typography>
        <ChatBox
          adapter={adapter}
          initialActiveConversationId={minimalConversation.id}
          initialConversations={[minimalConversation]}
          initialMessages={minimalMessages}
          features={{ autoScroll: false }}
          sx={{
            height: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </div>
    </Stack>
  );
}
