import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
} from '@mui/x-chat/headless';

export const users = {
  me: {
    id: 'you',
    displayName: 'You',
    role: 'user' as const,
  },
  assistant: {
    id: 'assistant',
    displayName: 'MUI Assistant',
    role: 'assistant' as const,
    avatarUrl: 'https://mui.com/static/logo.png',
  },
  alice: {
    id: 'alice',
    displayName: 'Alice Chen',
    role: 'user' as const,
    isOnline: true,
  },
  mira: {
    id: 'mira',
    displayName: 'Mira Patel',
    role: 'user' as const,
    isOnline: true,
  },
  sam: {
    id: 'sam',
    displayName: 'Sam Rivera',
    role: 'user' as const,
    isOnline: true,
  },
  nora: {
    id: 'nora',
    displayName: 'Nora Okafor',
    role: 'user' as const,
  },
  diego: {
    id: 'diego',
    displayName: 'Diego Morales',
    role: 'user' as const,
  },
  maya: {
    id: 'maya',
    displayName: 'Maya Brooks',
    role: 'user' as const,
    isOnline: true,
  },
  customerLena: {
    id: 'customer-lena',
    displayName: 'Lena Ortiz',
    role: 'user' as const,
    isOnline: true,
  },
  supportBot: {
    id: 'support-bot',
    displayName: 'Helpdesk AI',
    role: 'assistant' as const,
    avatarUrl: 'https://mui.com/static/logo.png',
    isOnline: true,
  },
  ragAssistant: {
    id: 'rag-agent',
    displayName: 'Atlas Research Agent',
    role: 'assistant' as const,
    avatarUrl: 'https://mui.com/static/logo.png',
    isOnline: true,
  },
  opsBot: {
    id: 'ops-bot',
    displayName: 'Ops Bot',
    role: 'assistant' as const,
    avatarUrl: 'https://mui.com/static/logo.png',
  },
};

export type DemoUser = (typeof users)[keyof typeof users];

export const demoMembers: DemoUser[] = Object.values(users);

export const conversations: ChatConversation[] = [
  {
    id: 'styling-questions',
    title: 'Styling questions',
    subtitle: 'How do I theme MuiChatComposer?',
    participants: [users.me, users.assistant],
    readState: 'unread',
    unreadCount: 3,
    lastMessageAt: '2026-05-03T09:30:00.000Z',
  },
  {
    id: 'sources-demo',
    title: 'RAG demo',
    subtitle: 'With ChatMessageSources rendering',
    participants: [users.me, users.assistant],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-05-02T14:02:00.000Z',
  },
  {
    id: 'code-review',
    title: 'Code review',
    subtitle: 'Discussing the codeblock slot',
    participants: [users.me, users.assistant],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-05-01T11:15:00.000Z',
  },
];

export const initialThreads: Record<string, ChatMessage[]> = {
  'styling-questions': [
    {
      id: 'sq-1',
      conversationId: 'styling-questions',
      role: 'user',
      author: users.me,
      createdAt: '2026-05-03T09:25:00.000Z',
      status: 'read',
      parts: [
        {
          type: 'text',
          text: 'How do the **default** styles for `<ChatComposer />` look in light vs dark mode?',
        },
      ],
    },
    {
      id: 'sq-2',
      conversationId: 'styling-questions',
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-05-03T09:26:00.000Z',
      status: 'read',
      parts: [
        {
          type: 'text',
          text: `The composer pulls from the active MUI theme:

- \`palette.background.paper\` for its surface
- \`palette.divider\` for the border
- \`palette.primary.main\` for the focused ring & send button
- \`shape.borderRadius\` for corners
- \`transitions.create\` for the focus animation

Try the toggles up top — the theme drives everything.`,
        },
      ],
    },
    {
      id: 'sq-3',
      conversationId: 'styling-questions',
      role: 'user',
      author: users.me,
      createdAt: '2026-05-03T09:28:00.000Z',
      status: 'sent',
      parts: [{ type: 'text', text: 'Cool — and how do `variant="compact"` bubbles look here?' }],
    },
  ],
  'sources-demo': [
    {
      id: 'rag-1',
      conversationId: 'sources-demo',
      role: 'user',
      author: users.me,
      createdAt: '2026-05-02T14:00:00.000Z',
      status: 'read',
      parts: [{ type: 'text', text: 'Summarize the MUI X Chat package and link the docs.' }],
    },
    {
      id: 'rag-2',
      conversationId: 'sources-demo',
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-05-02T14:02:00.000Z',
      status: 'read',
      parts: [
        {
          type: 'text',
          text: '`@mui/x-chat` ships ready-to-use chat surfaces — `ChatBox`, message list, composer, suggestions, sources — all themable through the standard MUI theme.',
        },
      ],
    },
  ],
  'code-review': [
    {
      id: 'cr-1',
      conversationId: 'code-review',
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-05-01T11:10:00.000Z',
      status: 'read',
      parts: [
        {
          type: 'text',
          text: `Here's an example showing how the markdown code fences render with the default \`ChatCodeBlock\`:

\`\`\`tsx
import { ChatBox } from '@mui/x-chat';

export function MyChat() {
  return <ChatBox adapter={adapter} />;
}
\`\`\`

The block uses \`palette.divider\` borders and the \`action.hover\` background by default.`,
        },
      ],
    },
  ],
};

let randomIdCounter = 0;
export function randomId(prefix: string) {
  randomIdCounter += 1;
  return `${prefix}-${randomIdCounter.toString(36)}`;
}

function splitText(text: string, size = 18) {
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }
  return chunks;
}

function createStream(messageId: string, text: string) {
  const chunks: ChatMessageChunk[] = [
    { type: 'start', messageId, author: users.assistant },
    { type: 'text-start', id: `${messageId}-text` },
    ...splitText(text).map((delta) => ({
      type: 'text-delta' as const,
      id: `${messageId}-text`,
      delta,
    })),
    { type: 'text-end', id: `${messageId}-text` },
    { type: 'finish', messageId, finishReason: 'stop' },
  ];

  const timers: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;

  return new ReadableStream<ChatMessageChunk>({
    start(controller) {
      chunks.forEach((chunk, index) => {
        timers.push(
          setTimeout(
            () => {
              // The consumer can cancel mid-stream (unmount, or a new prompt
              // before this echo finishes); don't enqueue on a closed controller.
              if (cancelled) {
                return;
              }
              controller.enqueue(chunk);
              if (index === chunks.length - 1) {
                controller.close();
              }
            },
            90 * (index + 1),
          ),
        );
      });
    },
    cancel() {
      cancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
    },
  });
}

export function makeAdapter(threadMap: Record<string, ChatMessage[]>): ChatAdapter {
  return {
    async listMessages({ conversationId }) {
      return {
        messages: threadMap[conversationId] ?? [],
        hasMore: false,
      };
    },
    async sendMessage({ message }) {
      const input = message.parts
        .map((part) => (part.type === 'text' ? part.text : ''))
        .join(' ')
        .trim();

      return createStream(
        randomId('reply'),
        input.length === 0
          ? 'Try typing something — this demo just echoes your prompt back.'
          : `You said: "${input}". The defaults adjust automatically when you flip the theme controls above.`,
      );
    },
  };
}

export const sampleSuggestions = [
  'Show me the default ChatComposer',
  'How do I style ChatMessage bubbles?',
  'Render code blocks with syntax highlighting',
  'Wire up RAG sources',
];

export const sampleCode = `// Theme x-chat with MUI's components.MuiChat... slots.
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiChatComposer: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          boxShadow: theme.shadows[1],
        }),
      },
    },
  },
});`;
