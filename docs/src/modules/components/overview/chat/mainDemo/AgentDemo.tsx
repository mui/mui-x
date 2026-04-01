'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
  ChatMessagePart,
} from '@mui/x-chat/headless';
import {
  createChunkStream,
  randomId,
  splitText,
  syncConversationPreview,
} from '../../../../../../data/chat/material/examples/shared/demoUtils';
import { demoUsers } from '../../../../../../data/chat/material/examples/shared/demoData';

// --- Message factories -------------------------------------------------------

function makeUserMessage(
  conversationId: string,
  text: string,
  createdAt: string,
): ChatMessage {
  return {
    id: randomId(),
    conversationId,
    role: 'user',
    status: 'sent',
    createdAt,
    author: demoUsers.you,
    parts: [{ type: 'text', text }],
  };
}

function makeAssistantMessage(
  conversationId: string,
  createdAt: string,
  parts: ChatMessagePart[],
): ChatMessage {
  return {
    id: randomId(),
    conversationId,
    role: 'assistant',
    status: 'sent',
    createdAt,
    author: demoUsers.agent,
    parts,
  };
}

// --- Conversation IDs — generated once at module load ------------------------

const codeReviewId = randomId();
const webResearchId = randomId();
const themeUpdateId = randomId();

// --- Pre-populated conversations ---------------------------------------------

const initialConversations: ChatConversation[] = [
  {
    id: codeReviewId,
    title: 'Code review',
    subtitle: 'The project structure looks clean…',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-31T09:30:00.000Z',
  },
  {
    id: webResearchId,
    title: 'Web research',
    subtitle: 'Here is a summary of React 19…',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'unread',
    unreadCount: 1,
    lastMessageAt: '2026-03-31T10:15:00.000Z',
  },
  {
    id: themeUpdateId,
    title: 'Update MUI theme',
    subtitle: 'Done — primary color updated to teal.',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-31T11:00:00.000Z',
  },
];

// --- Pre-populated threads ---------------------------------------------------

