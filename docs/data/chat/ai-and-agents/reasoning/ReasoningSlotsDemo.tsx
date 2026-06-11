'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatMessageChunk,
  ReasoningPartOwnerState,
} from '@mui/x-chat/headless';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

const CONVERSATION_ID = 'reasoning-slots-demo';

const initialConversations = [{ id: CONVERSATION_ID, title: 'Reasoning slots' }];

const initialMessages = [
  {
    id: 'seed',
    conversationId: CONVERSATION_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
      {
        type: 'reasoning' as const,
        text: 'The user greeted me. A short, friendly reply is enough — no tools needed.',
        state: 'done' as const,
      },
      {
        type: 'text' as const,
        text: 'Hi! Send a message to see the restyled reasoning disclosure stream.',
      },
    ],
  },
];

// Emit one chunk per pull, with a small delay, so the disclosure visibly streams.
function streamChunks(chunks: ChatMessageChunk[]) {
  let index = 0;
  return new ReadableStream<ChatMessageChunk>({
    pull(controller) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          if (index < chunks.length) {
            controller.enqueue(chunks[index]);
            index += 1;
          } else {
            controller.close();
          }
          resolve();
        }, 100);
      });
    },
  });
}

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const messageId = `reply-${message.id}`;
    return streamChunks([
      { type: 'start', messageId },
      { type: 'reasoning-start', id: 'r1' },
      {
        type: 'reasoning-delta',
        id: 'r1',
        delta: 'Let me think about how to answer this. ',
      },
      {
        type: 'reasoning-delta',
        id: 'r1',
        delta: 'The question is straightforward, ',
      },
      { type: 'reasoning-delta', id: 'r1', delta: 'so a concise reply works best.' },
      { type: 'reasoning-end', id: 'r1' },
      { type: 'text-start', id: 't1' },
      { type: 'text-delta', id: 't1', delta: 'Here is the answer, now that ' },
      { type: 'text-delta', id: 't1', delta: 'the reasoning above has finished.' },
      { type: 'text-end', id: 't1' },
      { type: 'finish', messageId },
    ]);
  },
};

// Custom `root` slot — a tinted disclosure container.
const CustomRoot = React.forwardRef(function CustomRoot(
  props: React.HTMLAttributes<HTMLDetailsElement> & {
    ownerState?: ReasoningPartOwnerState;
  },
  ref: React.Ref<HTMLDetailsElement>,
) {
  const { ownerState, style, ...other } = props;
  return (
    <details
      ref={ref}
      style={{
        margin: '6px 0',
        padding: '6px 10px',
        borderRadius: 8,
        background: 'rgba(99, 102, 241, 0.08)',
        ...style,
      }}
      {...other}
    />
  );
});

// Custom `summary` slot — uses `ownerState.streaming` for a live affordance.
const CustomSummary = React.forwardRef(function CustomSummary(
  props: React.HTMLAttributes<HTMLElement> & {
    ownerState?: ReasoningPartOwnerState;
  },
  ref: React.Ref<HTMLElement>,
) {
  const { ownerState, children, style, ...other } = props;
  const streaming = ownerState?.streaming;
  return (
    <summary
      ref={ref}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        listStyle: 'none',
        fontSize: 13,
        fontWeight: 500,
        color: '#6366f1',
        ...style,
      }}
      {...other}
    >
      <AutoAwesomeOutlinedIcon style={{ fontSize: 14 }} />
      {children}
      {streaming ? (
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#6366f1',
            animation: 'reasoning-pulse 1s ease-in-out infinite',
          }}
        />
      ) : null}
      <style>
        {
          '@keyframes reasoning-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }'
        }
      </style>
    </summary>
  );
});

export default function ReasoningSlotsDemo() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialConversations={initialConversations}
      initialMessages={initialMessages}
      slotProps={{
        messageContent: {
          partProps: {
            reasoning: {
              slots: { root: CustomRoot, summary: CustomSummary },
            },
          },
        },
      }}
      sx={{
        height: 480,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
