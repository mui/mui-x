'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatComposerSendButton,
} from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ThreadRecomposition() {
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
          <ChatConversationHeader>
            <ChatConversationTitle />
            <ChatConversationSubtitle />
            <Box sx={{ flex: 1 }} />
            <ChatConversationHeaderActions />
          </ChatConversationHeader>

          {/* Custom pinned notice between header and messages */}
          <Box
            sx={{
              px: 2,
              py: 0.75,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              fontSize: 'caption.fontSize',
            }}
          >
            Responses are AI-generated. Verify before acting.
          </Box>

          <ChatMessageList
            renderItem={({ id, index }) => (
              <ChatMessageGroup index={index} messageId={id} />
            )}
          />

          <ChatComposer>
            <ChatComposerTextArea placeholder="Type a message…" />
            <ChatComposerToolbar>
              <ChatComposerSendButton />
            </ChatComposerToolbar>
          </ChatComposer>
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