const initialThreads: Record<string, ChatMessage[]> = {
  // ── Code review ─────────────────────────────────────────────────────────
  [codeReviewId]: [
    makeUserMessage(
      codeReviewId,
      'Can you review the project structure and suggest improvements?',
      '2026-03-31T09:20:00.000Z',
    ),
    makeAssistantMessage(codeReviewId, '2026-03-31T09:21:00.000Z', [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: 'I need to explore the repository to understand how the project is organized. Let me start by finding the source files, then read the main entry point.',
        state: 'done',
      },
      {
        type: 'text',
        text: "I'll start by looking at the file structure.",
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'glob',
          state: 'output-available',
          input: { pattern: 'src/**/*' },
          output: {
            files: [
              'src/index.ts',
              'src/api.ts',
              'src/utils.ts',
              'src/types.ts',
              'src/components/Header.tsx',
              'src/components/Footer.tsx',
            ],
          },
        },
      },
      {
        type: 'text',
        text: 'Found 6 files. Let me read the main entry point.',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'read_file',
          state: 'output-available',
          input: { path: 'src/index.ts' },
          output: {
            content:
              "import { fetchUser } from './api';\nimport { formatDate } from './utils';\n\nexport async function main() {\n  const user = await fetchUser('1');\n  console.log(`Joined: ${formatDate(user.createdAt)}`);\n}",
          },
        },
      },
      {
        type: 'text',
        text: "The project structure looks clean. Here are a few suggestions:\n\n1. **Group by feature** — consider moving `api.ts` and `types.ts` into a `services/` folder.\n2. **Add barrel exports** — each directory could have an `index.ts` to simplify imports.\n3. **Separate concerns** — `utils.ts` could be split into `date.ts` and `string.ts` as it grows.",
        state: 'done',
      },
    ]),
  ],

  // ── Web research ────────────────────────────────────────────────────────
  [webResearchId]: [
    makeUserMessage(
      webResearchId,
      'What are the key new features in React 19? Summarize the official blog post.',
      '2026-03-31T10:00:00.000Z',
    ),
    makeAssistantMessage(webResearchId, '2026-03-31T10:02:00.000Z', [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: "The user wants a summary of React 19 features. Let me fetch the official React blog post and extract the key points.",
        state: 'done',
      },
      {
        type: 'text',
        text: "Let me fetch the official announcement.",
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'web_fetch',
          state: 'output-available',
          input: { url: 'https://react.dev/blog/2024/12/05/react-19' },
          output: {
            status: 200,
            title: 'React 19 — React Blog',
            excerpt:
              'React 19 is now stable! Here is a summary of the new features, improvements, and breaking changes included in this release.',
          },
        },
      },
      {
        type: 'text',
        text: "Good, I have the content. Let me also check for any community-curated migration guides.",
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'web_search',
          state: 'output-available',
          input: { query: 'React 19 migration guide best practices' },
          output: {
            results: [
              { title: 'React 19 Upgrade Guide', url: 'https://react.dev/blog/2024/04/25/react-19-upgrade-guide' },
              { title: 'Migrating to React 19 — practical tips', url: 'https://example.com/react-19-tips' },
            ],
          },
        },
      },
      {
        type: 'text',
        text: "Here is a summary of React 19's key features:\n\n" +
          '1. **Actions** — async functions in transitions that handle pending states, errors, and optimistic updates automatically.\n' +
          '2. **`useActionState`** — new hook for common action patterns, returns state + a submit function.\n' +
          '3. **`useOptimistic`** — show optimistic UI while an async action is in progress.\n' +
          '4. **`use` API** — read resources (promises, context) during render.\n' +
          '5. **Server Components** — components that run ahead of time, before bundling.\n' +
          '6. **Ref as a prop** — function components can now accept `ref` as a regular prop.\n' +
          '7. **Document metadata** — native support for `<title>`, `<meta>`, and `<link>` in components.\n\n' +
          'I also found an [upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) with practical migration tips.',
        state: 'done',
      },
    ]),
  ],

  // ── Update MUI theme ───────────────────────────────────────────────────
  [themeUpdateId]: [
    makeUserMessage(
      themeUpdateId,
      'Change the primary color in our MUI theme from blue to teal.',
      '2026-03-31T10:50:00.000Z',
    ),
    makeAssistantMessage(themeUpdateId, '2026-03-31T10:51:00.000Z', [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: "I need to find the theme configuration file, read the current primary color, and update it to teal. MUI's teal is available at '@mui/material/colors/teal'.",
        state: 'done',
      },
      {
        type: 'text',
        text: 'Let me find the theme file first.',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'glob',
          state: 'output-available',
          input: { pattern: 'src/**/theme*' },
          output: {
            files: ['src/theme.ts', 'src/theme.test.ts'],
          },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'read_file',
          state: 'output-available',
          input: { path: 'src/theme.ts' },
          output: {
            content:
              "import { createTheme } from '@mui/material/styles';\nimport { blue } from '@mui/material/colors';\n\nexport const theme = createTheme({\n  palette: {\n    primary: { main: blue[700] },\n  },\n});",
          },
        },
      },
      {
        type: 'text',
        text: 'Found it. The primary color is currently `blue[700]`. Updating to `teal[600]`.',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'edit_file',
          state: 'output-available',
          input: {
            path: 'src/theme.ts',
            old_str: "import { blue } from '@mui/material/colors';\n\nexport const theme = createTheme({\n  palette: {\n    primary: { main: blue[700] },",
            new_str: "import { teal } from '@mui/material/colors';\n\nexport const theme = createTheme({\n  palette: {\n    primary: { main: teal[600] },",
          },
          output: { patched: true },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'bash',
          state: 'output-available',
          input: { command: 'pnpm tsc --noEmit' },
          output: {
            stdout: 'No errors found.',
            exit_code: 0,
          },
        },
      },
      {
        type: 'text',
        text: "Done — primary color updated to teal. The TypeScript build passes with no errors. You'll see the change reflected across all components that use `theme.palette.primary`.",
        state: 'done',
      },
    ]),
  ],
};

