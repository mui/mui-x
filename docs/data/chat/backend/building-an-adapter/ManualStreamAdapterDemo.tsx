'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { useChat } from '@mui/x-chat/headless';
import type { ChatAdapter, ChatMessageChunk } from '@mui/x-chat/headless';
import Button from '@mui/material/Button';

const CONVERSATION_ID = 'build-adapter-demo';

const initialConversations = [{ id: CONVERSATION_ID, title: 'Hand-rolled adapter' }];

const initialMessages = [
  {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
      {
        type: 'text' as const,
        text: 'Send a message to watch a hand-built ReadableStream stream the reply. Press Stop mid-stream to see the abort signal in action.',
      },
    ],
  },
];

const REPLY =
  'Here is a reply streamed one word at a time by a hand-rolled adapter. ' +
  'Each word arrives as its own text-delta chunk. ' +
  'Press Stop at any point to fire the abort signal and halt the stream.';

const adapter: ChatAdapter = {
  async sendMessage({ signal }) {
    const messageId = `assistant-${Date.now()}`;
    const textId = `${messageId}-text`;
    const words = REPLY.split(' ');

    return new ReadableStream<ChatMessageChunk>({
      start(controller) {
        controller.enqueue({ type: 'start', messageId });
        controller.enqueue({ type: 'text-start', id: textId });

        let index = 0;
        let closed = false;

        const interval = setInterval(() => {
          if (closed) {
            return;
          }
          if (index < words.length) {
            const delta = index === 0 ? words[index] : ` ${words[index]}`;
            controller.enqueue({ type: 'text-delta', id: textId, delta });
            index += 1;
            return;
          }
          clearInterval(interval);
          closed = true;
          controller.enqueue({ type: 'text-end', id: textId });
          controller.enqueue({ type: 'finish', messageId });
          controller.close();
        }, 40);

        signal.addEventListener('abort', () => {
          if (closed) {
            return;
          }
          clearInterval(interval);
          closed = true;
          controller.enqueue({ type: 'text-end', id: textId });
          controller.enqueue({ type: 'abort', messageId });
          controller.close();
        });
      },
    });
  },
};

function StopStreamingButton() {
  const { isStreaming, stopStreaming } = useChat();

  return (
    <Button
      size="small"
      variant="outlined"
      disabled={!isStreaming}
      onClick={() => stopStreaming()}
      sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
    >
      Stop
    </Button>
  );
}

export default function ManualStreamAdapterDemo() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialConversations={initialConversations}
      initialMessages={initialMessages}
      sx={{
        position: 'relative',
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <StopStreamingButton />
    </ChatBox>
  );
}
