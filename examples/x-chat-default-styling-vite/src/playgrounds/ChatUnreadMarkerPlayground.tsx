import * as React from 'react';
import { Box } from '@mui/material';
import { ChatUnreadMarker } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { MessageBubble } from './MessageBubble';
import { NumberControl } from './controls';
import { users } from '../data';

const conversation: ChatConversation = {
  id: 'unread-playground',
  title: 'Unread thread',
  participants: [users.me, users.assistant],
  unreadCount: 1,
  readState: 'unread',
};

function buildMessages(count: number): ChatMessage[] {
  const base = Date.UTC(2026, 4, 3, 8, 30, 0);
  return Array.from({ length: count }, (_, i) => ({
    id: `unread-msg-${i}`,
    conversationId: conversation.id,
    role: 'assistant' as const,
    author: users.assistant,
    createdAt: new Date(base + i * 60_000).toISOString(),
    status: i < Math.floor(count / 2) ? ('read' as const) : ('sent' as const),
    parts: [{ type: 'text', text: `Message ${i + 1}` }],
  }));
}

export function ChatUnreadMarkerPlayground() {
  const [count, setCount] = React.useState(4);
  const [boundary, setBoundary] = React.useState(2);
  const messages = React.useMemo(() => buildMessages(count), [count]);
  const safeBoundary = Math.min(boundary, count - 1);

  return (
    <PlaygroundCard
      title="ChatUnreadMarker"
      description="Divider rendered when a message sits at the unread boundary."
      previewBackground="background.default"
      previewMinHeight={260}
      controls={
        <React.Fragment>
          <NumberControl label="message count" value={count} min={2} max={6} onChange={setCount} />
          <NumberControl
            label="boundary index"
            value={safeBoundary}
            min={0}
            max={Math.max(0, count - 1)}
            onChange={setBoundary}
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={messages}
          activeConversationId={conversation.id}
        >
          <Box sx={{ width: '100%' }}>
            {messages.map((message, i) => (
              <React.Fragment key={message.id}>
                {i === safeBoundary ? <ChatUnreadMarker messageId={message.id} /> : null}
                <MessageBubble messageId={message.id} />
              </React.Fragment>
            ))}
          </Box>
        </ScopedChat>
      }
    />
  );
}
