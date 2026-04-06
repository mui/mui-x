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
  ChatMessageInlineMeta,
  ChatConversation,
} from '@mui/x-chat';
import { ChatProvider, useMessageIds } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

function CustomLayout() {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    (params: { id: string }) => (
      <ChatMessageGroup key={params.id} messageId={params.id}>
        <ChatMessage messageId={params.id}>
          <ChatMessageAvatar />
          <ChatMessageContent afterContent={<ChatMessageInlineMeta />} />
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
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
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
