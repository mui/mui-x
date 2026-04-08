import type { ChatConversation, ChatMessage, ChatUser } from '@mui/x-chat-headless';

function createAvatarDataUrl(label: string, background: string, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const demoUsers = {
  you: {
    id: 'you',
    displayName: 'You',
    avatarUrl: createAvatarDataUrl('Y', '#111111'),
    isOnline: true,
  } satisfies ChatUser,
  alice: {
    id: 'alice',
    displayName: 'Alice Chen',
    avatarUrl: createAvatarDataUrl('A', '#111111'),
    isOnline: true,
  } satisfies ChatUser,
  marco: {
    id: 'marco',
    displayName: 'Marco Diaz',
    avatarUrl: createAvatarDataUrl('M', '#111111'),
    isOnline: false,
  } satisfies ChatUser,
  priya: {
    id: 'priya',
    displayName: 'Priya Singh',
    avatarUrl: createAvatarDataUrl('P', '#111111'),
    isOnline: true,
  } satisfies ChatUser,
  agent: {
    id: 'agent',
    displayName: 'MUI Guide',
    avatarUrl: createAvatarDataUrl('G', '#111111'),
    isOnline: true,
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
    parts: [{ type: 'text', text }],
  } satisfies ChatMessage;
}

export const minimalConversation: ChatConversation = {
  id: 'starter',
  title: 'Starter thread',
  subtitle: 'Smallest complete shell',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T09:04:00.000Z',
};

export const minimalMessages: ChatMessage[] = [
  createTextMessage({
    id: 'starter-a1',
    conversationId: 'starter',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:02:00.000Z',
    text: 'This shell is intentionally small so the primitive boundaries stay obvious.',
  }),
  createTextMessage({
    id: 'starter-u1',
    conversationId: 'starter',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:04:00.000Z',
    text: 'Show me the smallest headless chat surface.',
  }),
];

export const inboxConversations: ChatConversation[] = [
  {
    id: 'triage',
    title: 'Support triage',
    subtitle: 'Customer is blocked on deployment',
    participants: [demoUsers.alice, demoUsers.agent],
    unreadCount: 2,
    readState: 'unread',
    lastMessageAt: '2026-03-15T09:18:00.000Z',
  },
  {
    id: 'design',
    title: 'Design review',
    subtitle: 'Header spacing and slot strategy',
    participants: [demoUsers.marco, demoUsers.agent],
    unreadCount: 0,
    readState: 'read',
    lastMessageAt: '2026-03-15T08:52:00.000Z',
  },
  {
    id: 'ops',
    title: 'Ops handoff',
    subtitle: 'History loading and unread boundaries',
    participants: [demoUsers.priya, demoUsers.agent],
    unreadCount: 0,
    readState: 'read',
    lastMessageAt: '2026-03-14T17:31:00.000Z',
  },
];

export const inboxThreads: Record<string, ChatMessage[]> = {
  triage: [
    createTextMessage({
      id: 'triage-a1',
      conversationId: 'triage',
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-15T09:05:00.000Z',
      text: 'I checked the latest build. The deploy completed, but the customer token expired.',
    }),
    createTextMessage({
      id: 'triage-u1',
      conversationId: 'triage',
      role: 'user',
      author: demoUsers.you,
      createdAt: '2026-03-15T09:09:00.000Z',
      text: 'Can we reset the token and send a clear recovery step?',
    }),
    createTextMessage({
      id: 'triage-a2',
      conversationId: 'triage',
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-15T09:14:00.000Z',
      text: 'Yes. I drafted a reset note and a one-click reauthentication path.',
    }),
    createTextMessage({
      id: 'triage-a3',
      conversationId: 'triage',
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-15T09:18:00.000Z',
      text: 'I also marked the thread as high priority because onboarding is blocked.',
    }),
  ],
  design: [
    createTextMessage({
      id: 'design-u1',
      conversationId: 'design',
      role: 'user',
      author: demoUsers.you,
      createdAt: '2026-03-15T08:34:00.000Z',
      text: 'Should we keep the default thread header or replace the title slot?',
    }),
    createTextMessage({
      id: 'design-a1',
      conversationId: 'design',
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-15T08:40:00.000Z',
      text: 'Keep the structure. Replace the title and actions slots so the behavior stays intact.',
    }),
    createTextMessage({
      id: 'design-m1',
      conversationId: 'design',
      role: 'user',
      author: demoUsers.marco,
      createdAt: '2026-03-15T08:52:00.000Z',
      text: 'That also keeps focus restoration predictable when the active thread changes.',
    }),
  ],
  ops: [
    createTextMessage({
      id: 'ops-a1',
      conversationId: 'ops',
      role: 'user',
      author: demoUsers.priya,
      createdAt: '2026-03-14T17:12:00.000Z',
      text: 'The overnight backlog crossed 600 messages. Virtualization should be the default here.',
    }),
    createTextMessage({
      id: 'ops-u1',
      conversationId: 'ops',
      role: 'user',
      author: demoUsers.you,
      createdAt: '2026-03-14T17:17:00.000Z',
      text: 'Agreed. We should also make the scroll-to-bottom affordance obvious.',
    }),
    createTextMessage({
      id: 'ops-a2',
      conversationId: 'ops',
      role: 'user',
      author: demoUsers.priya,
      createdAt: '2026-03-14T17:31:00.000Z',
      text: 'I will prepare a thread recipe that focuses only on history loading and unseen state.',
    }),
  ],
};

export const groupedTimelineMessages: ChatMessage[] = [
  createTextMessage({
    id: 'timeline-a1',
    conversationId: 'timeline',
    role: 'user',
    author: demoUsers.alice,
    createdAt: '2026-03-15T09:00:00.000Z',
    text: 'I reviewed the incident summary and grouped the first remediation steps.',
  }),
  createTextMessage({
    id: 'timeline-a2',
    conversationId: 'timeline',
    role: 'user',
    author: demoUsers.alice,
    createdAt: '2026-03-15T09:03:00.000Z',
    text: 'The access token mismatch explains the initial deployment confusion.',
  }),
  createTextMessage({
    id: 'timeline-a3',
    conversationId: 'timeline',
    role: 'user',
    author: demoUsers.alice,
    createdAt: '2026-03-15T09:12:00.000Z',
    text: 'Nine minutes later, the customer confirmed the reset worked.',
  }),
  createTextMessage({
    id: 'timeline-u1',
    conversationId: 'timeline',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:15:00.000Z',
    text: 'Let us fold that into the public timeline so support can reuse the steps.',
  }),
  createTextMessage({
    id: 'timeline-u2',
    conversationId: 'timeline',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:18:00.000Z',
    text: 'Also add a note about why we keep message grouping separate from the data model.',
  }),
  createTextMessage({
    id: 'timeline-a4',
    conversationId: 'timeline',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:25:00.000Z',
    text: 'Done. The grouping window is now a local presentation choice inside the recipe.',
  }),
];

export const partRenderingMessages: ChatMessage[] = [
  createTextMessage({
    id: 'parts-u1',
    conversationId: 'parts',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:02:00.000Z',
    text: 'Summarize the rollout and keep the supporting evidence visible.',
  }),
  {
    id: 'parts-a1',
    conversationId: 'parts',
    role: 'assistant',
    author: demoUsers.agent,
    status: 'sent',
    createdAt: '2026-03-15T10:05:00.000Z',
    parts: [
      {
        type: 'reasoning',
        text: 'I should keep the explanation compact, then surface the source and the numeric summary separately.',
      },
      {
        type: 'text',
        text: 'The rollout is safe to continue. Only the conversation switching edge cases needed extra validation.',
      },
      {
        type: 'source-url',
        sourceId: 'parts-source-1',
        url: 'https://mui.com/x/react-chat/headless/messages/',
        title: 'Messages API reference',
      },
      {
        type: 'data-summary' as const,
        id: 'parts-summary-1',
        data: {
          citations: 0,
          files: 1,
          confidence: 'high',
        },
      } as any,
    ],
  },
];

export function createLongThreadMessages(conversationId = 'long-thread') {
  const authors = [demoUsers.agent, demoUsers.you, demoUsers.alice, demoUsers.you];
  const seeds = [
    'Reviewed the latest support transcript and normalized the key states.',
    'Queued the oldest messages for prepend pagination.',
    'Confirmed the unread marker still lands at the right boundary.',
    'Added one more note so the scroll affordance becomes visible while scrolled away.',
  ];

  return Array.from({ length: 36 }, (_, index) => {
    const author = authors[index % authors.length];
    const role = author.id === 'you' ? 'user' : 'assistant';
    const dayOffset = Math.floor(index / 9);
    const minuteOffset = (index % 9) * 11;
    const timestamp = new Date(Date.UTC(2026, 2, 11 + dayOffset, 8, minuteOffset));

    return createTextMessage({
      id: `${conversationId}-m${index + 1}`,
      conversationId,
      role,
      author,
      createdAt: timestamp.toISOString(),
      text: `${seeds[index % seeds.length]} Item ${index + 1}.`,
    });
  });
}
