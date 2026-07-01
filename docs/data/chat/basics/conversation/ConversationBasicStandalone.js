'use client';
import * as React from 'react';
import MoreIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {
  ChatComposer,
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderActions,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
  ChatMessageGroup,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". This thread is rendered by a single ChatConversation.`,
});

export default function ConversationBasicStandalone() {
  const renderItem = React.useCallback(
    (params) => <ChatMessageGroup key={params.id} messageId={params.id} />,
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
          height: 460,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <ChatConversation>
          <ChatConversationHeader>
            <ChatConversationHeaderInfo>
              <ChatConversationTitle />
              <ChatConversationSubtitle />
            </ChatConversationHeaderInfo>
            <ChatConversationHeaderActions>
              <IconButton size="small" aria-label="Conversation options">
                <MoreIcon />
              </IconButton>
            </ChatConversationHeaderActions>
          </ChatConversationHeader>
          <ChatMessageList renderItem={renderItem} />
          <ChatComposer />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
