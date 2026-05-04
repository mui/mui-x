'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatConversation,
  ChatConversationHeader,
  ChatConversationSubtitle,
  ChatConversationTitle,
  ChatMessageGroup,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatLayout, ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". Only the thread pane is mounted in this ChatLayout example.`,
});

export default function LayoutThreadOnlyStandalone() {
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
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <ChatLayout style={{ height: '100%' }}>
          <ChatConversation>
            <ChatConversationHeader>
              <Box sx={{ minWidth: 0 }}>
                <ChatConversationTitle />
                <ChatConversationSubtitle />
              </Box>
            </ChatConversationHeader>
            <ChatMessageList renderItem={renderItem} />
            <ChatComposer>
              <ChatComposerTextArea
                aria-label="Message"
                placeholder="Ask the assistant a question..."
              />
              <ChatComposerToolbar>
                <ChatComposerAttachButton>Attach</ChatComposerAttachButton>
                <ChatComposerSendButton>Send</ChatComposerSendButton>
              </ChatComposerToolbar>
            </ChatComposer>
          </ChatConversation>
        </ChatLayout>
      </Box>
    </ChatProvider>
  );
}
