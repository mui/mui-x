'use client';
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ChatBox } from '@mui/x-chat';

import {
  createChunkStream,
  randomId,
  splitText,
} from 'docsx/data/chat/material/examples/shared/demoUtils';

// --- Task types --------------------------------------------------------------

// --- Users -------------------------------------------------------------------

function createAvatarDataUrl(label, background, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const agentUser = {
  id: 'agent',
  displayName: 'Agent',
  avatarUrl: createAvatarDataUrl('A', '#9c27b0'),
  isOnline: true,
};

const youUser = {
  id: 'you',
  displayName: 'You',
  avatarUrl: createAvatarDataUrl('Y', '#1976d2'),
  isOnline: true,
};

// --- Status icon -------------------------------------------------------------

function TaskStatusIcon({ status }) {
  if (status === 'running') {
    return (
      <CircularProgress
        size={14}
        thickness={4}
        sx={{ flexShrink: 0, color: 'primary.main' }}
      />
    );
  }

  const icons = {
    pending: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    done: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" fill="currentColor" />
        <path
          d="M4 7.2l2 2 4-4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    error: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" fill="currentColor" />
        <path
          d="M4.5 4.5l5 5M9.5 4.5l-5 5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    skipped: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 7h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  return (
    <span
      style={{ display: 'inline-flex', flexShrink: 0, color: 'inherit' }}
      // Pass MUI color token via sx if needed — here we inline via style
      data-status={status}
    >
      <span
        style={{
          display: 'inline-flex',
          color: (() => {
            if (status === 'done') {
              return 'var(--mui-palette-success-main, #2e7d32)';
            }
            if (status === 'error') {
              return 'var(--mui-palette-error-main, #d32f2f)';
            }
            return 'var(--mui-palette-text-disabled, rgba(0,0,0,0.38))';
          })(),
        }}
      >
        {icons[status]}
      </span>
    </span>
  );
}

// --- TaskList ----------------------------------------------------------------
// Custom collapsible task list — rendered in place of the run_tasks tool call.

function TaskList({ tasks }) {
  const total = tasks.length;
  const doneCount = tasks.filter(
    (t) => t.status === 'done' || t.status === 'skipped',
  ).length;
  const hasError = tasks.some((t) => t.status === 'error');
  const anyRunning = tasks.some((t) => t.status === 'running');
  const allTerminal = tasks.every(
    (t) => t.status === 'done' || t.status === 'error' || t.status === 'skipped',
  );

  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    if (anyRunning) {
      setOpen(true);
    } else if (allTerminal) {
      setOpen(false);
    }
  }, [anyRunning, allTerminal]);

  let countLabel;
  if (hasError) {
    countLabel = 'error';
  } else if (allTerminal) {
    countLabel = 'done';
  } else {
    countLabel = `${doneCount} / ${total}`;
  }

  let countColor;
  if (hasError) {
    countColor = 'var(--mui-palette-error-main, #d32f2f)';
  } else if (allTerminal) {
    countColor = 'var(--mui-palette-success-main, #2e7d32)';
  } else {
    countColor = 'var(--mui-palette-primary-main, #1976d2)';
  }

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      style={{ margin: '4px 0' }}
    >
      <summary
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          borderRadius: 4,
          backgroundColor: 'var(--mui-palette-action-hover, rgba(0,0,0,0.04))',
          cursor: 'pointer',
          userSelect: 'none',
          listStyleType: 'none',
          fontSize: '0.75rem',
          fontFamily: 'inherit',
        }}
      >
        {/* expand/collapse icon */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 16,
            height: 16,
            borderRadius: 2,
            backgroundColor: 'var(--mui-palette-action-selected, rgba(0,0,0,0.08))',
            fontSize: '0.6rem',
            flexShrink: 0,
            color: 'var(--mui-palette-text-secondary, rgba(0,0,0,0.6))',
          }}
        >
          {open ? '−' : '+'}
        </span>

        {/* title */}
        <span
          style={{
            flex: 1,
            fontWeight: 500,
            color: 'var(--mui-palette-text-primary, rgba(0,0,0,0.87))',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Tasks
        </span>

        {/* count badge */}
        <span style={{ color: countColor, fontVariantNumeric: 'tabular-nums' }}>
          {countLabel}
        </span>
      </summary>

      <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              fontSize: '0.8125rem',
              fontFamily: 'inherit',
            }}
          >
            <TaskStatusIcon status={task.status} />
            <span
              style={{
                color:
                  task.status === 'skipped'
                    ? 'var(--mui-palette-text-disabled, rgba(0,0,0,0.38))'
                    : 'var(--mui-palette-text-primary, rgba(0,0,0,0.87))',
                textDecoration:
                  task.status === 'skipped' ? 'line-through' : undefined,
              }}
            >
              {task.label}
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}

