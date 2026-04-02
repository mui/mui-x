'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import {
  createTextResponseChunks,
  createChunkStream,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';
import type { ChatAdapter } from '@mui/x-chat/headless';

const slowAdapter: ChatAdapter = {
  async sendMessage({ message }) {
    const textOnly = message.parts
      .map((part) => (part.type === 'text' ? part.text : null))
      .filter(Boolean)
      .join('\n');

    const responseText =
      `Processing your request: "${textOnly || 'empty'}". ` +
      'This response is intentionally slow to demonstrate the streaming behavior. ' +
      'Each chunk arrives with a 500ms delay, so you can observe ' +
      'how the bubble grows incrementally as text streams in. ' +
      'The typing indicator should appear while streaming is in progress. ' +
      'The send button should be disabled during streaming. ' +
      'When streaming completes, the composer should be re-enabled.';

    return createChunkStream(
      createTextResponseChunks(`assistant-${message.id}`, responseText, {
        author: demoUsers.agent,
      }),
      { delayMs: 500 },
    );
  },
};

export default function SlowStreaming() {
  return (
    <ChatBox
      adapter={slowAdapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