// --- Scripted chunk builders -------------------------------------------------

function pushText(chunks: ChatMessageChunk[], id: string, text: string) {
  chunks.push({ type: 'text-start', id });
  for (const delta of splitText(text)) {
    chunks.push({ type: 'text-delta', id, delta });
  }
  chunks.push({ type: 'text-end', id });
}

function pushReasoning(chunks: ChatMessageChunk[], id: string, text: string) {
  chunks.push({ type: 'reasoning-start', id });
  for (const delta of splitText(text)) {
    chunks.push({ type: 'reasoning-delta', id, delta });
  }
  chunks.push({ type: 'reasoning-end', id });
}

function pushTool(
  chunks: ChatMessageChunk[],
  toolCallId: string,
  toolName: string,
  input: unknown,
  output: unknown,
) {
  chunks.push({ type: 'tool-input-start', toolCallId, toolName, dynamic: true });
  for (const delta of splitText(JSON.stringify(input))) {
    chunks.push({ type: 'tool-input-delta', toolCallId, inputTextDelta: delta });
  }
  chunks.push({
    type: 'tool-input-available',
    toolCallId,
    toolName,
    input,
    dynamic: true,
  });
  chunks.push({ type: 'tool-output-available', toolCallId, output });
}

// --- Scripted responses per conversation ------------------------------------

function createCodeReviewChunks(messageId: string): ChatMessageChunk[] {
  const chunks: ChatMessageChunk[] = [];

  chunks.push({ type: 'start', messageId, author: demoUsers.agent });

  pushReasoning(
    chunks,
    `${messageId}-r`,
    'The user sent a follow-up. Let me check the utility file to give a more specific recommendation about how to refactor it.',
  );

  chunks.push({ type: 'start-step' });

  pushText(chunks, `${messageId}-t1`, 'Let me take a closer look at the utilities file.');

  pushTool(chunks, `${messageId}-read`, 'read_file', { path: 'src/utils.ts' }, {
    content:
      'export function formatDate(d: Date) { return d.toLocaleDateString(); }\nexport function capitalize(s: string) { return s[0].toUpperCase() + s.slice(1); }\nexport function slugify(s: string) { return s.toLowerCase().replace(/\\s+/g, "-"); }',
  });

  pushText(chunks, `${messageId}-t2`, 'I can see mixed concerns. Let me check usage across files.');

  pushTool(chunks, `${messageId}-grep`, 'grep', { pattern: 'formatDate|capitalize|slugify', path: 'src/' }, {
    matches: [
      { file: 'src/index.ts', line: 2, text: "import { formatDate } from './utils'" },
      { file: 'src/components/Header.tsx', line: 5, text: "import { capitalize } from '../utils'" },
    ],
  });

  pushText(
    chunks,
    `${messageId}-t3`,
    "Here's my recommendation:\n\n" +
      '- Move `formatDate` → `src/utils/date.ts`\n' +
      '- Move `capitalize` and `slugify` → `src/utils/string.ts`\n' +
      '- Add `src/utils/index.ts` as a barrel export\n\n' +
      'This keeps imports clean while separating date and string helpers.',
  );

  chunks.push({ type: 'finish', messageId, finishReason: 'stop' });
  return chunks;
}

