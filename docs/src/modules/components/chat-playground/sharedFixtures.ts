import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { users } from './data';

/**
 * A small but realistic conversation list with mixed read state, used by
 * sidebar / header / list playgrounds.
 */
export const directoryConversations: ChatConversation[] = [
  {
    id: 'styling',
    title: 'Styling questions',
    subtitle: 'Theming MuiChatComposer',
    participants: [users.alice, users.assistant],
    readState: 'unread',
    unreadCount: 3,
    lastMessageAt: '2026-05-03T09:30:00.000Z',
  },
  {
    id: 'rag',
    title: 'RAG with sources',
    subtitle: 'Citations + retrieval',
    participants: [users.me, users.assistant],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-05-02T14:02:00.000Z',
  },
  {
    id: 'codereview',
    title: 'Code review',
    subtitle: 'Discussing the codeblock slot',
    participants: [users.me, users.assistant],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-05-01T11:15:00.000Z',
  },
  {
    id: 'planning',
    title: 'Planning',
    subtitle: 'Sprint scope & owners',
    participants: [users.me, users.alice],
    readState: 'unread',
    unreadCount: 1,
    lastMessageAt: '2026-05-01T08:42:00.000Z',
  },
];

/** Multi-day thread used to demo MessageList + DateDivider grouping. */
export const longThreadMessages: ChatMessage[] = [
  {
    id: 'long-1',
    conversationId: 'styling',
    role: 'user',
    author: users.alice,
    createdAt: '2026-05-02T15:30:00.000Z',
    status: 'read',
    parts: [{ type: 'text', text: 'Kicking off the design review thread.' }],
  },
  {
    id: 'long-2',
    conversationId: 'styling',
    role: 'assistant',
    author: users.assistant,
    createdAt: '2026-05-02T15:32:00.000Z',
    status: 'read',
    parts: [{ type: 'text', text: 'Here are the three areas I want to flag.' }],
  },
  {
    id: 'long-3',
    conversationId: 'styling',
    role: 'assistant',
    author: users.assistant,
    createdAt: '2026-05-02T15:33:00.000Z',
    status: 'read',
    parts: [{ type: 'text', text: '1) header spacing  2) bubble radius  3) timestamp position' }],
  },
  {
    id: 'long-4',
    conversationId: 'styling',
    role: 'user',
    author: users.me,
    createdAt: '2026-05-03T09:00:00.000Z',
    status: 'read',
    parts: [{ type: 'text', text: 'Picking this up today — radius first.' }],
  },
  {
    id: 'long-5',
    conversationId: 'styling',
    role: 'assistant',
    author: users.assistant,
    createdAt: '2026-05-03T09:01:00.000Z',
    status: 'sent',
    parts: [{ type: 'text', text: 'Sounds good. The default is `shape.borderRadius * 2`.' }],
  },
];

/** Three same-author messages used to demo grouping. */
export const groupThreadMessages: ChatMessage[] = [
  {
    id: 'grp-1',
    conversationId: 'styling',
    role: 'assistant',
    author: users.assistant,
    createdAt: '2026-05-03T10:00:00.000Z',
    status: 'read',
    parts: [{ type: 'text', text: 'Three quick notes on theming.' }],
  },
  {
    id: 'grp-2',
    conversationId: 'styling',
    role: 'assistant',
    author: users.assistant,
    createdAt: '2026-05-03T10:00:30.000Z',
    status: 'read',
    parts: [
      { type: 'text', text: 'First — the avatar only renders for the first message in a group.' },
    ],
  },
  {
    id: 'grp-3',
    conversationId: 'styling',
    role: 'assistant',
    author: users.assistant,
    createdAt: '2026-05-03T10:01:00.000Z',
    status: 'read',
    parts: [{ type: 'text', text: 'Second — bubbles tighten vertically when grouped.' }],
  },
];

/** A single conversation with no messages — useful for empty states + composer. */
export const emptyConversation: ChatConversation = {
  id: 'empty',
  title: 'New thread',
  subtitle: 'Nothing here yet',
  participants: [users.me, users.assistant],
  readState: 'read',
  unreadCount: 0,
};

/** Two short messages used for one-off bubble demos. */
export const bubbleMessages = {
  assistant: {
    id: 'bubble-assistant',
    conversationId: 'bubble',
    role: 'assistant',
    author: users.assistant,
    createdAt: '2026-05-03T09:30:00.000Z',
    status: 'read',
    parts: [
      {
        type: 'text',
        text: 'Assistant bubbles use `palette.background.paper` with a subtle border by default.',
      },
    ],
  } as ChatMessage,
  user: {
    id: 'bubble-user',
    conversationId: 'bubble',
    role: 'user',
    author: users.me,
    createdAt: '2026-05-03T09:31:00.000Z',
    status: 'read',
    parts: [{ type: 'text', text: 'And user bubbles use `palette.primary.main` for emphasis.' }],
  } as ChatMessage,
};

export const bubbleConversation: ChatConversation = {
  id: 'bubble',
  title: 'Bubble preview',
  participants: [users.me, users.assistant],
};

/** A library of sample texts so playgrounds can swap content quickly. */
export const sampleTexts = {
  short: 'Short reply.',
  medium: 'Default chat bubbles inherit `palette.background.paper` and `divider` automatically.',
  long: `Here's a longer assistant response that wraps across multiple lines so you can see how the bubble grows in height. The default density gives roughly 8px of vertical breathing room between bubbles, while the comfortable density doubles that. Try the controls to see the impact.`,
  markdown: `Here's a small list:

- **palette.background.paper** powers bubble surfaces
- **palette.divider** powers dividers
- **shape.borderRadius** powers corner rounding

Inline \`code\` works too.`,
  code: `\`\`\`tsx
import { ChatBox } from '@mui/x-chat';

export function MyChat() {
  return <ChatBox adapter={adapter} />;
}
\`\`\``,
};
