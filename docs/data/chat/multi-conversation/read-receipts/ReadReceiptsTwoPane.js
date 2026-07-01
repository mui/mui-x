'use client';
import * as React from 'react';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  ChatComposer,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatConversation,
  ChatConversationHeader,
  ChatConversationList,
  ChatConversationSubtitle,
  ChatConversationTitle,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatLayout, ChatProvider } from '@mui/x-chat/headless';

import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docs/data/chat/material/examples/shared/demoData';

// The conversation that ships unread in the shared demo data.
const UNREAD_CONVERSATION_ID = inboxConversations.find(
  (conversation) => conversation.readState === 'unread',
).id;

// The first fully-read conversation — opened on mount so the unread one keeps its
// badge until the reader visits it.
const READ_CONVERSATION_ID = inboxConversations.find(
  (conversation) => conversation.readState === 'read',
).id;

// Start with ~4 unread messages so the marker lands well above the bottom.
const SEEDED_UNREAD_COUNT = 4;

// The stock unread thread has only 3 messages — far too short to overflow a 500px
// list. Extend it locally to ~12 messages so the marker starts out of view and
// reaching the bottom requires a real scroll.
function buildUnreadThread() {
  const stock = inboxThreads[UNREAD_CONVERSATION_ID].map((message) => ({
    ...message,
  }));
  const author = stock[0].author;
  const filler = Array.from({ length: 9 }, (_, offset) => {
    const index = offset + 1;
    const role = index % 2 === 0 ? 'assistant' : 'user';
    return {
      id: `rr-extra-${index}`,
      conversationId: UNREAD_CONVERSATION_ID,
      role,
      status: 'sent',
      createdAt: `2026-03-15T10:${(12 + index).toString().padStart(2, '0')}:00.000Z`,
      author,
      parts: [
        {
          type: 'text',
          text:
            role === 'user'
              ? `Follow-up question ${index} about the composer slots.`
              : `Here is detail ${index} on wiring the composer and its slots.`,
        },
      ],
    };
  });

  return [...stock, ...filler];
}

function buildSeedConversations() {
  return inboxConversations.map((conversation) => {
    if (conversation.id === UNREAD_CONVERSATION_ID) {
      return {
        ...conversation,
        unreadCount: SEEDED_UNREAD_COUNT,
        readState: 'unread',
      };
    }
    return { ...conversation };
  });
}

function buildSeedThreads() {
  return Object.fromEntries(
    Object.entries(inboxThreads).map(([id, messages]) => [
      id,
      id === UNREAD_CONVERSATION_ID
        ? buildUnreadThread()
        : messages.map((message) => ({ ...message })),
    ]),
  );
}

const echoAdapter = createEchoAdapter({
  respond: (text) => `Received: "${text}".`,
});

// `markRead` is optional on the adapter contract — extend the echo adapter with an
// async no-op so the demo can show the full scroll-to-bottom mark-read round trip.
const adapter = {
  ...echoAdapter,
  async markRead() {
    // In a real app this would notify the backend.
  },
};

export default function ReadReceiptsTwoPane() {
  // Open a fully-read conversation first so the unread one keeps its badge until
  // visited, and so the long unread thread opens scrolled away from the bottom.
  const [activeConversationId, setActiveConversationId] =
    React.useState(READ_CONVERSATION_ID);
  const [conversations, setConversations] = React.useState(buildSeedConversations);
  const [threads, setThreads] = React.useState(buildSeedThreads);

  const messages = threads[activeConversationId] ?? [];

  const handleReachBottom = React.useCallback(() => {
    const conversationId = activeConversationId;
    const active = conversations.find(
      (conversation) => conversation.id === conversationId,
    );
    // Guard re-fires: only mark read while the conversation is still unread.
    if (!active || active.readState !== 'unread') {
      return;
    }
    adapter.markRead({ conversationId });
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, readState: 'read', unreadCount: 0 }
          : conversation,
      ),
    );
  }, [activeConversationId, conversations]);

  const handleReset = React.useCallback(() => {
    setConversations(buildSeedConversations());
    setThreads(buildSeedThreads());
    setActiveConversationId(READ_CONVERSATION_ID);
  }, []);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button size="small" variant="outlined" onClick={handleReset}>
          Reset demo
        </Button>
      </Box>
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
        }}
        onConversationsChange={setConversations}
      >
        <Box sx={{ height: 500, overflow: 'hidden' }}>
          <ChatLayout
            style={{ height: '100%' }}
            slotProps={{
              conversationsPane: {
                style: { width: '280px', flex: '0 0 280px' },
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
              <ChatMessageList
                features={{ unreadMarker: true }}
                onReachBottom={handleReachBottom}
              />
              <ChatComposer>
                <ChatComposerTextArea
                  aria-label="Message"
                  placeholder="Type a message..."
                />
                <ChatComposerToolbar>
                  <ChatComposerSendButton>
                    <SendIcon />
                  </ChatComposerSendButton>
                </ChatComposerToolbar>
              </ChatComposer>
            </ChatConversation>
          </ChatLayout>
        </Box>
      </ChatProvider>
    </div>
  );
}