function createWebResearchChunks(messageId: string): ChatMessageChunk[] {
  const chunks: ChatMessageChunk[] = [];

  chunks.push({ type: 'start', messageId, author: demoUsers.agent });

  pushReasoning(
    chunks,
    `${messageId}-r`,
    'The user wants me to look something up on the web. Let me search for it and summarize the findings.',
  );

  chunks.push({ type: 'start-step' });

  pushText(chunks, `${messageId}-t1`, 'Searching the web for relevant information…');

  pushTool(chunks, `${messageId}-search`, 'web_search', { query: 'latest web development trends 2026' }, {
    results: [
      { title: 'Web Dev Trends 2026 — State of JS', url: 'https://stateofjs.com/2026' },
      { title: 'Frontend Predictions for 2026', url: 'https://example.com/frontend-2026' },
    ],
  });

  pushTool(chunks, `${messageId}-fetch`, 'web_fetch', { url: 'https://stateofjs.com/2026' }, {
    status: 200,
    title: 'State of JavaScript 2026',
    excerpt: 'Server components adoption grew 3x, signals are in every major framework, and AI-assisted coding reached 72% adoption among professional developers.',
  });

  pushText(
    chunks,
    `${messageId}-t2`,
    "Here's what I found:\n\n" +
      '1. **Server Components** — adoption grew 3× year-over-year, now supported across all major frameworks.\n' +
      '2. **Signals** — every major framework has adopted a signals-based reactivity model.\n' +
      '3. **AI-assisted development** — 72% of professional developers now use AI coding tools daily.\n\n' +
      'Would you like me to dig deeper into any of these topics?',
  );

  chunks.push({ type: 'finish', messageId, finishReason: 'stop' });
  return chunks;
}

function createThemeUpdateChunks(messageId: string): ChatMessageChunk[] {
  const chunks: ChatMessageChunk[] = [];

  chunks.push({ type: 'start', messageId, author: demoUsers.agent });

  pushReasoning(
    chunks,
    `${messageId}-r`,
    'The user wants another theme change. Let me read the current theme file and apply the update.',
  );

  chunks.push({ type: 'start-step' });

  pushText(chunks, `${messageId}-t1`, 'Reading the current theme configuration…');

  pushTool(chunks, `${messageId}-read`, 'read_file', { path: 'src/theme.ts' }, {
    content:
      "import { createTheme } from '@mui/material/styles';\nimport { teal } from '@mui/material/colors';\n\nexport const theme = createTheme({\n  palette: {\n    primary: { main: teal[600] },\n  },\n});",
  });

  pushText(chunks, `${messageId}-t2`, 'Applying the requested changes now…');

  pushTool(chunks, `${messageId}-edit`, 'edit_file', {
    path: 'src/theme.ts',
    old_str: "primary: { main: teal[600] },",
    new_str: "primary: { main: '#9c27b0' }, // Deep Purple",
  }, { patched: true });

  pushTool(chunks, `${messageId}-check`, 'bash', { command: 'pnpm tsc --noEmit' }, {
    stdout: 'No errors found.',
    exit_code: 0,
  });

  pushText(
    chunks,
    `${messageId}-t3`,
    'Updated and verified — the build passes. The new primary color will apply across all MUI components.',
  );

  chunks.push({ type: 'finish', messageId, finishReason: 'stop' });
  return chunks;
}

const chunkBuilders: Record<string, (messageId: string) => ChatMessageChunk[]> = {
  [codeReviewId]: createCodeReviewChunks,
  [webResearchId]: createWebResearchChunks,
  [themeUpdateId]: createThemeUpdateChunks,
};

// --- Component ---------------------------------------------------------------

export default function AgentDemo() {
  const [activeId, setActiveId] = React.useState(() => initialConversations[0].id);
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    initialConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(initialThreads).map(([id, msgs]) => [
        id,
        msgs.map((m) => ({ ...m })),
      ]),
    ),
  );

  const activeIdRef = React.useRef(activeId);
  activeIdRef.current = activeId;

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        const buildChunks = chunkBuilders[activeIdRef.current] ?? createCodeReviewChunks;
        return createChunkStream(buildChunks(randomId()), { delayMs: 120 });
      },
    }),
    [],
  );

  const messages = threads[activeId] ?? [];

  return (
    <ChatBox
      adapter={adapter}
      activeConversationId={activeId}
      conversations={conversations}
      messages={messages}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({ ...prev, [activeId]: nextMessages }));
        setConversations((prev) =>
          syncConversationPreview(prev, activeId, nextMessages),
        );
      }}
      sx={{ height: '100%' }}
      slotProps={{
        conversationList: {
          variant: 'compact'
        }
      }}
    />
  );
}
