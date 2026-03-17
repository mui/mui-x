import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import {
  ChatProvider,
  chatSelectors,
  useChat,
  useChatComposer,
  useChatStore,
} from '@mui/x-chat-headless';
import {
  cloneConversations,
  demoConversations,
  demoThreads,
  demoUsers,
} from '../shared/demoData';
import { createChunkStream, createTextResponseChunks } from '../shared/demoUtils';
import {
  DemoButton,
  DemoFrame,
  DemoHeading,
  DemoInput,
  DemoMessageList,
  DemoSplitLayout,
  DemoStats,
} from '../shared/DemoPrimitives';

const adapter = {
  async sendMessage({ conversationId }) {
    return createChunkStream(
      createTextResponseChunks(
        `advanced-${conversationId}`,
        'The store escape hatch lets you build custom dashboards with chatSelectors.',
      ),
      { delayMs: 160 },
    );
  },
};

function AdvancedMetrics() {
  const store = useChatStore();
  const messageCount = useStore(store, chatSelectors.messageCount);
  const conversationCount = useStore(store, chatSelectors.conversationCount);
  const activeConversation = useStore(store, chatSelectors.activeConversation);
  const composerValue = useStore(store, chatSelectors.composerValue);
  const typingUserIds = useStore(store, chatSelectors.typingUserIds);
  const { messages, sendMessage, setActiveConversation } = useChat();
  const composer = useChatComposer();

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Advanced store access</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              This recipe uses <code>useChatStore()</code>,{' '}
              <code>chatSelectors</code>, and
              <code> useStore()</code> to build bespoke metrics.
            </p>
            <DemoButton
              onClick={() => {
                store.setTypingUser(
                  activeConversation?.id ?? 'support',
                  demoUsers.alice.id,
                  true,
                );
              }}
            >
              Simulate typing
            </DemoButton>
            <DemoButton
              onClick={() => {
                store.setTypingUser(
                  activeConversation?.id ?? 'support',
                  demoUsers.alice.id,
                  false,
                );
              }}
            >
              Clear typing
            </DemoButton>
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Store escape hatch"
          description="The runtime stays headless, but advanced consumers can subscribe to exactly the slices they need."
        />
        <DemoStats
          items={[
            { label: 'Messages', value: messageCount },
            { label: 'Conversations', value: conversationCount },
            { label: 'Active title', value: activeConversation?.title ?? 'none' },
            { label: 'Composer value', value: composerValue || 'empty' },
            { label: 'Typing users', value: typingUserIds.join(', ') || 'none' },
          ]}
        />
        <DemoMessageList messages={messages} />
        <div style={{ display: 'flex', gap: 8 }}>
          <DemoInput
            value={composer.value}
            onChange={(event) => composer.setValue(event.target.value)}
          />
          <DemoButton
            onClick={() =>
              void sendMessage({
                conversationId: activeConversation?.id ?? 'support',
                author: demoUsers.alice,
                parts: [
                  { type: 'text', text: composer.value || 'Store-driven message' },
                ],
              })
            }
          >
            Send
          </DemoButton>
          <DemoButton
            onClick={() => {
              void setActiveConversation(
                activeConversation?.id === 'support' ? 'product' : 'support',
              );
            }}
          >
            Toggle conversation
          </DemoButton>
        </div>
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function AdvancedStoreAccessHeadlessChat() {
  return (
    <ChatProvider
      adapter={adapter}
      defaultConversations={cloneConversations(demoConversations.slice(0, 2))}
      defaultActiveConversationId="support"
      defaultMessages={[...demoThreads.support, ...demoThreads.product]}
      defaultComposerValue="Track this with a custom selector."
    >
      <AdvancedMetrics />
    </ChatProvider>
  );
}
