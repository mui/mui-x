import * as React from 'react';
import {
  ChatProvider,
  useConversation,
  useConversations,
  useMessage,
  useMessageIds,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
} from '@mui/x-chat-headless';
import { demoUsers } from '../shared/demoData';
import {
  DemoButton,
  DemoConversationList,
  DemoFrame,
  DemoHeading,
  DemoSplitLayout,
} from '../shared/DemoPrimitives';

function createMessages() {
  return Array.from({ length: 14 }, (_, index) => ({
    id: `selector-${index + 1}`,
    conversationId: 'selectors',
    role: index % 2 === 0 ? 'assistant' : 'user',
    author: index % 2 === 0 ? demoUsers.agent : demoUsers.alice,
    status: 'sent',
    parts: [
      {
        type: 'text',
        text: `Row ${index + 1} is subscribed independently.`,
      },
    ],
  })) as ChatMessage[];
}

const MessageRow = React.memo(function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  const renders = React.useRef(0);

  React.useEffect(() => {
    renders.current += 1;
  });

  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        border: '1px solid #d7dee7',
        borderRadius: 12,
        padding: 10,
        background: '#fff',
      }}
    >
      <div style={{ fontSize: 12, color: '#5c6b7c' }}>
        {message.id} · renders {renders.current}
      </div>
      <div style={{ marginTop: 4, fontWeight: 700 }}>
        {message.author?.displayName ?? message.role}
      </div>
      <div style={{ marginTop: 6 }}>
        {message.parts[0]?.type === 'text' ? message.parts[0].text : null}
      </div>
    </div>
  );
});

function SelectorThread() {
  const messageIds = useMessageIds();
  const conversations = useConversations();
  const conversation = useConversation('selectors');

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Selector hooks</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              The list subscribes to ids. Each row subscribes to its own message.
            </p>
            <DemoConversationList
              conversations={conversations}
              activeConversationId="selectors"
            />
          </React.Fragment>
        }
      >
        <DemoHeading
          title={conversation?.title ?? 'Selector lab'}
          description="Update one controlled message from the parent to see only the matching row rerender."
        />
        <div style={{ display: 'grid', gap: 8 }}>
          {messageIds.map((id) => (
            <MessageRow key={id} id={id} />
          ))}
        </div>
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function SelectorDrivenThread() {
  const [messages, setMessages] = React.useState(createMessages);
  const [conversations] = React.useState<ChatConversation[]>([
    {
      id: 'selectors',
      title: 'Selector-driven thread',
      subtitle: 'Row-level subscriptions',
    },
  ]);

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        return new ReadableStream({
          start(controller) {
            controller.close();
          },
        });
      },
    }),
    [],
  );

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <DemoButton
          onClick={() => {
            setMessages((previous) =>
              previous.map((message) =>
                message.id === 'selector-6'
                  ? {
                      ...message,
                      parts: [
                        {
                          type: 'text',
                          text: 'Only this row changed in the controlled state.',
                        },
                      ],
                    }
                  : message,
              ),
            );
          }}
        >
          Update message 6
        </DemoButton>
        <DemoButton
          onClick={() => {
            setMessages((previous) => [
              ...previous,
              {
                id: `selector-${previous.length + 1}`,
                conversationId: 'selectors',
                role: 'assistant',
                author: demoUsers.agent,
                status: 'sent',
                parts: [
                  {
                    type: 'text',
                    text: 'A new row appears without rerendering every item.',
                  },
                ],
              },
            ]);
          }}
        >
          Append one row
        </DemoButton>
      </div>
      <ChatProvider
        adapter={adapter}
        messages={messages}
        conversations={conversations}
        activeConversationId="selectors"
      >
        <SelectorThread />
      </ChatProvider>
    </div>
  );
}
