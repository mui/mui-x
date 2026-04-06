'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
} from '@mui/x-chat';
import { ChatProvider, useChat } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { minimalConversation } from 'docsx/data/chat/material/examples/shared/demoData';

function EmptyStateContent() {
  const { messages, sendMessage } = useChat();

  if (messages.length > 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2,
        py: 4,
        pointerEvents: 'auto',
      }}
    >
      <Typography variant="h6">How can I help you today?</Typography>
      <Box
        sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            sendMessage({
              parts: [{ type: 'text', text: 'Explain quantum computing' }],
            })
          }
        >
          Explain quantum computing
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            sendMessage({
              parts: [{ type: 'text', text: 'Write a haiku about React' }],
            })
          }
        >
          Write a haiku about React
        </Button>
      </Box>
    </Box>
  );
}

const adapter = createEchoAdapter();

export default function CustomEmptyState() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
    >
      <Box
        sx={{
          height: 500,
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatConversation sx={{ height: '100%' }}>
          <ChatConversationHeader />
          <ChatMessageList
            overlay={<EmptyStateContent />}
            renderItem={({ id, index }) => (
              <ChatMessageGroup index={index} messageId={id} />
            )}
          />
          <ChatComposer />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
