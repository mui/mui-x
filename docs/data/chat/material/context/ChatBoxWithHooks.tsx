'use client';
import * as React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { ChatBox } from '@mui/x-chat';
import { useChatStatus } from '@mui/x-chat/headless';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

function StreamingBadge() {
  const { isStreaming } = useChatStatus();
  return isStreaming ? (
    <Chip label="Responding..." color="info" size="small" />
  ) : null;
}

export default function ChatBoxWithHooks() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <StreamingBadge />
      </Box>
    </ChatBox>
  );
}
