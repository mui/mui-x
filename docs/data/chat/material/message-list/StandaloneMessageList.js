'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  ChatMessageList,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageMeta,
  ChatConversation,
} from '@mui/x-chat';
import { ChatProvider, useMessageIds } from '@mui/x-chat/headless';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

function CustomLayout() {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    ({ id }) => (
      <ChatMessageGroup key={id} messageId={id}>
        <ChatMessage messageId={id}>
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
        </ChatMessage>
      </ChatMessageGroup>
    ),
    [],
  );

  return (
    <ChatConversation>
      <ChatMessageList renderItem={renderItem} items={messageIds} />
      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant="outlined" size="small" disabled>
          Custom composer placeholder
        </Button>
      </Box>
    </ChatConversation>
  );
}

export default function StandaloneMessageList() {
  return (
    <ChatProvider
      adapter={adapter}
      defaultActiveConversationId={minimalConversation.id}
      defaultConversations={[minimalConversation]}
      defaultMessages={minimalMessages}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <CustomLayout />
      </Box>
    </ChatProvider>
  );
}
