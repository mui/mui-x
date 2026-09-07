'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatMessage,
  ChatPartRendererMap,
} from '@mui/x-chat/headless';
import {
  createChunkStream,
  randomId,
} from 'docs/data/chat/core/examples/shared/demoUtils';

// Register the payload type for the `data-ticket-status` part. This merges with
// the docs-wide augmentation, so the `data` field is typed everywhere below.
declare module '@mui/x-chat-headless/types' {
  interface ChatDataPartMap {
    'data-ticket-status': {
      ticketId: string;
      status: 'open' | 'blocked' | 'resolved';
      lastUpdated: string;
    };
  }
}

type TicketStatus = 'open' | 'blocked' | 'resolved';

const STATUS_COLORS: Record<TicketStatus, { fg: string; bg: string }> = {
  open: { fg: '#0b5cad', bg: 'rgba(25, 118, 210, 0.12)' },
  blocked: { fg: '#b3261e', bg: 'rgba(211, 47, 47, 0.12)' },
  resolved: { fg: '#1b5e20', bg: 'rgba(46, 125, 50, 0.12)' },
};

const STATUS_CYCLE: TicketStatus[] = ['open', 'blocked', 'resolved'];

function TicketStatusBadge({
  ticketId,
  status,
  lastUpdated,
}: {
  ticketId: string;
  status: TicketStatus;
  lastUpdated: string;
}) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <span
        aria-label={`Ticket ${ticketId}: ${status}, updated ${lastUpdated}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 10px',
          borderRadius: 999,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: colors.fg,
          backgroundColor: colors.bg,
        }}
      >
        {ticketId} · {status}
      </span>
      <span
        style={{
          fontSize: '0.6875rem',
          color: 'var(--mui-palette-text-secondary, rgba(0,0,0,0.6))',
        }}
      >
        updated {lastUpdated}
      </span>
    </span>
  );
}

const partRenderers: ChatPartRendererMap = {
  'data-ticket-status': ({ part }) => (
    <TicketStatusBadge
      ticketId={part.data.ticketId}
      status={part.data.status}
      lastUpdated={part.data.lastUpdated}
    />
  ),
};

const initialMessages: ChatMessage[] = [
  {
    id: 'seed-user',
    role: 'user',
    status: 'sent',
    parts: [{ type: 'text', text: "What's the status of ticket T-1042?" }],
  },
  {
    id: 'seed-assistant',
    role: 'assistant',
    status: 'sent',
    parts: [
      { type: 'text', text: 'Here is the latest status:' },
      {
        type: 'data-ticket-status',
        data: {
          ticketId: 'T-1042',
          status: 'blocked',
          lastUpdated: '2026-06-10',
        },
      },
    ],
  },
];

export default function CustomDataPartChat() {
  const cycleRef = React.useRef(0);

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        const messageId = randomId();
        const textId = `${messageId}-text`;
        const status = STATUS_CYCLE[cycleRef.current % STATUS_CYCLE.length];
        cycleRef.current += 1;

        return createChunkStream(
          [
            { type: 'start', messageId },
            { type: 'text-start', id: textId },
            {
              type: 'text-delta',
              id: textId,
              delta: 'Latest ticket status:',
            },
            { type: 'text-end', id: textId },
            {
              type: 'data-ticket-status',
              id: `${messageId}-ticket-status`,
              data: {
                ticketId: 'T-1042',
                status,
                lastUpdated: new Date().toISOString().slice(0, 10),
              },
            },
            { type: 'finish', messageId, finishReason: 'stop' },
          ],
          { delayMs: 120 },
        );
      },
    }),
    [],
  );

  return (
    <ChatBox
      adapter={adapter}
      partRenderers={partRenderers}
      initialMessages={initialMessages}
      sx={{
        height: 420,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
