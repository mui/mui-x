import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ChatBox } from '@mui/x-chat';

import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation = {
  id: 'streaming-indicator-demo',
  title: 'Streaming indicator preview',
  participants: [users.me, users.assistant],
};

const greeting = {
  id: 'streaming-indicator-greeting',
  conversationId: conversation.id,
  role: 'assistant',
  author: users.assistant,
  createdAt: '2026-05-03T10:00:00.000Z',
  status: 'sent',
  parts: [
    {
      type: 'text',
      text: 'Send a message — the dots appear while I "think", then follow the reply as it streams.',
    },
  ],
};

let replyCounter = 0;
function nextReplyId() {
  replyCounter += 1;
  return `streaming-indicator-reply-${replyCounter}`;
}

// `thinkingDelay` holds back the `start` chunk to simulate model latency —
// that gap is the indicator's waiting phase. Once `start` lands, the dots
// move inside the assistant bubble until `finish`.
function createStream(text, thinkingDelay) {
  const messageId = nextReplyId();
  const words = text.split(' ');
  const chunks = [
    { type: 'start', messageId, author: users.assistant },
    { type: 'text-start', id: `${messageId}-text` },
    ...words.map((word, index) => ({
      type: 'text-delta',
      id: `${messageId}-text`,
      delta: index === 0 ? word : ` ${word}`,
    })),
    { type: 'text-end', id: `${messageId}-text` },
    { type: 'finish', messageId, finishReason: 'stop' },
  ];

  const timers = [];
  let cancelled = false;

  return new ReadableStream({
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
            thinkingDelay + 120 * index,
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

const MODE_OPTIONS = [
  { label: "'auto' (default)", value: 'auto' },
  { label: 'true (always)', value: 'always' },
  { label: 'false (never)', value: 'never' },
];

const FEATURE_VALUE = {
  auto: 'auto',
  always: true,
  never: false,
};

const THINKING_OPTIONS = [
  { label: '1 s', value: 1000 },
  { label: '2.5 s', value: 2500 },
  { label: '5 s', value: 5000 },
];

export default function ChatStreamingIndicatorDemo() {
  const [mode, setMode] = React.useState('auto');
  const [thinkingDelay, setThinkingDelay] = React.useState(2500);

  // Read the latest delay through a ref so the adapter identity stays stable
  // while still honoring the current selector value on each send.
  const thinkingDelayRef = React.useRef(thinkingDelay);
  thinkingDelayRef.current = thinkingDelay;

  const adapter = React.useMemo(
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
            ? 'The dots covered the silence while this reply was on its way.'
            : `You said: "${prompt}". The animated dots bridged the wait, and now they trail this reply until it finishes streaming.`;
        return createStream(reply, thinkingDelayRef.current);
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
            features.streamingIndicator
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={mode}
            onChange={(event, value) => {
              if (value !== null) {
                setMode(value);
              }
            }}
            aria-label="Streaming indicator mode"
          >
            {MODE_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Thinking delay
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={thinkingDelay}
            onChange={(event, value) => {
              if (value !== null) {
                setThinkingDelay(value);
              }
            }}
            aria-label="Thinking delay"
          >
            {THINKING_OPTIONS.map((option) => (
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
          features={{ streamingIndicator: FEATURE_VALUE[mode] }}
          sx={{ height: '100%' }}
        />
      </Box>
    </Stack>
  );
}
