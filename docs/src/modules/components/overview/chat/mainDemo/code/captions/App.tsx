import * as React from 'react';
import {
  Chat,
  Conversation,
  MessageGroup,
  MessageList,
  createTimeWindowGroupKey,
} from '@mui/x-chat/headless';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

const adapter = {
  async sendMessage() {
    return new ReadableStream();
  },
};

const conversation: ChatConversation = {
  id: 'meeting',
  title: 'Design sync',
  subtitle: 'Grouped by speaker and time window',
};

const captions: ChatMessage[] = [
  {
    id: 'caption-1',
    conversationId: 'meeting',
    role: 'assistant',
    author: { id: 'sam', displayName: 'Sam' },
    createdAt: '2026-05-03T09:00:00.000Z',
    parts: [{ type: 'text', text: 'Let us start with the mobile layout updates.' }],
  },
  {
    id: 'caption-2',
    conversationId: 'meeting',
    role: 'assistant',
    author: { id: 'sam', displayName: 'Sam' },
    createdAt: '2026-05-03T09:03:00.000Z',
    parts: [{ type: 'text', text: 'The new composer spacing feels much better.' }],
  },
];

export default function App() {
  const groupKey = React.useMemo(() => createTimeWindowGroupKey(5 * 60_000), []);

  return (
    <Chat.Root
      adapter={adapter}
      initialConversations={[conversation]}
      initialActiveConversationId={conversation.id}
      initialMessages={captions}
    >
      <Conversation.Root style={{ background: '#121113', color: '#ffffff' }}>
        <MessageList.Root
          renderItem={({ id, index }) => (
            <MessageGroup key={id} groupKey={groupKey} index={index} messageId={id} />
          )}
        />
      </Conversation.Root>
    </Chat.Root>
  );
}
