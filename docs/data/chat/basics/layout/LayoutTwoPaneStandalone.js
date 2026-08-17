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
  ChatConversationList,
  ChatConversationSubtitle,
  ChatConversationTitle,
  ChatMessageGroup,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatLayout, ChatProvider } from '@mui/x-chat/headless';

import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". This demo renders ChatLayout with an explicit conversation pane and thread pane.`,
});

export default function LayoutTwoPaneStandalone() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState(() =>
    inboxConversations.map((conversation) => ({ ...conversation })),
  );
  const [threads, setThreads] = React.useState(() =>
    Object.fromEntries(
      Object.entries(inboxThreads).map(([id, messages]) => [
        id,
        messages.map((message) => ({ ...message })),
      ]),
    ),
  );

  const messages = threads[activeConversationId] ?? [];

  const renderItem = React.useCallback(
    (params) => <ChatMessageGroup key={params.id} messageId={params.id} />,
    [],
  );

  return (
    <ChatProvider
      adapter={adapter}
      activeConversationId={activeConversationId}
      conversations={conversations}
      messages={messages}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveConversationId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({
          ...prev,
          [activeConversationId]: nextMessages,
        }));
        setConversations((prev) =>
          syncConversationPreview(prev, activeConversationId, nextMessages),
        );
      }}
      onConversationsChange={setConversations}
    >
      <Box
        sx={{
          height: 500,
          overflow: 'hidden',
        }}
      >
        <ChatLayout
          style={{ height: '100%' }}
          slotProps={{
            conversationsPane: {
              style: {
                width: '280px',
                flex: '0 0 280px',
              },
            },
          }}
        >
          <ChatConversationList
            slotProps={{ root: { 'aria-label': 'Conversations' } }}
          />
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
