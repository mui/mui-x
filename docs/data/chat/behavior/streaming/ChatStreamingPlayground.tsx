import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
} from '@mui/x-chat/headless';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation: ChatConversation = {
  id: 'streaming-playground',
  title: 'Streaming preview',
  participants: [users.me, users.assistant],
};

const greeting: ChatMessage = {
  id: 'streaming-greeting',
  conversationId: conversation.id,
  role: 'assistant',
  author: users.assistant,
  createdAt: '2026-05-03T10:00:00.000Z',
  status: 'sent',
  parts: [
    {
      type: 'text',
      text: 'Ask me anything — I will stream the reply back one word at a time.',
    },
  ],
};

let replyCounter = 0;
function nextReplyId() {
  replyCounter += 1;
  return `streaming-reply-${replyCounter}`;
}

// Mirrors the "Building a stream" snippet: start → text-start → one
// text-delta per word → text-end → finish. Honors cancel() so the composer
// stop button clears pending timers and stops enqueuing mid-stream.
function createStream(text: string, chunkDelay: number) {
  const messageId = nextReplyId();
  const words = text.split(' ');
  const chunks: ChatMessageChunk[] = [
    { type: 'start', messageId, author: users.assistant },
    { type: 'text-start', id: `${messageId}-text` },
    ...words.map((word, index) => ({
      type: 'text-delta' as const,
      id: `${messageId}-text`,
      delta: index === 0 ? word : ` ${word}`,
    })),
    { type: 'text-end', id: `${messageId}-text` },
    { type: 'finish' as const, messageId, finishReason: 'stop' },
  ];

  const timers: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;

  return new ReadableStream<ChatMessageChunk>({
    start(controller) {
      chunks.forEach((chunk, index) => {
        timers.push(
          setTimeout(
            () => {
              if (cancelled) {
                return;
              }
              controller.enqueue(chunk);
              if (index === chunks.length - 1) {
                controller.close();
              }
            },
            chunkDelay * (index + 1),
          ),
        );
      });
    },
    cancel() {
      cancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
    },
  });
}

const FLUSH_OPTIONS = [
  { label: '0 ms', value: 0 },
  { label: '16 ms (default)', value: 16 },
  { label: '100 ms', value: 100 },
  { label: '300 ms', value: 300 },
];

const DELAY_OPTIONS = [
  { label: '10 ms', value: 10 },
  { label: '40 ms', value: 40 },
  { label: '120 ms', value: 120 },
];

export default function ChatStreamingPlayground() {
  const [flushInterval, setFlushInterval] = React.useState(16);
  const [chunkDelay, setChunkDelay] = React.useState(40);

  // Read the latest chunk delay through a ref so the adapter identity stays
  // stable while still honoring the current selector value on each send.
  const chunkDelayRef = React.useRef(chunkDelay);
  chunkDelayRef.current = chunkDelay;

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async listMessages() {
        return { messages: [greeting], hasMore: false };
      },
      async sendMessage({ message }) {
        const prompt = message.parts
          .map((part) => (part.type === 'text' ? part.text : ''))
          .join(' ')
          .trim();
        const reply =
          prompt.length === 0
            ? 'Type a prompt and watch each word arrive as a separate chunk.'
            : `You said: "${prompt}". Here is a streamed reply so you can watch tokens land and feel the flush interval.`;
        return createStream(reply, chunkDelayRef.current);
      },
    }),
    [],
  );

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ flexWrap: 'wrap' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Flush interval
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={flushInterval}
            onChange={(event, value) => {
              if (value !== null) {
                setFlushInterval(value);
              }
            }}
            aria-label="Flush interval"
          >
            {FLUSH_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Chunk delay
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={chunkDelay}
            onChange={(event, value) => {
              if (value !== null) {
                setChunkDelay(value);
              }
            }}
            aria-label="Chunk delay"
          >
            {DELAY_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      <Box sx={{ height: 420 }}>
        <ChatBox
          adapter={adapter}
          currentUser={users.me}
          members={[users.me, users.assistant]}
          initialConversations={[conversation]}
          activeConversationId={conversation.id}
          streamFlushInterval={flushInterval}
          sx={{ height: '100%' }}
        />
      </Box>
    </Stack>
  );
}
