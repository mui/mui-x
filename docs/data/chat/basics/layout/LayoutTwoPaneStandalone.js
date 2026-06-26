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
} from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". This demo renders ChatLayout with an explicit conversation pane and thread pane.`,
});

function AttachIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

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
