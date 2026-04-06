'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';

import {
  createChunkStream,
  randomId,
  splitText,
  syncConversationPreview,
} from 'docsx/data/chat/material/examples/shared/demoUtils';

// ── Avatar helper ─────────────────────────────────────────────────────────────

function createAvatarDataUrl(label, background, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ── Users ─────────────────────────────────────────────────────────────────────

const agentUser = {
  id: 'claude',
  displayName: 'Claude',
  avatarUrl: createAvatarDataUrl('C', '#d97757'),
  isOnline: true,
};

const youUser = {
  id: 'you',
  displayName: 'You',
  avatarUrl: createAvatarDataUrl('Y', '#1976d2'),
  isOnline: true,
};

// ── Message factories ─────────────────────────────────────────────────────────

function makeUserMessage(id, conversationId, text, createdAt) {
  return {
    id,
    conversationId,
    role: 'user',
    status: 'sent',
    createdAt,
    author: youUser,
    parts: [{ type: 'text', text }],
  };
}

function makeAssistantMessage(
  id,
  conversationId,
  createdAt,
  parts,
  status = 'sent',
) {
  return {
    id,
    conversationId,
    role: 'assistant',
    status,
    createdAt,
    author: agentUser,
    parts,
  };
}

// ── Conversation IDs ──────────────────────────────────────────────────────────

const fixTestsId = randomId();
const addFeatureId = randomId();
const dangerousCmdId = randomId();

// ── Pre-populated conversations ───────────────────────────────────────────────

const initialConversations = [
  {
    id: fixTestsId,
    title: 'Fix test failures',
    subtitle: 'pnpm test: 3 failing',
    participants: [youUser, agentUser],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-21T09:30:00.000Z',
  },
  {
    id: addFeatureId,
    title: 'Add dark mode toggle',
    subtitle: 'New component created',
    participants: [youUser, agentUser],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-21T08:15:00.000Z',
  },
  {
    id: dangerousCmdId,
    title: 'Clean build artifacts',
    subtitle: 'Awaiting your approval…',
    participants: [youUser, agentUser],
    readState: 'unread',
    unreadCount: 1,
    lastMessageAt: '2026-03-21T10:05:00.000Z',
  },
];

// ── Pre-populated threads ─────────────────────────────────────────────────────

const initialThreads = {
  [fixTestsId]: [
    makeUserMessage(
      randomId(),
      fixTestsId,
      'The unit tests are failing after the recent refactor. Can you fix them?',
      '2026-03-21T09:20:00.000Z',
    ),
    makeAssistantMessage(randomId(), fixTestsId, '2026-03-21T09:21:00.000Z', [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: 'I need to locate the failing test files and trace which imports changed during the refactor. The error is most likely a path issue — components were probably moved to a subdirectory.',
        state: 'done',
      },
      {
        type: 'text',
        text: "I'll start by locating all test files in the project.",
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'glob',
          state: 'output-available',
          input: { pattern: 'src/**/*.test.ts' },
          output: {
            files: ['src/Button.test.ts', 'src/Input.test.ts', 'src/Form.test.ts'],
          },
        },
      },
      {
        type: 'text',
        text: 'Found 3 test files. Reading the one with the broken imports…',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'read_file',
          state: 'output-available',
          input: { path: 'src/Button.test.ts' },
          output: {
            content:
              "import { Button } from './Button';\nimport { render } from '@testing-library/react';\n\ntest('renders', () => render(<Button>Click</Button>));",
          },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'edit_file',
          state: 'output-available',
          input: {
            path: 'src/Button.test.ts',
            old_str: "import { Button } from './Button'",
            new_str: "import { Button } from '../components/Button'",
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
          input: { command: 'pnpm test --run' },
          output: {
            stdout:
              '✓ Button.test.ts (3)\n✓ Input.test.ts (5)\n✓ Form.test.ts (2)\n\nAll tests passed.',
            exit_code: 0,
          },
        },
      },
      {
        type: 'text',
        text: 'All 3 test files are now passing. The import path was wrong after the refactor — components moved from `src/` to `src/components/`.',
        state: 'done',
      },
    ]),
  ],
  [addFeatureId]: [
    makeUserMessage(
      randomId(),
      addFeatureId,
      'Add a dark mode toggle button to the header',
      '2026-03-21T08:00:00.000Z',
    ),
    makeAssistantMessage(randomId(), addFeatureId, '2026-03-21T08:01:00.000Z', [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: "I should read the existing Header component before adding anything, so I can see how it's structured and where to place the toggle.",
        state: 'done',
      },
      {
        type: 'text',
        text: 'Let me read the Header component first.',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'read_file',
          state: 'output-available',
          input: { path: 'src/components/Header.tsx' },
          output: {
            content:
              "import AppBar from '@mui/material/AppBar';\nimport Toolbar from '@mui/material/Toolbar';\nimport Typography from '@mui/material/Typography';\n\nexport function Header() {\n  return (\n    <AppBar position=\"static\">\n      <Toolbar>\n        <Typography variant=\"h6\">My App</Typography>\n      </Toolbar>\n    </AppBar>\n  );\n}",
          },
        },
      },
      {
        type: 'text',
        text: "Now I'll create the DarkModeToggle component.",
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'write_file',
          state: 'output-available',
          input: {
            path: 'src/components/DarkModeToggle.tsx',
            content:
              "import * as React from 'react';\nimport IconButton from '@mui/material/IconButton';\n\nexport function DarkModeToggle({ mode, onToggle }: { mode: 'light' | 'dark'; onToggle(): void }) {\n  return (\n    <IconButton color=\"inherit\" onClick={onToggle} aria-label=\"toggle dark mode\">\n      {mode === 'dark' ? '☀️' : '🌙'}\n    </IconButton>\n  );\n}",
          },
          output: { written: true, bytes: 612 },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'bash',
          state: 'output-available',
          input: { command: 'pnpm build' },
          output: {
            stdout: 'Build successful. 3 modules compiled in 1.2s.',
            exit_code: 0,
          },
        },
      },
      {
        type: 'text',
        text: '`DarkModeToggle.tsx` is created and the build passes. Import it in `Header.tsx` and pass `mode` + `onToggle` from your theme context.',
        state: 'done',
      },
    ]),
  ],
  [dangerousCmdId]: [
    makeUserMessage(
      randomId(),
      dangerousCmdId,
      'Clean up all build artifacts and reset to a clean state',
      '2026-03-21T10:00:00.000Z',
    ),
    makeAssistantMessage(
      randomId(),
      dangerousCmdId,
      '2026-03-21T10:01:00.000Z',
      [
        { type: 'step-start' },
        {
          type: 'text',
          text: "I'll run a cleanup command. This will permanently delete build output and untracked files — please confirm before I proceed.",
          state: 'done',
        },
        {
          type: 'dynamic-tool',
          toolInvocation: {
            toolCallId: randomId(),
            toolName: 'bash',
            state: 'approval-requested',
            input: { command: 'rm -rf ./dist ./coverage && git clean -fd' },
          },
        },
      ],
      'sent',
    ),
  ],
};

