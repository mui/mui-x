'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { nanoid } from 'nanoid';
import { ChatBox, ChatConfirmation } from '@mui/x-chat';
import { createChunkStream, createTextResponseChunks } from '../shared/demoUtils';
import {
  demoUsers,
  minimalConversation,
  createTextMessage,
} from '../shared/demoData';

const CONVERSATION_ID = minimalConversation.id;

const INITIAL_MESSAGES = [
  createTextMessage({
    id: nanoid(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    text: 'Delete all temporary files in the project.',
    createdAt: '2026-03-22T10:00:00.000Z',
    author: demoUsers.you,
  }),
  createTextMessage({
    id: nanoid(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    text: 'I found 47 temporary files totalling 2.3 GB. Please confirm before I proceed — this action cannot be undone.',
    createdAt: '2026-03-22T10:01:00.000Z',
    author: demoUsers.agent,
  }),
];

type ConfirmationStatus = 'pending' | 'confirmed' | 'cancelled';

const RESULT_DISPLAY: Record<
  Exclude<ConfirmationStatus, 'pending'>,
  { text: string; color: string; borderColor: string }
> = {
  confirmed: {
    text: 'Files deleted successfully.',
    color: 'success.main',
    borderColor: 'success.main',
  },
  cancelled: {
    text: 'Action cancelled — files kept.',
    color: 'text.secondary',
    borderColor: 'divider',
  },
};

export default function Confirmation() {
  const [status, setStatus] = React.useState<ConfirmationStatus>('pending');

  const adapter = React.useMemo(
    () => ({
      async sendMessage() {
        const messageId = nanoid();
        return createChunkStream(
          createTextResponseChunks(messageId, 'Got it — what else can I help with?', {
            author: demoUsers.agent,
          }),
          { delayMs: 60 },
        );
      },
    }),
    [],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: 560 }}>
      <ChatBox
        adapter={adapter}
        defaultActiveConversationId={CONVERSATION_ID}
        defaultConversations={[minimalConversation]}
        defaultMessages={INITIAL_MESSAGES}
        sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
      />
      {status === 'pending' && (
        <ChatConfirmation
          message="Delete 47 temporary files (2.3 GB)? This action cannot be undone."
          confirmLabel="Delete files"
          cancelLabel="Keep files"
          onConfirm={() => setStatus('confirmed')}
          onCancel={() => setStatus('cancelled')}
        />
      )}
      {status !== 'pending' && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: RESULT_DISPLAY[status].borderColor,
          }}
        >
          <Typography variant="body2" color={RESULT_DISPLAY[status].color}>
            {RESULT_DISPLAY[status].text}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
