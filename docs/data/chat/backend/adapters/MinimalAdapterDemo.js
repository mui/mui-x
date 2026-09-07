'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import {
  minimalConversation,
  minimalMessages,
  demoUsers,
} from 'docs/data/chat/core/examples/shared/demoData';
import { randomId } from 'docs/data/chat/core/examples/shared/demoUtils';

function splitIntoDeltas(text, size = 15) {
  const pieces = [];
  for (let index = 0; index < text.length; index += size) {
    pieces.push(text.slice(index, index + size));
  }
  return pieces;
}

// Minimal adapter — sendMessage is the only required method.
const adapter = {
  async sendMessage({ signal }) {
    const messageId = randomId();
    const textId = randomId();
    const reply =
      'This reply is hand-rolled from the documented chunk shapes: a start chunk, ' +
      'a text-start, several text-delta chunks, a text-end, and a finish chunk. ' +
      'Press stop mid-stream to see the abort signal honored.';

    // Build the full chunk sequence up front, then emit it one chunk at a time.
    const chunks = [
      { type: 'start', messageId, author: demoUsers.agent },
      { type: 'text-start', id: textId },
      ...splitIntoDeltas(reply).map((delta) => ({
        type: 'text-delta',
        id: textId,
        delta,
      })),
      { type: 'text-end', id: textId },
      { type: 'finish', messageId },
    ];

    return new ReadableStream({
      start(controller) {
        let index = 0;
        let timer;

        const stop = () => {
          // On abort, stop enqueuing and close the stream cleanly.
          clearTimeout(timer);
          signal.removeEventListener('abort', stop);
          try {
            controller.close();
          } catch {
            // Already closed by the consumer; ignore.
          }
        };

        const emitNext = () => {
          if (signal.aborted || index >= chunks.length) {
            stop();
            return;
          }
          controller.enqueue(chunks[index]);
          index += 1;
          // ~80ms apart so the bubble visibly grows delta-by-delta.
          timer = setTimeout(emitNext, 80);
        };

        signal.addEventListener('abort', stop, { once: true });
        emitNext();
      },
    });
  },
};

export default function MinimalAdapterDemo() {
  return (
    <ChatBox
      adapter={adapter}
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
