---
title: Chat - Agentic code assistant
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Agentic code assistant

Streaming tool calls (Bash, Read, Edit, Write, Glob), reasoning, step boundaries, and an interactive approval flow — driven entirely by the adapter API.

```tsx
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
} from 'docsx/data/chat/material/examples/shared/demoUtils';

// --- Avatar helper ------------------------------------------------------------

function createAvatarDataUrl(
  label: string,
  background: string,
  foreground = '#ffffff',
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// --- Users -------------------------------------------------------------------

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

// --- Message factories -------------------------------------------------------

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

// --- Conversation IDs — generated once at module load -----------------------

const fixTestsId = 'ac-fix-tests';
const addFeatureId = 'ac-add-feature';
const dangerousCmdId = 'ac-dangerous-cmd';

// --- Pre-populated conversations ---------------------------------------------

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

// --- Pre-populated threads ---------------------------------------------------

const initialThreads: Record<string, ChatMessage[]> = {
  [fixTestsId]: [
    makeUserMessage(
      'ac-ft-msg-1',
      fixTestsId,
      'The unit tests are failing after the recent refactor. Can you fix them?',
      '2026-03-21T09:20:00.000Z',
    ),
    makeAssistantMessage('ac-ft-msg-2', fixTestsId, '2026-03-21T09:21:00.000Z', [
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
          toolCallId: 'ac-ft-tc-1',
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
          toolCallId: 'ac-ft-tc-2',
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
          toolCallId: 'ac-ft-tc-3',
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
          toolCallId: 'ac-ft-tc-4',
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
      'ac-af-msg-1',
      addFeatureId,
      'Add a dark mode toggle button to the header',
      '2026-03-21T08:00:00.000Z',
    ),
    makeAssistantMessage('ac-af-msg-2', addFeatureId, '2026-03-21T08:01:00.000Z', [
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
          toolCallId: 'ac-af-tc-1',
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
          toolCallId: 'ac-af-tc-2',
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
          toolCallId: 'ac-af-tc-3',
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
      'ac-dc-msg-1',
      dangerousCmdId,
      'Clean up all build artifacts and reset to a clean state',
      '2026-03-21T10:00:00.000Z',
    ),
    makeAssistantMessage(
      'ac-dc-msg-2',
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
            toolCallId: 'ac-dc-tc-1',
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

// --- Scripted chunk builder for new messages ---------------------------------

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
  } as any);
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

// --- Component ---------------------------------------------------------------

type SetThreads = React.Dispatch<
  React.SetStateAction<Record<string, ChatMessage[]>>
>;

export default function AgenticCode() {
  const setThreadsRef = React.useRef<SetThreads | null>(null);

  // The adapter is created once (stable reference) and reads state via ref.
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

  // Keep the ref pointing to the latest setter on every render.
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
      sx={{
        height: 620,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

## How it works

The demo has three pre-populated conversations, each showcasing a different aspect of the
agentic loop:

- **Fix test failures** — a complete multi-step task: `glob` finds the files, `read_file`
  inspects the broken import, `edit_file` patches it, and `bash` confirms the tests pass.
- **Add dark mode toggle** — `read_file` inspects the existing component, `write_file`
  creates a new one, then `bash` verifies the build.
- **Clean build artifacts** — a `bash` command in the `approval-requested` state. Click
  **Approve** or **Deny** to see the state transition live.

Send any new message in any conversation to watch the scripted agentic stream play out from
scratch: reasoning → text → tool input streaming → tool output → next tool → final summary.

## Streaming tool calls

The adapter's `sendMessage` method returns a `ReadableStream` of typed chunks. Tool calls
flow through a state machine driven by those chunks:

```ts
// 1. Tool starts — input streams in as JSON deltas
{ type: 'tool-input-start', toolCallId, toolName: 'glob', dynamic: true }
{ type: 'tool-input-delta', toolCallId, inputTextDelta: '{"pattern":' }
{ type: 'tool-input-delta', toolCallId, inputTextDelta: '"src/**/*.ts"}' }
{ type: 'tool-input-available', toolCallId, toolName: 'glob', input: { pattern: 'src/**/*.ts' } }

