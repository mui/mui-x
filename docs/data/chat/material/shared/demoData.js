function createAvatarDataUrl(label, background, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="${foreground}">${label}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const demoUsers = {
  you: {
    id: 'you',
    displayName: 'You',
    avatarUrl: createAvatarDataUrl('Y', '#0b4f8a'),
    isOnline: true,
  },
  alice: {
    id: 'alice',
    displayName: 'Alice Chen',
    avatarUrl: createAvatarDataUrl('A', '#2563eb'),
    isOnline: true,
  },
  marco: {
    id: 'marco',
    displayName: 'Marco Diaz',
    avatarUrl: createAvatarDataUrl('M', '#0f766e'),
    isOnline: false,
  },
  priya: {
    id: 'priya',
    displayName: 'Priya Singh',
    avatarUrl: createAvatarDataUrl('P', '#b45309'),
    isOnline: true,
  },
  agent: {
    id: 'agent',
    displayName: 'MUI Guide',
    avatarUrl: createAvatarDataUrl('G', '#4338ca'),
    isOnline: true,
  },
};

export function createTextMessage(params) {
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
  };
}

export const inboxConversations = [
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

export const inboxThreads = {
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
      role: 'assistant',
      author: demoUsers.marco,
      createdAt: '2026-03-15T08:52:00.000Z',
      text: 'That also keeps focus restoration predictable when the active thread changes.',
    }),
  ],
  ops: [
    createTextMessage({
      id: 'ops-a1',
      conversationId: 'ops',
      role: 'assistant',
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
      role: 'assistant',
      author: demoUsers.priya,
      createdAt: '2026-03-14T17:31:00.000Z',
      text: 'I will prepare a thread recipe that focuses only on history loading and unseen state.',
    }),
  ],
};

export const markdownMessages = [
  createTextMessage({
    id: 'md-u1',
    role: 'user',
    createdAt: '2026-03-17T10:00:00.000Z',
    text: 'Show me an example of markdown rendering with code blocks.',
  }),
  {
    id: 'md-a1',
    role: 'assistant',
    author: demoUsers.agent,
    status: 'sent',
    createdAt: '2026-03-17T10:01:00.000Z',
    parts: [
      {
        type: 'text',
        text: "Here's a quick example:\n\n## Streaming setup\n\nThe adapter returns a `ReadableStream` that the runtime consumes chunk by chunk.\n\n```tsx\nconst adapter: ChatAdapter = {\n  async sendMessage({ message }) {\n    return new ReadableStream({\n      start(controller) {\n        controller.enqueue({ type: 'text-delta', delta: 'Hello' });\n        controller.close();\n      },\n    });\n  },\n};\n```\n\nKey points:\n- Each chunk is a `ChatMessageChunk`\n- The `text-delta` type appends text incrementally\n- Call `controller.close()` when the stream finishes",
      },
    ],
  },
];

export const aiPartMessages = [
  createTextMessage({
    id: 'ai-u1',
    role: 'user',
    createdAt: '2026-03-17T10:10:00.000Z',
    text: 'Analyze the deployment status and show your reasoning.',
  }),
  {
    id: 'ai-a1',
    role: 'assistant',
    author: demoUsers.agent,
    status: 'sent',
    createdAt: '2026-03-17T10:11:00.000Z',
    parts: [
      {
        type: 'reasoning',
        text: 'The user asked about deployment status. I should check the CI pipeline results and the staging environment health. Let me structure this as a clear summary with supporting sources.',
      },
      {
        type: 'text',
        text: 'The deployment completed successfully. All 47 integration tests passed on staging, and the health check endpoint is returning 200.',
      },
      {
        type: 'tool',
        toolInvocation: {
          toolCallId: 'tool-1',
          toolName: 'checkDeployStatus',
          state: 'result',
          args: { environment: 'staging' },
          result: {
            status: 'healthy',
            version: '2.4.1',
            uptime: '3h 12m',
          },
        },
      },
      {
        type: 'source-url',
        sourceId: 'src-1',
        url: 'https://ci.example.com/builds/4821',
        title: 'CI Build #4821 — All checks passed',
      },
    ],
  },
];
