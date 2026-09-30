'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatComposer,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderActions,
  ChatConversationSubtitle,
  ChatConversationTitle,
  ChatMessageGroup,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatLayout, ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". This thread is recomposed from individual components, with a pinned notice between the header and the messages.`,
});

export default function LayoutRecomposedStandalone() {
  const renderItem = React.useCallback(
    (params: { id: string; index: number }) => (
      <ChatMessageGroup key={params.id} index={params.index} messageId={params.id} />
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
          height: 420,
          overflow: 'hidden',
        }}
      >
        <ChatLayout style={{ height: '100%' }}>
          <ChatConversation sx={{ height: '100%' }}>
            <ChatConversationHeader>
              <Box sx={{ minWidth: 0 }}>
                <ChatConversationTitle />
                <ChatConversationSubtitle />
              </Box>
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

            <ChatMessageList renderItem={renderItem} />

            <ChatComposer>
              <ChatComposerTextArea
                aria-label="Message"
                placeholder="Type a message…"
              />
              <ChatComposerToolbar>
                <ChatComposerSendButton />
              </ChatComposerToolbar>
            </ChatComposer>
          </ChatConversation>
        </ChatLayout>
      </Box>
    </ChatProvider>
  );
}
