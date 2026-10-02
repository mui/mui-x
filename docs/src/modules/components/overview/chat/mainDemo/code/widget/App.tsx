import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

const adapter = {
  async sendMessage() {
    return new ReadableStream();
  },
};

const conversations: ChatConversation[] = [
  {
    id: 'support',
    title: 'Fin',
    subtitle: 'Usually replies in a minute',
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: 'support-1',
    conversationId: 'support',
    role: 'assistant',
    author: { id: 'fin', displayName: 'Fin' },
    parts: [{ type: 'text', text: 'What can I help you with today?' }],
  },
];

export default function App() {
  const [activeConversationId, setActiveConversationId] = React.useState<string | undefined>(
    undefined,
  );
  const [messages, setMessages] = React.useState(initialMessages);

  return (
    <ChatBox
      adapter={adapter}
      conversations={conversations}
      activeConversationId={activeConversationId}
      messages={activeConversationId ? messages : []}
      onActiveConversationChange={(nextId) => setActiveConversationId(nextId ?? undefined)}
      onMessagesChange={setMessages}
      layoutMode="split"
      features={{ conversationList: true }}
    />
  );
}
