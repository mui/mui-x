import type { ChatConversation, ChatMessage, ChatUser } from '@mui/x-chat-headless';

export const demoUsers = {
  alice: {
    id: 'alice',
    displayName: 'Alice',
    isOnline: true,
  } satisfies ChatUser,
  sam: {
    id: 'sam',
    displayName: 'Sam',
    isOnline: false,
  } satisfies ChatUser,
  agent: {
    id: 'agent',
    displayName: 'MUI Agent',
    isOnline: true,
  } satisfies ChatUser,
} as const;

export const demoConversations: ChatConversation[] = [
  {
    id: 'support',
    title: 'Support',
    subtitle: 'Streaming answers',
    readState: 'unread',
    unreadCount: 2,
    participants: [demoUsers.alice, demoUsers.agent],
  },
  {
    id: 'product',
    title: 'Product',
    subtitle: 'Roadmap review',
    readState: 'read',
    unreadCount: 0,
    participants: [demoUsers.sam, demoUsers.agent],
  },
  {
    id: 'research',
    title: 'Research',
    subtitle: 'Evidence and notes',
    readState: 'read',
    unreadCount: 0,
    participants: [demoUsers.alice, demoUsers.sam, demoUsers.agent],
  },
];

export function createTextMessage({
  id,
  conversationId,
  role,
  text,
  status = 'sent',
  author,
}: {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  text: string;
  status?: ChatMessage['status'];
  author?: ChatUser;
}): ChatMessage {
  return {
    id,
    conversationId,
    role,
    status,
    author,
    parts: [{ type: 'text', text }],
  };
}

export const demoThreads: Record<string, ChatMessage[]> = {
  support: [
    createTextMessage({
      id: 'support-a1',
      conversationId: 'support',
      role: 'assistant',
      author: demoUsers.agent,
      text: 'Welcome to the headless runtime demo.',
    }),
    createTextMessage({
      id: 'support-u1',
      conversationId: 'support',
      role: 'user',
      author: demoUsers.alice,
      text: 'Show me the smallest possible chat setup.',
    }),
  ],
  product: [
    createTextMessage({
      id: 'product-a1',
      conversationId: 'product',
      role: 'assistant',
      author: demoUsers.agent,
      text: 'The controlled API keeps public state array-first.',
    }),
    createTextMessage({
      id: 'product-u1',
      conversationId: 'product',
      role: 'user',
      author: demoUsers.sam,
      text: 'That is the behavior we want to document.',
    }),
  ],
  research: [
    createTextMessage({
      id: 'research-a1',
      conversationId: 'research',
      role: 'assistant',
      author: demoUsers.agent,
      text: 'Selectors let you subscribe at the row level.',
    }),
    createTextMessage({
      id: 'research-u1',
      conversationId: 'research',
      role: 'user',
      author: demoUsers.alice,
      text: 'Perfect. Let us measure rerenders.',
    }),
  ],
};

export function cloneConversations(conversations: ChatConversation[] = demoConversations) {
  return conversations.map((conversation) => ({
    ...conversation,
    participants: conversation.participants?.map((participant) => ({ ...participant })),
  }));
}

export function cloneMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({
    ...message,
    author: message.author ? { ...message.author } : undefined,
    parts: message.parts.map((part) => ({ ...part })) as ChatMessage['parts'],
  }));
}