// --- Plan steps --------------------------------------------------------------

const PLAN_STEPS = [
  { id: '1', label: 'Analyze repository structure', status: 'pending' },
  { id: '2', label: 'Identify test gaps', status: 'pending' },
  { id: '3', label: 'Write unit tests', status: 'pending' },
  { id: '4', label: 'Run test suite', status: 'pending' },
  { id: '5', label: 'Open pull request', status: 'pending' },
];

const STEP_DELAY_MS = 900;

// --- Chunk helpers -----------------------------------------------------------

function createResponseChunks(messageId, toolCallId) {
  const chunks = [];
  const textId = `${messageId}-text`;
  const text =
    "Here's my execution plan. I'll work through each step and report back.";

  chunks.push({ type: 'start', messageId, author: agentUser });
  chunks.push({ type: 'text-start', id: textId });
  for (const delta of splitText(text)) {
    chunks.push({ type: 'text-delta', id: textId, delta });
  }
  chunks.push({ type: 'text-end', id: textId });

  // Emit the run_tasks tool call with all steps pending
  chunks.push({
    type: 'tool-input-start',
    toolCallId,
    toolName: 'run_tasks',
    dynamic: true,
  });
  chunks.push({
    type: 'tool-input-available',
    toolCallId,
    toolName: 'run_tasks',
    input: { tasks: PLAN_STEPS },
    dynamic: true,
  });

  chunks.push({ type: 'finish', messageId, finishReason: 'stop' });
  return chunks;
}

// --- Component ---------------------------------------------------------------

export default function PlanTask() {
  const [messages, setMessages] = React.useState([]);
  const setMessagesRef = React.useRef(setMessages);
  setMessagesRef.current = setMessages;

  const [tasks, setTasks] = React.useState(PLAN_STEPS);

  // Rebuild partRenderers when tasks change so the task list re-renders.
  const partRenderers = React.useMemo(
    () => ({
      'dynamic-tool': ({ part }) => {
        if (part.toolInvocation.toolName !== 'run_tasks') {
          return null;
        }
        return <TaskList tasks={tasks} />;
      },
    }),
    [tasks],
  );

  const animateTasks = React.useCallback(() => {
    PLAN_STEPS.forEach((_, index) => {
      // Mark as running
      setTimeout(() => {
        setTasks(
          PLAN_STEPS.map((step, i) => {
            let status;
            if (i < index) {
              status = 'done';
            } else if (i === index) {
              status = 'running';
            } else {
              status = 'pending';
            }
            return { ...step, status };
          }),
        );
      }, STEP_DELAY_MS * index);

      // Mark as done
      setTimeout(
        () => {
          setTasks(
            PLAN_STEPS.map((step, i) => ({
              ...step,
              status: i <= index ? 'done' : 'pending',
            })),
          );
        },
        STEP_DELAY_MS * index + STEP_DELAY_MS * 0.8,
      );
    });
  }, []);

  const adapter = React.useMemo(
    () => ({
      async sendMessage() {
        const messageId = randomId();
        const toolCallId = randomId();

        // Reset tasks and start animation after the stream settles
        setTasks(PLAN_STEPS.map((s) => ({ ...s, status: 'pending' })));
        const chunks = createResponseChunks(messageId, toolCallId);
        setTimeout(animateTasks, chunks.length * 60 + 300);

        return createChunkStream(chunks, { delayMs: 60 });
      },
    }),
    [animateTasks],
  );

  return (
    <ChatBox
      adapter={adapter}
      partRenderers={partRenderers}
      members={[youUser, agentUser]}
      messages={messages}
      onMessagesChange={setMessages}
      sx={{
        height: 560,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
