'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatConversation, ChatMessageList } from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function StandaloneMessages() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          height: 400,
          overflow: 'hidden',
        }}
      >
        <ChatConversation>
          <ChatMessageList />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
