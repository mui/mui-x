'use client';
import { ChatBox } from '@mui/x-chat';

import { createChunkStream } from 'docs/data/chat/core/examples/shared/demoUtils';

const CONVERSATION_ID = 'reasoning-demo';

const initialConversations = [{ id: CONVERSATION_ID, title: 'Reasoning' }];

const initialMessages = [
  {
    id: 'seed',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    status: 'sent',
    parts: [
      {
        type: 'reasoning',
        text: 'The user greeted me. A short, friendly reply is enough — no tools needed.',
        state: 'done',
      },
      {
        type: 'text',
        text: 'Hi! Send a message and watch the reasoning stream in above this reply.',
      },
    ],
  },
];

const adapter = {
  async sendMessage({ message }) {
    const messageId = `reply-${message.id}`;
    // Emit one chunk at a time, with a small delay, so the disclosure visibly streams.
    return createChunkStream(
      [
        { type: 'start', messageId },
        // Reasoning section — auto-expanded and labelled "Thinking…" while streaming.
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
        {
          type: 'reasoning-delta',
          id: 'r1',
          delta: 'so a concise reply works best.',
        },
        { type: 'reasoning-end', id: 'r1' },
        // Final answer — the reasoning collapses to a "Reasoning" summary as this streams.
        { type: 'text-start', id: 't1' },
        { type: 'text-delta', id: 't1', delta: 'Here is the answer, now that ' },
        { type: 'text-delta', id: 't1', delta: 'the reasoning above has finished.' },
        { type: 'text-end', id: 't1' },
        { type: 'finish', messageId },
      ],
      { delayMs: 100 },
    );
  },
};

export default function ReasoningStreamingDemo() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialConversations={initialConversations}
      initialMessages={initialMessages}
      sx={{
        height: 480,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
