import * as React from 'react';
import {
  ChatProvider,
  useChat,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
  type ChatRealtimeEvent,
} from '@mui/x-chat-headless';
import {
  cloneConversations,
  cloneMessages,
  demoConversations,
  demoThreads,
  demoUsers,
} from '../shared/demoData';
import {
  DemoButton,
  DemoConversationList,
  DemoFrame,
  DemoHeading,
  DemoMessageList,
  DemoSplitLayout,
  DemoStats,
} from '../shared/DemoPrimitives';

function createRealtimeSyncAdapter() {
  let onEventRef: ((event: ChatRealtimeEvent) => void) | null = null;

  return {
    adapter: {
      async sendMessage() {
        return new ReadableStream({
          start(controller) {
            controller.close();
          },
        });
      },
      subscribe({ onEvent }) {
        onEventRef = onEvent;
        return () => {
          onEventRef = null;
        };
      },
    } satisfies ChatAdapter,
    emit(event: ChatRealtimeEvent) {
      onEventRef?.(event);
    },
  };
}

function RealtimeThreadSyncInner({
  emit,
}: {
  emit: (event: ChatRealtimeEvent) => void;
}) {
  const { conversations, messages, activeConversationId, setActiveConversation } =
    useChat();
  const messageCounter = React.useRef(0);
  const conversationCounter = React.useRef(0);
  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const addMessage = () => {
    if (!activeConversationId) {
      return;
    }

    messageCounter.current += 1;
    const nextMessage: ChatMessage = {
      id: `live-message-${messageCounter.current}`,
      conversationId: activeConversationId,
      role: 'assistant',
      author: demoUsers.agent,
      status: 'sent',
      parts: [
        {
          type: 'text',
          text: `Realtime message ${messageCounter.current} arrived for ${activeConversationId}.`,
        },
      ],
    };

    emit({ type: 'message-added', message: nextMessage });
  };

  const updateLastMessage = () => {
    const target = [...messages]
      .reverse()
      .find((message) => message.role === 'assistant');

    if (!target) {
      return;
    }

    emit({
      type: 'message-updated',
      message: {
        ...target,
        parts: [
          {
            type: 'text',
            text: 'This assistant message was patched by a realtime update.',
          },
        ],
      },
    });
  };

  const removeLastMessage = () => {
    const target = [...messages]
      .reverse()
      .find((message) => message.role === 'assistant');

    if (!target) {
      return;
    }

    emit({ type: 'message-removed', messageId: target.id });
  };

  const addConversation = () => {
    conversationCounter.current += 1;
    const conversation: ChatConversation = {
      id: `live-conversation-${conversationCounter.current}`,
      title: `Escalation ${conversationCounter.current}`,
      subtitle: 'Created by realtime sync',
      readState: 'unread',
      unreadCount: 1,
      participants: [demoUsers.alice, demoUsers.agent],
    };

    emit({ type: 'conversation-added', conversation });
  };

  const renameActiveConversation = () => {
    if (!activeConversation) {
      return;
    }

    emit({
      type: 'conversation-updated',
      conversation: {
        ...activeConversation,
        title: `${activeConversation.title} (live)`,
        subtitle: 'Renamed by realtime event',
      },
    });
  };

  const removeActiveConversation = () => {
    if (!activeConversationId) {
      return;
    }

    emit({ type: 'conversation-removed', conversationId: activeConversationId });
  };

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Conversation sync</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              The provider applies incoming realtime record updates directly to the
              normalized store.
            </p>
            <DemoConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelect={(conversationId) => {
                void setActiveConversation(conversationId);
              }}
            />
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Realtime collection sync"
          description="Message and conversation events can reshape the thread without a manual refetch."
        />
        <DemoStats
          items={[
            { label: 'Conversations', value: conversations.length },
            { label: 'Active', value: activeConversation?.title ?? 'none' },
            { label: 'Messages', value: messages.length },
          ]}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <DemoButton onClick={addMessage} disabled={!activeConversationId}>
            Add message
          </DemoButton>
          <DemoButton onClick={updateLastMessage} disabled={messages.length === 0}>
            Update last assistant message
          </DemoButton>
          <DemoButton onClick={removeLastMessage} disabled={messages.length === 0}>
            Remove last assistant message
          </DemoButton>
          <DemoButton onClick={addConversation}>Add conversation</DemoButton>
          <DemoButton
            onClick={renameActiveConversation}
            disabled={!activeConversationId}
          >
            Rename active conversation
          </DemoButton>
          <DemoButton
            onClick={removeActiveConversation}
            disabled={!activeConversationId}
          >
            Remove active conversation
          </DemoButton>
        </div>
        <DemoMessageList
          messages={messages}
          emptyLabel="Select or create a conversation. Removing the active thread clears the message view."
        />
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function RealtimeThreadSyncHeadlessChat() {
  const { adapter, emit } = React.useMemo(() => createRealtimeSyncAdapter(), []);

  return (
    <ChatProvider
      adapter={adapter}
      defaultConversations={cloneConversations(demoConversations.slice(0, 2))}
      defaultMessages={[
        ...cloneMessages(demoThreads.support),
        ...cloneMessages(demoThreads.product),
      ]}
      defaultActiveConversationId="support"
    >
      <RealtimeThreadSyncInner emit={emit} />
    </ChatProvider>
  );
}
