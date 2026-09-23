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
    id: 'release',
    title: 'Release',
    subtitle: 'Ship checklist',
    unreadCount: 2,
    readState: 'unread',
  },
  {
    id: 'support',
    title: 'Support',
    subtitle: 'Follow up with Erin',
    readState: 'read',
  },
];

const initialThreads: Record<string, ChatMessage[]> = {
  release: [
    {
      id: 'release-1',
      conversationId: 'release',
      role: 'assistant',
      author: { id: 'maya', displayName: 'Maya' },
      parts: [{ type: 'text', text: 'Can you review the launch copy before 4 PM?' }],
    },
  ],
  support: [
    {
      id: 'support-1',
      conversationId: 'support',
      role: 'user',
      author: { id: 'you', displayName: 'You' },
      parts: [{ type: 'text', text: 'I will send the updated reply this afternoon.' }],
    },
  ],
};

export default function App() {
  const [activeConversationId, setActiveConversationId] = React.useState(conversations[0].id);
  const [messagesByConversation, setMessagesByConversation] = React.useState(initialThreads);

  return (
    <ChatBox
      adapter={adapter}
      conversations={conversations}
      activeConversationId={activeConversationId}
      messages={messagesByConversation[activeConversationId] ?? []}
      features={{ conversationList: true }}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveConversationId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setMessagesByConversation((prev) => ({
          ...prev,
          [activeConversationId]: nextMessages,
        }));
      }}
    />
  );
}