// ── Scripted chunk builder ────────────────────────────────────────────────────

function pushText(chunks, id, text) {
  chunks.push({ type: 'text-start', id });
  for (const delta of splitText(text)) {
    chunks.push({ type: 'text-delta', id, delta });
  }
  chunks.push({ type: 'text-end', id });
}

function pushReasoning(chunks, id, text) {
  chunks.push({ type: 'reasoning-start', id });
  for (const delta of splitText(text)) {
    chunks.push({ type: 'reasoning-delta', id, delta });
  }
  chunks.push({ type: 'reasoning-end', id });
}

function pushTool(chunks, toolCallId, toolName, input, output) {
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

function createAgenticChunks(messageId) {
  const chunks = [];
  chunks.push({ type: 'start', messageId, author: agentUser });
  pushReasoning(
    chunks,
    `${messageId}-r`,
    "Let me explore the repository to understand the codebase. I'll locate the relevant files, read them, apply the fix, and verify with tests.",
  );
  pushText(
    chunks,
    `${messageId}-t1`,
    "I'll start by finding the relevant source files.",
  );
  chunks.push({ type: 'start-step' });
  pushTool(
    chunks,
    `${messageId}-glob`,
    'glob',
    { pattern: 'src/**/*.ts' },
    {
      files: ['src/api.ts', 'src/utils.ts', 'src/types.ts'],
    },
  );
  pushText(chunks, `${messageId}-t2`, 'Found the files. Reading the main module…');
  pushTool(
    chunks,
    `${messageId}-read`,
    'read_file',
    { path: 'src/api.ts' },
    {
      content:
        // eslint-disable-next-line no-template-curly-in-string
        'import axios from "axios";\nconst BASE = "http://localhost";\nexport async function fetchUser(id: string) {\n  return axios.get(`${BASE}/users/${id}`);\n}',
    },
  );
  pushText(chunks, `${messageId}-t3`, 'I can see the issue. Applying the fix now…');
  pushTool(
    chunks,
    `${messageId}-edit`,
    'edit_file',
    {
      path: 'src/api.ts',
      old_str: 'const BASE = "http://localhost"',
      new_str: 'const BASE = process.env.API_URL ?? "http://localhost"',
    },
    { patched: true },
  );
  pushTool(
    chunks,
    `${messageId}-bash`,
    'bash',
    { command: 'pnpm test --run' },
    {
      stdout: '✓ All tests passed (12 tests)',
      exit_code: 0,
    },
  );
  pushText(
    chunks,
    `${messageId}-t4`,
    'All done. The fix is applied and tests are passing.',
  );
  chunks.push({ type: 'finish', messageId, finishReason: 'stop' });
  return chunks;
}

// ── Tool accent palette ───────────────────────────────────────────────────────

const ACCENTS = {
  glob: {
    light: '#ede7f6',
    mid: '#b39ddb',
    border: '#7e57c2',
    text: '#4527a0',
    vivid: '#7e57c2',
  },
  read_file: {
    light: '#e1f5fe',
    mid: '#81d4fa',
    border: '#0288d1',
    text: '#01579b',
    vivid: '#0288d1',
  },
  edit_file: {
    light: '#fff8e1',
    mid: '#ffcc80',
    border: '#f57c00',
    text: '#e65100',
    vivid: '#f57c00',
  },
  write_file: {
    light: '#e8f5e9',
    mid: '#a5d6a7',
    border: '#388e3c',
    text: '#1b5e20',
    vivid: '#388e3c',
  },
  bash: {
    light: '#fce4ec',
    mid: '#f48fb1',
    border: '#c62828',
    text: '#b71c1c',
    vivid: '#c62828',
  },
};

// ── Variation builder helpers ─────────────────────────────────────────────────

function makeColorfulSlots() {
  return Object.fromEntries(
    Object.entries(ACCENTS).map(([name, c]) => [
      name,
      {
        root: {
          style: {
            borderLeftColor: c.border,
            borderLeftWidth: 3,
          },
        },
        header: {
          style: {
            background: `linear-gradient(135deg, ${c.light} 0%, ${c.mid}44 100%)`,
            borderBottom: `1px solid ${c.border}33`,
          },
        },
        title: {
          style: { color: c.text, fontWeight: 600 },
        },
        icon: {
          style: {
            background: c.border,
            color: '#fff',
            borderRadius: '50%',
            fontSize: '0.55rem',
          },
        },
        state: {
          style: {
            background: `${c.border}18`,
            color: c.text,
            border: `1px solid ${c.border}44`,
          },
        },
      },
    ]),
  );
}

// ── Per-tool slot props (Colorful theme) ─────────────────────────────────────

const colorfulToolSlotProps = makeColorfulSlots();

// ── Component ─────────────────────────────────────────────────────────────────

export default function ToolStylingB() {
  const setThreadsRef = React.useRef(null);

  const adapter = React.useMemo(
    () => ({
      async sendMessage() {
        return createChunkStream(createAgenticChunks(randomId()), { delayMs: 120 });
      },
      async addToolApprovalResponse({ id, approved }) {
        setThreadsRef.current?.((prev) => {
          const next = {};
          for (const convId of Object.keys(prev)) {
            next[convId] = prev[convId].map((msg) => ({
              ...msg,
              parts: msg.parts.map((part) => {
                if (
                  part.type === 'dynamic-tool' &&
                  part.toolInvocation.toolCallId === id
                ) {
                  return {
                    ...part,
                    toolInvocation: approved
                      ? {
                          ...part.toolInvocation,
                          state: 'output-available',
                          output: {
                            done: true,
                            message: 'Artifacts deleted successfully.',
                          },
                          approval: { approved: true },
                        }
                      : {
                          ...part.toolInvocation,
                          state: 'output-denied',
                          approval: {
                            approved: false,
                            reason: 'User denied the operation.',
                          },
                        },
                  };
                }
                return part;
              }),
            }));
          }
          return next;
        });
      },
    }),
    [],
  );

  const [activeId, setActiveId] = React.useState(() => initialConversations[0].id);
  const [conversations, setConversations] = React.useState(() =>
    initialConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState(() =>
    Object.fromEntries(
      Object.entries(initialThreads).map(([id, msgs]) => [
        id,
        msgs.map((m) => ({ ...m })),
      ]),
    ),
  );

  setThreadsRef.current = setThreads;

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
      slotProps={{
        messageContent: {
          partProps: {
            'dynamic-tool': {
              toolSlotProps: colorfulToolSlotProps,
            },
          },
        },
      }}
      sx={{
        height: 620,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
