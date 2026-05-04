'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatConversation,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageInlineMeta,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function StandaloneMessages() {
  const renderItem = React.useCallback(
    (params) => (
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
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <ChatConversation>
          <ChatMessageList renderItem={renderItem} />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
