'use client';
import * as React from 'react';
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
import type {
  ChatAdapter,
  ChatConversation as ChatConversationModel,
  ChatMessage,
} from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docs/data/chat/material/examples/shared/demoData';

const SEND_ICON_PATH = 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z';

// The conversation that ships unread in the shared demo data.
const UNREAD_CONVERSATION_ID = inboxConversations.find(
  (conversation) => conversation.readState === 'unread',
)!.id;

// The first fully-read conversation — opened on mount so the unread one keeps its
// badge until the reader visits it.
const READ_CONVERSATION_ID = inboxConversations.find(
  (conversation) => conversation.readState === 'read',
)!.id;

// Start with ~4 unread messages so the marker lands well above the bottom.
const SEEDED_UNREAD_COUNT = 4;

// The stock unread thread has only 3 messages — far too short to overflow a 500px
// list. Extend it locally to ~12 messages so the marker starts out of view and
// reaching the bottom requires a real scroll.
function buildUnreadThread(): ChatMessage[] {
  const stock = inboxThreads[UNREAD_CONVERSATION_ID].map((message) => ({
    ...message,
  }));
  const author = stock[0].author;
  const filler: ChatMessage[] = Array.from({ length: 9 }, (_, offset) => {
    const index = offset + 1;
    const role = index % 2 === 0 ? ('assistant' as const) : ('user' as const);
    return {
      id: `rr-extra-${index}`,
      conversationId: UNREAD_CONVERSATION_ID,
      role,
      status: 'sent' as const,
      createdAt: `2026-03-15T10:${(12 + index).toString().padStart(2, '0')}:00.000Z`,
      author,
      parts: [
        {
          type: 'text' as const,
          text:
            role === 'user'
              ? `Follow-up question ${index} about the composer slots.`
              : `Here is detail ${index} on wiring the composer and its slots.`,
        },
      ],
    } satisfies ChatMessage;
  });

  return [...stock, ...filler];
}

function buildSeedConversations(): ChatConversationModel[] {
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

function buildSeedThreads(): Record<string, ChatMessage[]> {
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
const adapter: ChatAdapter = {
  ...echoAdapter,
  async markRead() {
    // In a real app this would notify the backend.
  },
};

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d={SEND_ICON_PATH} />
    </svg>
  );
}

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
    adapter.markRead!({ conversationId });
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
