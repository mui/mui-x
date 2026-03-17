import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useChatStatus,
  useConversation,
  useConversations,
  type ChatAdapter,
  type ChatRealtimeEvent,
} from '@mui/x-chat-headless';
import {
  cloneConversations,
  demoConversations,
  demoUsers,
} from '../shared/demoData';
import { createChunkStream, createTextResponseChunks } from '../shared/demoUtils';
import {
  DemoButton,
  DemoConversationList,
  DemoFrame,
  DemoHeading,
  DemoMessageList,
  DemoSplitLayout,
  DemoStats,
} from '../shared/DemoPrimitives';

function createRealtimeAdapter() {
  let onEventRef: ((event: ChatRealtimeEvent) => void) | null = null;

  return {
    adapter: {
      async sendMessage({ conversationId }) {
        return createChunkStream(
          createTextResponseChunks(
            `realtime-${conversationId}`,
            'Realtime subscriptions keep presence, typing, and read state synced.',
          ),
        );
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

function getOnlineNames(conversations: ReturnType<typeof useConversations>): string {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const conversation of conversations) {
    for (const participant of conversation.participants ?? []) {
      if (participant.isOnline && !seen.has(participant.id)) {
        seen.add(participant.id);
        names.push(participant.displayName ?? participant.id);
      }
    }
  }

  return names.join(', ') || 'none';
}

function RealtimeInner({ emit }: { emit: (event: ChatRealtimeEvent) => void }) {
  const { messages } = useChat();
  const { typingUserIds } = useChatStatus();
  const conversations = useConversations();
  const activeConversation = useConversation('support');

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Realtime subscription</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              The provider owns the subscription. These buttons emit demo realtime
              events.
            </p>
            <DemoConversationList
              conversations={conversations}
              activeConversationId="support"
            />
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Realtime presence and typing"
          description="Typing, presence, and read-state changes come in through adapter.subscribe()."
        />
        <DemoStats
          items={[
            { label: 'Typing users', value: typingUserIds.join(', ') || 'none' },
            { label: 'Online', value: getOnlineNames(conversations) },
            { label: 'Unread', value: activeConversation?.unreadCount ?? 0 },
            {
              label: 'Read state',
              value: activeConversation?.readState ?? 'unknown',
            },
          ]}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <DemoButton
            onClick={() =>
              emit({
                type: 'typing',
                conversationId: 'support',
                userId: demoUsers.alice.id,
                isTyping: true,
              })
            }
          >
            Alice starts typing
          </DemoButton>
          <DemoButton
            onClick={() =>
              emit({
                type: 'typing',
                conversationId: 'support',
                userId: demoUsers.alice.id,
                isTyping: false,
              })
            }
          >
            Alice stops typing
          </DemoButton>
          <DemoButton
            onClick={() =>
              emit({ type: 'presence', userId: demoUsers.sam.id, isOnline: true })
            }
          >
            Sam comes online
          </DemoButton>
          <DemoButton
            onClick={() =>
              emit({ type: 'presence', userId: demoUsers.sam.id, isOnline: false })
            }
          >
            Sam goes offline
          </DemoButton>
          <DemoButton
            onClick={() =>
              emit({
                type: 'read',
                conversationId: 'support',
                userId: demoUsers.alice.id,
              })
            }
          >
            Mark thread as read
          </DemoButton>
        </div>
        <DemoMessageList
          messages={messages}
          emptyLabel="This example focuses on state reactions from realtime events."
        />
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function RealtimeHeadlessChat() {
  const { adapter, emit } = React.useMemo(() => createRealtimeAdapter(), []);

  return (
    <ChatProvider
      adapter={adapter}
      defaultConversations={cloneConversations(demoConversations.slice(0, 2))}
      defaultActiveConversationId="support"
    >
      <RealtimeInner emit={emit} />
    </ChatProvider>
  );
}
