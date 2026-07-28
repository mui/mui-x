'use client';
import * as React from 'react';
import AttachIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
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
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

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
                placeholder="Type a message…"
              />
              <ChatComposerToolbar>
                <ChatComposerAttachButton>
                  <AttachIcon />
                </ChatComposerAttachButton>
                <ChatComposerSendButton>
                  <SendIcon />
                </ChatComposerSendButton>
              </ChatComposerToolbar>
            </ChatComposer>
          </ChatConversation>
        </ChatLayout>
      </Box>
    </ChatProvider>
  );
}