// 2. Tool finishes — output arrives as a single chunk
{ type: 'tool-output-available', toolCallId, output: { files: ['src/api.ts', ...] } }
```

The component renders each state automatically: a spinner during `input-streaming`,
the formatted input once `input-available`, and the output once `output-available`.

## Tool approval flow

When the adapter emits a `tool-approval-request` chunk (or a message is pre-populated with
`state: 'approval-requested'`), the built-in `ToolPart` renders **Approve** and **Deny**
buttons. Clicking either calls `adapter.addToolApprovalResponse({ id, approved })`.

The adapter then updates the tool's state to `output-available` or `output-denied`,
which the component reflects immediately:

```ts
const adapter: ChatAdapter = {
  async addToolApprovalResponse({ id, approved }) {
    // Update the tool invocation state in your message store
  },
};
```

## Reasoning parts

Before the first tool call the model emits a reasoning chunk sequence:

```ts
{ type: 'reasoning-start', id }
{ type: 'reasoning-delta', id, delta: 'Let me explore...' }
{ type: 'reasoning-end', id }
```

This produces a collapsible `ReasoningPart` in the message — collapsed by default so it
doesn't dominate the conversation but still inspectable.

## Step boundaries

`{ type: 'start-step' }` marks the beginning of a new agentic iteration. The corresponding
`step-start` part in the rendered message visually separates reasoning loops, making it
clear where one planning cycle ends and the next begins.

## Tool slot overrides

Both `slots` and `slotProps` on the built-in `ToolPart` renderer are fully
customizable. Pass them through `slotProps.messageContent.partProps['dynamic-tool']`
on `ChatBox`.

### Icon styles

Five variations of the `icon` slot — from the default first-letter monogram to
emoji, coloured circles, terminal squares, and Unicode symbols. Each icon
receives `ownerState.toolName` so a single component can branch on the tool type.

```tsx
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

const fixTestsId = 'tsa-fix-tests';
const addFeatureId = 'tsa-add-feature';
const dangerousCmdId = 'tsa-dangerous-cmd';

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
      'tsa-ft-msg-1',
      fixTestsId,
      'The unit tests are failing after the recent refactor. Can you fix them?',
      '2026-03-21T09:20:00.000Z',
    ),
    makeAssistantMessage('tsa-ft-msg-2', fixTestsId, '2026-03-21T09:21:00.000Z', [
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
          toolCallId: 'tsa-ft-tc-1',
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
          toolCallId: 'tsa-ft-tc-2',
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
          toolCallId: 'tsa-ft-tc-3',
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
          toolCallId: 'tsa-ft-tc-4',
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
      'tsa-af-msg-1',
      addFeatureId,
      'Add a dark mode toggle button to the header',
      '2026-03-21T08:00:00.000Z',
    ),
    makeAssistantMessage('tsa-af-msg-2', addFeatureId, '2026-03-21T08:01:00.000Z', [
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
          toolCallId: 'tsa-af-tc-1',
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
          toolCallId: 'tsa-af-tc-2',
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
          toolCallId: 'tsa-af-tc-3',
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
      'tsa-dc-msg-1',
      dangerousCmdId,
      'Clean up all build artifacts and reset to a clean state',
      '2026-03-21T10:00:00.000Z',
    ),
    makeAssistantMessage(
      'tsa-dc-msg-2',
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
            toolCallId: 'tsa-dc-tc-1',
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
  } as any);
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

// ── Icon slot component ───────────────────────────────────────────────────────

type IconProps = {
  ownerState?: { toolName?: string };
} & React.HTMLAttributes<HTMLSpanElement>;

const TOOL_COLORS: Record<string, string> = {
  glob: '#5c6bc0',
  read_file: '#0288d1',
  edit_file: '#f57c00',
  write_file: '#388e3c',
  bash: '#c62828',
};

// Outlined ring with tool initial — colored border + tinted background
const RingIcon = React.forwardRef<HTMLSpanElement, IconProps>(function RingIcon(
  { ownerState, style, ...rest },
  ref,
) {
  const toolName = ownerState?.toolName ?? '';
  const color = TOOL_COLORS[toolName] ?? '#757575';
  const letter = toolName.charAt(0).toUpperCase() || '⚙';
  return (
    <span
      ref={ref}
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: `1.5px solid ${color}`,
        color,
        fontSize: '0.5rem',
        fontWeight: 700,
        flexShrink: 0,
        background: `${color}15`,
        ...style,
      }}
    >
      {letter}
    </span>
  );
});

