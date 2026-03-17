import * as React from 'react';
import { ChatProvider, useChat } from '@mui/x-chat-headless';
import { demoUsers } from '../shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  wait,
} from '../shared/demoUtils';
import {
  DemoButton,
  DemoConversationList,
  DemoFrame,
  DemoHeading,
  DemoMessageList,
  DemoSplitLayout,
  DemoTag,
} from '../shared/DemoPrimitives';

const conversations = [
  {
    id: 'support',
    title: 'Support',
    subtitle: 'History and paging',
    unreadCount: 1,
    readState: 'unread',
  },
  {
    id: 'research',
    title: 'Research',
    subtitle: 'Switching threads',
    unreadCount: 0,
    readState: 'read',
  },
];

const pages = {
  support: {
    initial: {
      messages: [
        {
          id: 'support-now-1',
          conversationId: 'support',
          role: 'assistant',
          author: demoUsers.agent,
          status: 'sent',
          parts: [{ type: 'text', text: 'This is the newest page for Support.' }],
        },
        {
          id: 'support-now-2',
          conversationId: 'support',
          role: 'user',
          author: demoUsers.alice,
          status: 'sent',
          parts: [{ type: 'text', text: 'Load older history when I ask for it.' }],
        },
      ],
      cursor: 'support:older',
      hasMore: true,
    },
    'support:older': {
      messages: [
        {
          id: 'support-old-1',
          conversationId: 'support',
          role: 'assistant',
          author: demoUsers.agent,
          status: 'sent',
          parts: [
            {
              type: 'text',
              text: 'This older page is prepended above the current thread.',
            },
          ],
        },
      ],
      hasMore: false,
    },
  },
  research: {
    initial: {
      messages: [
        {
          id: 'research-now-1',
          conversationId: 'research',
          role: 'assistant',
          author: demoUsers.agent,
          status: 'sent',
          parts: [
            {
              type: 'text',
              text: 'Switching conversations reloads the thread from the adapter.',
            },
          ],
        },
      ],
      hasMore: false,
    },
  },
};

const adapter = {
  async listConversations() {
    await wait(180);
    return { conversations };
  },
  async listMessages({ conversationId, cursor }) {
    await wait(220);
    const key = cursor ?? 'initial';
    return pages[conversationId][key];
  },
  async sendMessage({ conversationId, message: _message }) {
    return createChunkStream(
      createTextResponseChunks(
        `reply-${conversationId}-${Date.now()}`,
        `The active conversation is ${conversationId}. The adapter still streams new turns after history loads.`,
      ),
      { delayMs: 160 },
    );
  },
};

function ConversationHistoryInner() {
  const {
    conversations: loadedConversations,
    messages,
    activeConversationId,
    hasMoreHistory,
    setActiveConversation,
    loadMoreHistory,
    sendMessage,
  } = useChat();

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Conversation orchestration</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              Conversations come from <code>listConversations()</code>. Each thread
              comes from
              <code> listMessages()</code>.
            </p>
            <DemoConversationList
              conversations={loadedConversations}
              activeConversationId={activeConversationId}
              onSelect={(conversationId) => {
                void setActiveConversation(conversationId);
              }}
            />
          </React.Fragment>
        }
      >
        <DemoHeading
          title={activeConversationId ?? 'Loading conversations'}
          description="Use the buttons to switch threads, load older pages, and send a follow-up message."
          actions={hasMoreHistory ? <DemoTag>More history available</DemoTag> : null}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <DemoButton
            disabled={!hasMoreHistory}
            onClick={() => void loadMoreHistory()}
          >
            Load older history
          </DemoButton>
          <DemoButton
            disabled={!activeConversationId}
            onClick={() =>
              void sendMessage({
                conversationId: activeConversationId,
                author: demoUsers.alice,
                parts: [{ type: 'text', text: 'Send a follow-up turn.' }],
              })
            }
          >
            Send follow-up
          </DemoButton>
        </div>
        <DemoMessageList
          messages={messages}
          emptyLabel="Messages load from the adapter when the active conversation changes."
        />
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function ConversationHistoryHeadlessChat() {
  return (
    <ChatProvider adapter={adapter} defaultActiveConversationId="support">
      <ConversationHistoryInner />
    </ChatProvider>
  );
}
