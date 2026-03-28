'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter, randomId } from '../shared/demoUtils';
import { createTextMessage, demoUsers } from '../shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

const LONG_CONV_ID = randomId();

const adapter = createEchoAdapter({
  respond: () =>
    `This is a very long response to test text wrapping and overflow behavior in the ChatBox component. The Material UI styled bubbles should properly wrap long text without horizontal scrolling or layout issues.

Here is a code block to test code formatting:

\`\`\`typescript
const adapter: ChatAdapter = {
  async sendMessage({ message, signal }) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal,
    });
    return response.body;
  },
};
\`\`\`

And some inline \`code\` as well. This paragraph has a very long URL: https://mui.com/x/react-chat/material/examples/basic-ai-chat/#implementation-notes-and-best-practices-for-long-urls

Final paragraph to confirm all text renders correctly within the bubble boundaries.`,
});

const longConversation: ChatConversation = {
  id: LONG_CONV_ID,
  title: 'Long messages test',
  subtitle: 'Testing text wrapping and overflow',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:00:00.000Z',
};

const longMessages: ChatMessage[] = [
  createTextMessage({
    id: randomId(),
    conversationId: LONG_CONV_ID,
    role: 'user',
    createdAt: '2026-03-15T09:55:00.000Z',
    text: 'This is a short message.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: LONG_CONV_ID,
    role: 'assistant',
    createdAt: '2026-03-15T09:56:00.000Z',
    text: 'Short reply.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: LONG_CONV_ID,
    role: 'user',
    createdAt: '2026-03-15T09:57:00.000Z',
    text: 'Now here is a very long message to test how the ChatBox handles text wrapping. This message contains multiple sentences to verify that the bubble grows vertically without causing horizontal overflow. The width should be constrained to the maximum bubble width while the text wraps naturally. Additional text to ensure the message is sufficiently long for testing purposes. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: LONG_CONV_ID,
    role: 'assistant',
    createdAt: '2026-03-15T09:58:00.000Z',
    text: 'A single word: Acknowledged.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: LONG_CONV_ID,
    role: 'user',
    createdAt: '2026-03-15T09:59:00.000Z',
    text: 'Superlongwordwithoutanyspacestotestwordbreakbehaviorinthebubblelayoutwhencontentcannotwrapnaturally',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: LONG_CONV_ID,
    role: 'assistant',
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Message with special characters: <script>alert("xss")</script> and HTML entities: &lt;div&gt; and emojis: \uD83D\uDE0A\uD83D\uDE80\u2764\uFE0F\uD83C\uDF1F and unicode: \u00E9\u00E8\u00EA\u00EB \u00FC\u00F6\u00E4 \u00F1',
  }),
];

export default function LongMessages() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={longConversation.id}
      initialConversations={[longConversation]}
      initialMessages={longMessages}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
