'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = 'date-divider-by-week';

const conversation: ChatConversation = {
  id: CONV_ID,
  title: 'Date divider by week',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-17T10:00:00.000Z',
};

const messages: ChatMessage[] = [
  createTextMessage({
    id: 'dd-week-1',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-02T15:00:00.000Z',
    text: 'Kicking off the project this week.',
  }),
  createTextMessage({
    id: 'dd-week-2',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-04T09:30:00.000Z',
    text: 'Same week — no new divider above me.',
  }),
  createTextMessage({
    id: 'dd-week-3',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-10T10:00:00.000Z',
    text: 'A new week starts here.',
  }),
  createTextMessage({
    id: 'dd-week-4',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-12T11:00:00.000Z',
    text: 'Still the same week as the previous message.',
  }),
  createTextMessage({
    id: 'dd-week-5',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T08:00:00.000Z',
    text: 'And another week begins.',
  }),
];

// Back to the Monday that starts the date's ISO week, in UTC.
function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
}

function startOfWeekIso(date: Date) {
  return startOfWeek(date).toISOString().slice(0, 10);
}

const shouldShowDivider = ({
  date,
  previousDate,
}: {
  date: Date | null;
  previousDate: Date | null;
}) =>
  date != null &&
  previousDate != null &&
  startOfWeekIso(date) !== startOfWeekIso(previousDate);

const formatDate = (date: Date) =>
  `Week of ${startOfWeek(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`;

export default function DateDividerByWeek() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
      features={{ dateDivider: true }}
      slotProps={{
        dateDivider: {
          shouldShowDivider,
          formatDate,
        },
      }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
