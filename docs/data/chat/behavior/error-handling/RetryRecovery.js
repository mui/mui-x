'use client';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import { ChatBox } from '@mui/x-chat';

import {
  minimalConversation,
  minimalMessages,
  demoUsers,
} from 'docs/data/chat/material/examples/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
} from 'docs/data/chat/material/examples/shared/demoUtils';

const demoMembers = [demoUsers.you, demoUsers.agent];

function useFlakyAdapter() {
  // Tracks the message ids that already failed once. The first attempt for a
  // given id always throws; the retry (same id) succeeds.
  const failedOnce = React.useRef(new Set());

  return React.useMemo(
    () => ({
      async sendMessage({ message }) {
        if (!failedOnce.current.has(message.id)) {
          failedOnce.current.add(message.id);
          throw new Error(
            'Network error: the first attempt always fails in this demo.',
          );
        }

        return createChunkStream(
          createTextResponseChunks(
            `${message.id}-reply`,
            'Recovered! The retry reached the server and this reply streamed in.',
            { author: demoUsers.agent },
          ),
        );
      },
    }),
    [],
  );
}

export default function RetryRecovery() {
  const adapter = useFlakyAdapter();
  const [error, setError] = React.useState(null);

  return (
    <div style={{ width: '100%' }}>
      <ChatBox
        adapter={adapter}
        members={demoMembers}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        onError={setError}
        onFinish={({ isError, isAbort, isDisconnect }) => {
          // A successful retry streams a reply to completion — clear the banner.
          if (!isError && !isAbort && !isDisconnect) {
            setError(null);
          }
        }}
        sx={{
          height: 460,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error.code} · {error.source} · recoverable: {String(error.recoverable)} ·
          retryable: {String(error.retryable ?? false)}
        </Alert>
      )}
    </div>
  );
}
