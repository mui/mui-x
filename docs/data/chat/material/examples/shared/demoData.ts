import type { ChatConversation, ChatMessage, ChatUser } from '@mui/x-chat/headless';

function createAvatarDataUrl(label: string, background: string, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const demoUsers = {
  you: {
    id: 'you',
    displayName: 'You',
    avatarUrl: createAvatarDataUrl('Y', '#1976d2'),
    isOnline: true,
    role: 'user',
  } satisfies ChatUser,
  agent: {
    id: 'agent',
    displayName: 'MUI Assistant',
    avatarUrl: createAvatarDataUrl('M', '#9c27b0'),
    isOnline: true,
    role: 'assistant',
  } satisfies ChatUser,
  alice: {
    id: 'alice',
    displayName: 'Alice Chen',
    avatarUrl: createAvatarDataUrl('A', '#0288d1'),
    isOnline: true,
    role: 'user',
  } satisfies ChatUser,
  marco: {
    id: 'marco',
    displayName: 'Marco Diaz',
    avatarUrl: createAvatarDataUrl('M', '#388e3c'),
    isOnline: false,
    role: 'user',
  } satisfies ChatUser,
  priya: {
    id: 'priya',
    displayName: 'Priya Singh',
    avatarUrl: createAvatarDataUrl('P', '#f57c00'),
    isOnline: true,
    role: 'user',
  } satisfies ChatUser,
} as const;

export function createTextMessage(params: {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
  author?: ChatUser;
  status?: ChatMessage['status'];
}) {
  const {
    id,
    conversationId,
    role,
    text,
    createdAt,
    author = role === 'assistant' ? demoUsers.agent : demoUsers.you,
    status = 'sent',
  } = params;

  return {
    id,
    conversationId,
    role,
    status,
    createdAt,
    author,
    parts: [{ type: 'text' as const, text }],
  } satisfies ChatMessage;
}

// ---------------------------------------------------------------------------
// Conversation IDs — static strings to avoid SSR/client hydration mismatches.
// ---------------------------------------------------------------------------

const starterConvId = 'conv-starter';
const componentQConvId = 'conv-component-q';
const themeHelpConvId = 'conv-theme-help';
const slotHelpConvId = 'conv-slot-help';

export const minimalConversation: ChatConversation = {
  id: starterConvId,
  title: 'Material UI chat',
  subtitle: 'Styled with your active MUI theme',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:00:00.000Z',
};

export const minimalMessages: ChatMessage[] = [
  createTextMessage({
    id: 'starter-msg-1',
    conversationId: starterConvId,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:58:00.000Z',
    text: 'Hello! I am styled using your active Material UI theme. Try sending a message.',
  }),
  createTextMessage({
    id: 'starter-msg-2',
    conversationId: starterConvId,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Great — the bubble colors come from palette.primary and the typography from the theme.',
  }),
];

export const inboxConversations: ChatConversation[] = [
  {
    id: componentQConvId,
    title: 'Component questions',
    subtitle: 'Which component handles the composer?',
    participants: [demoUsers.alice, demoUsers.agent],
    unreadCount: 2,
    readState: 'unread',
    lastMessageAt: '2026-03-15T10:12:00.000Z',
  },
  {
    id: themeHelpConvId,
    title: 'Theme customization',
    subtitle: 'How do I override the bubble color?',
    participants: [demoUsers.marco, demoUsers.agent],
    unreadCount: 0,
    readState: 'read',
    lastMessageAt: '2026-03-15T09:45:00.000Z',
  },
  {
    id: slotHelpConvId,
    title: 'Slot overrides',
    subtitle: 'Replacing the send button slot',
    participants: [demoUsers.priya, demoUsers.agent],
    unreadCount: 0,
    readState: 'read',
    lastMessageAt: '2026-03-14T18:00:00.000Z',
  },
];

export const inboxThreads: Record<string, ChatMessage[]> = {
  [componentQConvId]: [
    createTextMessage({
      id: 'cq-msg-1',
      conversationId: componentQConvId,
      role: 'user',
      author: demoUsers.alice,
      createdAt: '2026-03-15T10:05:00.000Z',
      text: 'Which component should I use for the message input area?',
    }),
    createTextMessage({
      id: 'cq-msg-2',
      conversationId: componentQConvId,
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-15T10:08:00.000Z',
      text: 'The composer is handled by the ChatBox automatically. You can override it with slots.composerRoot.',
    }),
    createTextMessage({
      id: 'cq-msg-3',
      conversationId: componentQConvId,
      role: 'user',
      author: demoUsers.alice,
      createdAt: '2026-03-15T10:12:00.000Z',
      text: 'And what about slotProps for passing sx to the input?',
    }),
  ],
  [themeHelpConvId]: [
    createTextMessage({
      id: 'th-msg-1',
      conversationId: themeHelpConvId,
      role: 'user',
      author: demoUsers.marco,
      createdAt: '2026-03-15T09:40:00.000Z',
      text: 'How do I change the user message bubble color from primary to something custom?',
    }),
    createTextMessage({
      id: 'th-msg-2',
      conversationId: themeHelpConvId,
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-15T09:45:00.000Z',
      text: 'Use createTheme with a custom palette.primary, or use slots.messageContent to replace the bubble entirely.',
    }),
  ],
  [slotHelpConvId]: [
    createTextMessage({
      id: 'sh-msg-1',
      conversationId: slotHelpConvId,
      role: 'user',
      author: demoUsers.priya,
      createdAt: '2026-03-14T17:50:00.000Z',
      text: 'Use slots.composerSendButton to replace the send button with any React component.',
    }),
    createTextMessage({
      id: 'sh-msg-2',
      conversationId: slotHelpConvId,
      role: 'user',
      author: demoUsers.you,
      createdAt: '2026-03-14T18:00:00.000Z',
      text: 'That makes it easy to swap in a Fab or an IconButton from MUI.',
    }),
  ],
};
