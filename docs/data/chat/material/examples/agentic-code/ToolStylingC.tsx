'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
  ChatMessagePart,
} from '@mui/x-chat-headless';
import {
  createChunkStream,
  randomId,
  splitText,
  syncConversationPreview,
} from 'docsx/data/chat/material/examples/shared/demoUtils';

// ── Avatar helper ─────────────────────────────────────────────────────────────

function createAvatarDataUrl(
  label: string,
  background: string,
  foreground = '#ffffff',
) {
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

function makeUserMessage(
  id: string,
  conversationId: string,
  text: string,
  createdAt: string,
): ChatMessage {
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
  id: string,
  conversationId: string,
  createdAt: string,
  parts: ChatMessagePart[],
  status: ChatMessage['status'] = 'sent',
): ChatMessage {
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

const fixTestsId = 'tsc-fix-tests';
const addFeatureId = 'tsc-add-feature';
const dangerousCmdId = 'tsc-dangerous-cmd';

// ── Pre-populated conversations ───────────────────────────────────────────────

const initialConversations: ChatConversation[] = [
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

const initialThreads: Record<string, ChatMessage[]> = {
  [fixTestsId]: [
    makeUserMessage(
      'tsc-ft-msg-1',
      fixTestsId,
      'The unit tests are failing after the recent refactor. Can you fix them?',
      '2026-03-21T09:20:00.000Z',
    ),
    makeAssistantMessage('tsc-ft-msg-2', fixTestsId, '2026-03-21T09:21:00.000Z', [
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
          toolCallId: 'tsc-ft-tc-1',
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
          toolCallId: 'tsc-ft-tc-2',
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
          toolCallId: 'tsc-ft-tc-3',
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
          toolCallId: 'tsc-ft-tc-4',
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
      'tsc-af-msg-1',
      addFeatureId,
      'Add a dark mode toggle button to the header',
      '2026-03-21T08:00:00.000Z',
    ),
    makeAssistantMessage('tsc-af-msg-2', addFeatureId, '2026-03-21T08:01:00.000Z', [
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
          toolCallId: 'tsc-af-tc-1',
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
          toolCallId: 'tsc-af-tc-2',
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
          toolCallId: 'tsc-af-tc-3',
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
      'tsc-dc-msg-1',
      dangerousCmdId,
      'Clean up all build artifacts and reset to a clean state',
      '2026-03-21T10:00:00.000Z',
    ),
    makeAssistantMessage(
      'tsc-dc-msg-2',
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
            toolCallId: 'tsc-dc-tc-1',
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

function createAgenticChunks(messageId: string): ChatMessageChunk[] {
  const chunks: ChatMessageChunk[] = [];
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

// ── Tool colors ───────────────────────────────────────────────────────────────

const TOOL_COLORS: Record<string, string> = {
  glob: '#7c3aed',
  read_file: '#0369a1',
  edit_file: '#b45309',
  write_file: '#15803d',
  bash: '#b91c1c',
};

// ── State config ──────────────────────────────────────────────────────────────

interface StateConfig {
  label: string;
  color: string;
  symbol: string;
}

function resolveState(
  state: string | undefined,
  pendingApproval: boolean | undefined,
): StateConfig {
  if (pendingApproval) {
    return { label: 'approval needed', color: '#d97706', symbol: '⏸' };
  }
  switch (state) {
    case 'streaming-input':
    case 'input-available':
      return { label: 'running', color: '#2563eb', symbol: '◌' };
    case 'output-available':
      return { label: 'done', color: '#16a34a', symbol: '✓' };
    case 'output-denied':
      return { label: 'denied', color: '#dc2626', symbol: '✗' };
    default:
      return { label: 'pending', color: '#6b7280', symbol: '…' };
  }
}

// ── Custom root slot — process trace ─────────────────────────────────────────
//
// Replaces the entire <details> block with a single compact row.
// Receives ownerState.toolName + ownerState.state from the slot system.

interface TraceOwnerState {
  toolName?: string;
  state?: string;
  pendingApproval?: boolean;
}

type TraceRootProps = {
  ownerState?: TraceOwnerState;
  // children contains the default header + section content — intentionally unused
  children?: React.ReactNode;
  open?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const TraceRoot = React.forwardRef<HTMLDivElement, TraceRootProps>(
  function TraceRoot(
    { ownerState, children: _children, open: _open, style, ...rest },
    ref,
  ) {
    const toolName = ownerState?.toolName ?? 'tool';
    const accent = TOOL_COLORS[toolName] ?? '#6b7280';
    const {
      label,
      color: stateColor,
      symbol,
    } = resolveState(ownerState?.state, ownerState?.pendingApproval);

    return (
      <div
        ref={ref}
        {...rest}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 10px 4px 12px',
          margin: '1px 0',
          borderRadius: '0 5px 5px 0',
          borderLeft: `2px solid ${accent}`,
          background: `${accent}08`,
          fontFamily:
            '"Geist Mono", "Cascadia Code", "Fira Code", ui-monospace, "SF Mono", monospace',
          fontSize: '0.7rem',
          lineHeight: 1,
          userSelect: 'none',
          ...style,
        }}
      >
        {/* Tool name */}
        <span
          style={{
            color: accent,
            fontWeight: 700,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          {toolName}
        </span>

        {/* Dotted rule */}
        <span
          aria-hidden
          style={{
            flex: 1,
            height: 1,
            background: `repeating-linear-gradient(90deg, ${accent}30 0px, ${accent}30 2px, transparent 2px, transparent 6px)`,
            alignSelf: 'center',
          }}
        />

        {/* State badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 7px',
            borderRadius: 10,
            background: `${stateColor}12`,
            border: `1px solid ${stateColor}30`,
            color: stateColor,
            fontSize: '0.65rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ fontSize: '0.6rem', lineHeight: 1 }}>{symbol}</span>
          {label}
        </span>
      </div>
    );
  },
);

// ── Per-tool slot overrides ───────────────────────────────────────────────────

const KNOWN_TOOLS = ['glob', 'read_file', 'edit_file', 'write_file', 'bash'];

const traceToolSlots = Object.fromEntries(
  KNOWN_TOOLS.map((name) => [name, { root: TraceRoot }]),
);

// ── Component ─────────────────────────────────────────────────────────────────

type SetThreads = React.Dispatch<
  React.SetStateAction<Record<string, ChatMessage[]>>
>;

export default function ToolStylingC() {
  const setThreadsRef = React.useRef<SetThreads | null>(null);

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        return createChunkStream(createAgenticChunks(randomId()), { delayMs: 120 });
      },
      async addToolApprovalResponse({ id, approved }) {
        setThreadsRef.current?.((prev) => {
          const next: Record<string, ChatMessage[]> = {};
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
                          state: 'output-available' as const,
                          output: {
                            done: true,
                            message: 'Artifacts deleted successfully.',
                          },
                          approval: { approved: true },
                        }
                      : {
                          ...part.toolInvocation,
                          state: 'output-denied' as const,
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
            'dynamic-tool': { toolSlots: traceToolSlots },
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
