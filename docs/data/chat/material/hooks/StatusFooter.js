'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
} from '@mui/x-chat';
import { ChatProvider, useChatStatus } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

function StatusFooterContent() {
  const { isStreaming, typingUserIds } = useChatStatus();

  if (isStreaming) {
    return <LinearProgress />;
  }
  if (typingUserIds.length > 0) {
    return <Typography variant="caption">Someone is typing...</Typography>;
  }
  return null;
}

const adapter = createEchoAdapter();

export default function StatusFooter() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          height: 500,
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
            renderItem={({ id, index }) => (
              <ChatMessageGroup index={index} messageId={id} />
            )}
          />
          <Box sx={{ px: 2, py: 0.5 }}>
            <StatusFooterContent />
          </Box>
          <ChatComposer />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
