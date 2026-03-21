'use client';
import * as React from 'react';
import { nanoid } from 'nanoid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';

import {
  createChunkStream,
  splitText,
  syncConversationPreview,
} from '../shared/demoUtils';

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

const fixTestsId = nanoid();
const addFeatureId = nanoid();
const dangerousCmdId = nanoid();

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
      nanoid(),
      fixTestsId,
      'The unit tests are failing after the recent refactor. Can you fix them?',
      '2026-03-21T09:20:00.000Z',
    ),
    makeAssistantMessage(nanoid(), fixTestsId, '2026-03-21T09:21:00.000Z', [
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
          toolCallId: nanoid(),
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
          toolCallId: nanoid(),
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
          toolCallId: nanoid(),
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
          toolCallId: nanoid(),
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
      nanoid(),
      addFeatureId,
      'Add a dark mode toggle button to the header',
      '2026-03-21T08:00:00.000Z',
    ),
    makeAssistantMessage(nanoid(), addFeatureId, '2026-03-21T08:01:00.000Z', [
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
          toolCallId: nanoid(),
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
          toolCallId: nanoid(),
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
          toolCallId: nanoid(),
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
      nanoid(),
      dangerousCmdId,
      'Clean up all build artifacts and reset to a clean state',
      '2026-03-21T10:00:00.000Z',
    ),
    makeAssistantMessage(
      nanoid(),
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
            toolCallId: nanoid(),
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

// ── Block theme variations ────────────────────────────────────────────────────

const TOOL_ACCENTS = {
  glob: { light: '#e8eaf6', mid: '#9fa8da', border: '#7986cb', text: '#3949ab' },
  read_file: {
    light: '#e1f5fe',
    mid: '#81d4fa',
    border: '#4fc3f7',
    text: '#0277bd',
  },
  edit_file: {
    light: '#fff3e0',
    mid: '#ffcc80',
    border: '#ffa726',
    text: '#e65100',
  },
  write_file: {
    light: '#e8f5e9',
    mid: '#a5d6a7',
    border: '#66bb6a',
    text: '#2e7d32',
  },
  bash: { light: '#fce4ec', mid: '#f48fb1', border: '#f06292', text: '#ad1457' },
};

const VARIATIONS = [
  // 1 — Subtle: no box, left border only
  {
    label: 'Subtle',
    description: 'No box, left border accent — minimal chrome',
    slotProps: {
      root: {
        style: {
          border: 'none',
          borderLeft: '2px solid #e0e0e0',
          borderRadius: 0,
          margin: '4px 0',
          overflow: 'visible',
        },
      },
      header: { style: { background: 'transparent', padding: '4px 10px' } },
      state: {
        style: {
          background: 'transparent',
          color: '#9e9e9e',
          fontSize: '0.58rem',
          padding: 0,
        },
      },
    },
  },
  // 2 — Dark: Catppuccin Mocha palette
  {
    label: 'Dark',
    description: 'Catppuccin Mocha palette — dark regardless of parent theme',
    slotProps: {
      root: {
        style: {
          background: '#1e1e2e',
          border: '1px solid #313244',
          borderRadius: 6,
        },
      },
      header: {
        style: { background: '#181825', borderBottom: '1px solid #313244' },
      },
      title: { style: { color: '#cdd6f4', fontFamily: 'monospace' } },
      state: { style: { background: '#313244', color: '#89b4fa', border: 'none' } },
      section: { style: { borderTop: '1px solid #313244' } },
      sectionContent: {
        style: {
          background: '#11111b',
          color: '#89dceb',
          border: '1px solid #313244',
        },
      },
      error: {
        style: {
          background: '#11111b',
          color: '#f38ba8',
          borderTop: '1px solid #313244',
        },
      },
    },
  },
  // 3 — Colorful: per-tool gradient headers via toolSlotProps
  {
    label: 'Colorful',
    description: 'Per-tool gradient header + colored title via toolSlotProps',
    toolSlotProps: Object.fromEntries(
      Object.entries(TOOL_ACCENTS).map(([name, c]) => [
        name,
        {
          header: {
            style: {
              background: `linear-gradient(135deg, ${c.light} 0%, ${c.mid}66 100%)`,
              borderBottom: `1px solid ${c.border}55`,
            },
          },
          title: { style: { color: c.text, fontWeight: 600 } },
          icon: {
            style: { background: c.border, color: '#fff', borderRadius: '50%' },
          },
        },
      ]),
    ),
  },
  // 4 — Glass: frosted-glass card
  {
    label: 'Glass',
    description: 'Frosted glass with backdrop blur and soft shadow',
    slotProps: {
      root: {
        style: {
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          borderRadius: 10,
        },
      },
      header: {
        style: {
          background: 'rgba(255,255,255,0.45)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        },
      },
      sectionContent: {
        style: {
          background: 'rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 6,
        },
      },
    },
  },
  // 5 — Retro: amber-on-black terminal
  {
    label: 'Retro',
    description: 'Amber-on-black terminal aesthetic',
    slotProps: {
      root: {
        style: {
          background: '#0d0d00',
          border: '1px solid #4a3500',
          borderRadius: 4,
        },
      },
      header: {
        style: { background: '#1a0e00', borderBottom: '1px solid #4a3500' },
      },
      title: {
        style: {
          color: '#ffb300',
          fontFamily: '"Courier New", Courier, monospace',
          textTransform: 'lowercase',
          letterSpacing: '0.03em',
        },
      },
      state: {
        style: {
          background: '#2a1c00',
          color: '#ff8f00',
          fontFamily: '"Courier New", Courier, monospace',
          border: '1px solid #4a3500',
          borderRadius: 2,
          letterSpacing: '0.08em',
        },
      },
      icon: {
        style: {
          background: '#2a1c00',
          color: '#ff8f00',
          border: '1px solid #4a3500',
          fontFamily: 'monospace',
          borderRadius: 2,
        },
      },
      section: { style: { borderTop: '1px solid #3d2200' } },
      sectionContent: {
        style: {
          background: '#080800',
          color: '#ffcc44',
          fontFamily: '"Courier New", Courier, monospace',
          border: '1px solid #3d2200',
          borderRadius: 2,
        },
      },
      error: {
        style: {
          background: '#1a0000',
          color: '#ff4444',
          borderTop: '1px solid #3d2200',
        },
      },
    },
  },
];

// ── Variation switcher ────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 12L6 8l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 12l4-4-4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ToolStylingB() {
  const [variantIdx, setVariantIdx] = React.useState(0);
  const total = VARIATIONS.length;
  const variant = VARIATIONS[variantIdx];

  const setThreadsRef = React.useRef(null);

  const adapter = React.useMemo(
    () => ({
      async sendMessage() {
        return createChunkStream(createAgenticChunks(nanoid()), { delayMs: 120 });
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
    <Box>
      {/* Variation switcher */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
          px: 0.5,
          py: 0.25,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'action.hover',
        }}
      >
        <IconButton
          size="small"
          onClick={() => setVariantIdx((i) => (i - 1 + total) % total)}
          aria-label="Previous variation"
        >
          <ChevronLeft />
        </IconButton>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography
            variant="caption"
            fontWeight={600}
            display="block"
            lineHeight={1.5}
          >
            Block theme {variantIdx + 1}/{total} — {variant.label}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            lineHeight={1.5}
          >
            {variant.description}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => setVariantIdx((i) => (i + 1) % total)}
          aria-label="Next variation"
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Chat — identical to AgenticCode, plus slotProps/toolSlotProps override */}
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
                slotProps: variant.slotProps,
                toolSlotProps: variant.toolSlotProps,
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
    </Box>
  );
}
