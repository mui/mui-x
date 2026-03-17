import * as React from 'react';
import { ChatProvider, useChat, type ChatAdapter } from '@mui/x-chat-headless';
import { demoUsers } from '../shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from '../shared/demoUtils';
import {
  DemoButton,
  DemoFrame,
  DemoHeading,
  DemoInput,
  DemoMessageList,
  DemoSplitLayout,
} from '../shared/DemoPrimitives';

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return createChunkStream(
      createTextResponseChunks(
        `minimal-assistant-${message.id}`,
        `You said: "${getMessageText(message)}". This response came from a streamed headless adapter.`,
      ),
      { delayMs: 220 },
    );
  },
};

function MinimalChatInner() {
  const { messages, sendMessage, isStreaming } = useChat();
  const [draft, setDraft] = React.useState('Show me the smallest working chat.');

  const submit = React.useCallback(async () => {
    if (draft.trim() === '') {
      return;
    }

    await sendMessage({
      conversationId: 'support',
      author: demoUsers.alice,
      parts: [{ type: 'text', text: draft }],
    });

    setDraft('');
  }, [draft, sendMessage]);

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Minimal recipe</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              This demo uses only <code>ChatProvider</code> and{' '}
              <code>useChat()</code>.
            </p>
            <DemoButton
              onClick={() => setDraft('How does optimistic sending work?')}
            >
              Load sample prompt
            </DemoButton>
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Minimal headless chat"
          description="The provider owns the runtime. Your markup stays fully custom."
          actions={<span>{isStreaming ? 'Streaming…' : 'Idle'}</span>}
        />
        <DemoMessageList
          messages={messages}
          emptyLabel="Send the first message to start the thread."
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <DemoInput
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message"
          />
          <DemoButton disabled={isStreaming || draft.trim() === ''} onClick={submit}>
            Send
          </DemoButton>
        </div>
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function MinimalHeadlessChat() {
  return (
    <ChatProvider adapter={adapter} defaultActiveConversationId="support">
      <MinimalChatInner />
    </ChatProvider>
  );
}