// ── Per-tool icon slots ───────────────────────────────────────────────────────

const KNOWN_TOOLS = ['glob', 'read_file', 'edit_file', 'write_file', 'bash'];

const ringToolSlots = Object.fromEntries(
  KNOWN_TOOLS.map((name) => [name, { icon: RingIcon }]),
);

// ── Component ─────────────────────────────────────────────────────────────────

type SetThreads = React.Dispatch<
  React.SetStateAction<Record<string, ChatMessage[]>>
>;

export default function ToolStylingA() {
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
            'dynamic-tool': { toolSlots: ringToolSlots },
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

```

### Block themes

Five color themes, all built on `toolSlotProps` — per-tool overrides that style
the header, icon, title, state chip, and root border without touching the global
slots. This keeps collapse/expand and all other built-in behaviors intact while
giving each tool its own distinct accent: **Colorful** (gradient + circular icon),
**Pastel** (light fills), **Vivid** (solid saturated header, white text),
**Outlined** (transparent fill, colored border), and **Dark** (dark background
with glowing accents).

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
  ChatMessagePart,
  ToolPartSlotProps,
} from '@mui/x-chat/headless';
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

const fixTestsId = 'tsb-fix-tests';
const addFeatureId = 'tsb-add-feature';
const dangerousCmdId = 'tsb-dangerous-cmd';

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
      'tsb-ft-msg-1',
      fixTestsId,
      'The unit tests are failing after the recent refactor. Can you fix them?',
      '2026-03-21T09:20:00.000Z',
    ),
    makeAssistantMessage('tsb-ft-msg-2', fixTestsId, '2026-03-21T09:21:00.000Z', [
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
          toolCallId: 'tsb-ft-tc-1',
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
          toolCallId: 'tsb-ft-tc-2',
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
          toolCallId: 'tsb-ft-tc-3',
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
          toolCallId: 'tsb-ft-tc-4',
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
      'tsb-af-msg-1',
      addFeatureId,
      'Add a dark mode toggle button to the header',
      '2026-03-21T08:00:00.000Z',
    ),
    makeAssistantMessage('tsb-af-msg-2', addFeatureId, '2026-03-21T08:01:00.000Z', [
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
          toolCallId: 'tsb-af-tc-1',
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
          toolCallId: 'tsb-af-tc-2',
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
          toolCallId: 'tsb-af-tc-3',
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
      'tsb-dc-msg-1',
      dangerousCmdId,
      'Clean up all build artifacts and reset to a clean state',
      '2026-03-21T10:00:00.000Z',
    ),
    makeAssistantMessage(
      'tsb-dc-msg-2',
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
            toolCallId: 'tsb-dc-tc-1',
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
  } as any);
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

// ── Tool accent palette ───────────────────────────────────────────────────────

interface ToolAccent {
  /** Light tint for gradient/fill backgrounds */
  light: string;
  /** Mid tone for gradient end / borders */
  mid: string;
  /** Saturated border / icon background */
  border: string;
  /** Dark readable text */
  text: string;
  /** Solid vivid background */
  vivid: string;
}

const ACCENTS: Record<string, ToolAccent> = {
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

function makeColorfulSlots(): Record<string, ToolPartSlotProps> {
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
      } satisfies ToolPartSlotProps,
    ]),
  );
}

// ── Per-tool slot props (Colorful theme) ─────────────────────────────────────

const colorfulToolSlotProps = makeColorfulSlots();

// ── Component ─────────────────────────────────────────────────────────────────

type SetThreads = React.Dispatch<
  React.SetStateAction<Record<string, ChatMessage[]>>
>;

export default function ToolStylingB() {
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

```

### Custom renderer

Replace the tool block entirely by providing a custom `root` slot component via
`toolSlots`. The component receives `ownerState.toolName` and `ownerState.state`
from the slot system — no default markup, no expand/collapse. Here each call
renders as a single-line process trace: tool name, a dotted rule, and a state badge.

```tsx
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
  } as any);
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

```

## See also

- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) — two-pane inbox layout
- [Split layout](/x/react-chat/material/examples/split-layout/) — place message list and composer in separate DOM zones

## API

- [ChatRoot](/x/api/chat/chat-root/)
