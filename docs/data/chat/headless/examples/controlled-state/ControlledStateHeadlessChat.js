import * as React from 'react';
import { ChatProvider, useChat, useChatComposer } from '@mui/x-chat-headless';
import {
  cloneConversations,
  cloneMessages,
  demoConversations,
  demoThreads,
  demoUsers,
} from '../shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from '../shared/demoUtils';
import {
  DemoButton,
  DemoConversationList,
  DemoFrame,
  DemoHeading,
  DemoInput,
  DemoMessageList,
  DemoSplitLayout,
  DemoStats,
} from '../shared/DemoPrimitives';

function ControlledStateChat({ activeConversationId }) {
  const { messages, conversations, setActiveConversation } = useChat();
  const composer = useChatComposer();

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Controlled models</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              Every public model is driven by external React state.
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
          title="Controlled headless state"
          description="Messages, conversations, active conversation, and composer value all stay outside the runtime."
        />
        <DemoStats
          items={[
            { label: 'Messages', value: messages.length },
            { label: 'Conversations', value: conversations.length },
            { label: 'Active', value: activeConversationId ?? 'none' },
            { label: 'Composer', value: composer.value || 'empty' },
          ]}
        />
        <DemoMessageList
          messages={messages}
          emptyLabel="Switch conversations to load controlled messages."
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <DemoInput
            value={composer.value}
            onChange={(event) => composer.setValue(event.target.value)}
            placeholder="The composer is controlled from the parent"
          />
          <DemoButton
            onClick={() => {
              void composer.submit();
            }}
            disabled={composer.isSubmitting || composer.value.trim() === ''}
          >
            Submit
          </DemoButton>
        </div>
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function ControlledStateHeadlessChat() {
  const allConversations = React.useMemo(
    () => cloneConversations(demoConversations.slice(0, 2)),
    [],
  );
  const [conversations, setConversations] = React.useState(allConversations);
  const [activeConversationId, setActiveConversationId] = React.useState('product');
  const [composerValue, setComposerValue] = React.useState(
    'Document the controlled models.',
  );
  const [messagesByConversation, setMessagesByConversation] = React.useState({
    support: cloneMessages(demoThreads.support),
    product: cloneMessages(demoThreads.product),
  });

  const messages = activeConversationId
    ? (messagesByConversation[activeConversationId] ?? [])
    : [];

  const adapter = React.useMemo(
    () => ({
      async sendMessage({ conversationId: _conversationId, message }) {
        return createChunkStream(
          createTextResponseChunks(
            `controlled-${message.id}`,
            `Controlled state still streams through the normalized runtime: "${getMessageText(message)}".`,
          ),
          { delayMs: 160 },
        );
      },
    }),
    [],
  );

  return (
    <ChatProvider
      adapter={adapter}
      conversations={conversations}
      onConversationsChange={setConversations}
      activeConversationId={activeConversationId}
      onActiveConversationChange={setActiveConversationId}
      messages={messages}
      onMessagesChange={(nextMessages) => {
        setMessagesByConversation((previous) => ({
          ...previous,
          [activeConversationId ?? 'support']: nextMessages.map((message) => ({
            ...message,
            author:
              message.author ??
              (message.role === 'user' ? demoUsers.sam : demoUsers.agent),
          })),
        }));
      }}
      composerValue={composerValue}
      onComposerValueChange={setComposerValue}
    >
      <ControlledStateChat activeConversationId={activeConversationId} />
    </ChatProvider>
  );
}
