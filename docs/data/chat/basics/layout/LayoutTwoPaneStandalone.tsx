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
import type {
  ChatConversation as ChatConversationModel,
  ChatMessage,
} from '@mui/x-chat/headless';
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

export default function LayoutTwoPaneStandalone() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversationModel[]>(
    () => inboxConversations.map((conversation) => ({ ...conversation })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(inboxThreads).map(([id, messages]) => [
        id,
        messages.map((message) => ({ ...message })),
      ]),
    ),
  );

  const messages = threads[activeConversationId] ?? [];

  const renderItem = React.useCallback(
    (params: { id: string }) => (
      <ChatMessageGroup key={params.id} messageId={params.id} />
    ),
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
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
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
                minWidth: 0,
                overflow: 'hidden',
              },
            },
            threadPane: {
              style: {
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
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
                placeholder="Type a message..."
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
