import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatAdapter, ChatConversation, ChatMessage, ChatUser } from '@mui/x-chat/headless';
import { defineScenario } from '../utils/scenario';

const you: ChatUser = { id: 'you', displayName: 'You', role: 'user' };
const agent: ChatUser = { id: 'agent', displayName: 'Assistant', role: 'assistant' };

const conversation: ChatConversation = {
  id: 'conversation',
  title: 'Benchmark',
  participants: [you, agent],
};

const messages: ChatMessage[] = Array.from({ length: 200 }, (_, index) => {
  const role = index % 2 === 0 ? 'user' : 'assistant';
  return {
    id: `message-${index}`,
    conversationId: conversation.id,
    role,
    status: 'sent',
    author: role === 'user' ? you : agent,
    createdAt: new Date(Date.UTC(2025, 6, 15, 10, 0, index)).toISOString(),
    parts: [
      {
        type: 'text',
        text: `Message ${index}: the quick brown fox jumps over the lazy dog, again and again.`,
      },
    ],
  };
});

// Nothing is sent during a sample.
const adapter: ChatAdapter = {
  sendMessage() {
    throw new Error('Not sent in benchmarks.');
  },
};

export const chatBox = defineScenario('ChatBox with 200 messages', () => (
  <ChatBox
    adapter={adapter}
    initialActiveConversationId={conversation.id}
    initialConversations={[conversation]}
    initialMessages={messages}
    sx={{ width: 800, height: 600 }}
  />
));
