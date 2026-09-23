'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { ChatBox, createEchoAdapter } from '@mui/x-chat';
import { useChat } from '@mui/x-chat/headless';

const CONVERSATION_ID = 'history-demo';
const TOTAL = 60;
const PAGE_SIZE = 15;

const initialConversations = [{ id: CONVERSATION_ID, title: 'Support thread' }];

// Module-level fixture: 60 seeded messages, oldest (`msg-01`) → newest (`msg-60`).
const allMessages = Array.from({ length: TOTAL }, (_, index) => {
  const number = index + 1;
  const role = index % 2 === 0 ? 'user' : 'assistant';
  return {
    id: `msg-${String(number).padStart(2, '0')}`,
    conversationId: CONVERSATION_ID,
    role,
    status: 'sent',
    parts: [
      {
        type: 'text',
        text: `Message ${number} of ${TOTAL} — scroll up for older history.`,
      },
    ],
  };
});

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Serves `PAGE_SIZE` messages per call, newest page first. `cursor` is the
// stringified start offset of the slice to return; each page is sent in
// chronological order so the runtime can `prependMessages` it.
const listMessages = async ({ cursor }) => {
  const start = cursor != null ? Number(cursor) : TOTAL - PAGE_SIZE;
  const clampedStart = Math.max(0, start);
  const messages = allMessages.slice(clampedStart, clampedStart + PAGE_SIZE);
  const nextStart = clampedStart - PAGE_SIZE;

  // Artificial latency so the loading state is observable.
  await delay(800);

  return {
    messages,
    cursor: String(nextStart),
    hasMore: clampedStart > 0,
  };
};

const adapter = { ...createEchoAdapter(), listMessages };

function HistoryLoadingIndicator() {
  const { isLoadingHistory } = useChat();

  if (!isLoadingHistory) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
      <Chip label="Loading messages…" color="info" size="small" />
    </Box>
  );
}

export default function HistoryPaginationDemo() {
  return (
    <ChatBox
      adapter={adapter}
      initialConversations={initialConversations}
      initialActiveConversationId={CONVERSATION_ID}
      slotProps={{ messageList: { overlay: <HistoryLoadingIndicator /> } }}
      sx={{
        height: 460,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
