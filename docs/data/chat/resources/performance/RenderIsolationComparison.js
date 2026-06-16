import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useMessage,
  useMessageIds,
} from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { demoUsers } from 'docs/data/chat/core/examples/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from 'docs/data/chat/core/examples/shared/demoUtils';

const REPLY_TEXT =
  'Granular subscriptions keep the rest of the list frozen while a single ' +
  'assistant reply streams in word by word, so only the active row re-renders ' +
  'on each flush instead of the entire thread.';

const initialMessages = [
  {
    id: 'perf-a1',
    conversationId: 'perf',
    role: 'assistant',
    status: 'sent',
    author: demoUsers.agent,
    parts: [{ type: 'text', text: 'Watch the render counters on each row.' }],
  },
  {
    id: 'perf-u1',
    conversationId: 'perf',
    role: 'user',
    status: 'sent',
    author: demoUsers.alice,
    parts: [{ type: 'text', text: 'How do granular hooks isolate re-renders?' }],
  },
  {
    id: 'perf-a2',
    conversationId: 'perf',
    role: 'assistant',
    status: 'sent',
    author: demoUsers.agent,
    parts: [{ type: 'text', text: 'Each row subscribes to a single message.' }],
  },
  {
    id: 'perf-u2',
    conversationId: 'perf',
    role: 'user',
    status: 'sent',
    author: demoUsers.alice,
    parts: [{ type: 'text', text: 'So siblings stay untouched during streaming?' }],
  },
  {
    id: 'perf-a3',
    conversationId: 'perf',
    role: 'assistant',
    status: 'sent',
    author: demoUsers.agent,
    parts: [
      { type: 'text', text: 'Exactly — send a message and compare the panes.' },
    ],
  },
  {
    id: 'perf-u3',
    conversationId: 'perf',
    role: 'user',
    status: 'sent',
    author: demoUsers.alice,
    parts: [{ type: 'text', text: 'Let us measure it.' }],
  },
];

function createStreamingAdapter() {
  return {
    async sendMessage({ message }) {
      const messageId = `perf-assistant-${message.id}`;
      void getMessageText(message);
      return createChunkStream(createTextResponseChunks(messageId, REPLY_TEXT), {
        delayMs: 60,
      });
    },
  };
}

function getRowText(message) {
  if (!message) {
    return null;
  }
  const textPart = message.parts.find((part) => part.type === 'text');
  return textPart?.type === 'text' ? textPart.text : null;
}

function RenderCountChip({ count }) {
  return (
    <Chip
      size="small"
      color={count > 1 ? 'primary' : 'default'}
      variant={count > 1 ? 'filled' : 'outlined'}
      label={`renders ${count}`}
    />
  );
}

function MessageBubble({ message, count }) {
  if (!message) {
    return null;
  }
  const isUser = message.role === 'user';
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.25,
        borderRadius: 2,
        bgcolor: isUser ? 'action.hover' : 'background.paper',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="caption" color="text.secondary">
          {message.author?.displayName ?? message.role}
        </Typography>
        <RenderCountChip count={count} />
      </Stack>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {getRowText(message)}
      </Typography>
    </Paper>
  );
}

const GranularRow = React.memo(function GranularRow({ id }) {
  const message = useMessage(id);
  const renders = React.useRef(0);
  renders.current += 1;

  return <MessageBubble message={message} count={renders.current} />;
});

function GranularPane() {
  const messageIds = useMessageIds();

  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Granular: useMessageIds + useMessage
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Only the streaming row re-renders.
      </Typography>
      <Stack spacing={1} sx={{ mt: 1.5 }}>
        {messageIds.map((id) => (
          <GranularRow key={id} id={id} />
        ))}
      </Stack>
    </Paper>
  );
}

function CoarsePane() {
  const { messages } = useChat();
  const renderCounts = React.useRef(new Map());

  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Coarse: useChat
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Every row re-renders on each flush.
      </Typography>
      <Stack spacing={1} sx={{ mt: 1.5 }}>
        {messages.map((message) => {
          const next = (renderCounts.current.get(message.id) ?? 0) + 1;
          renderCounts.current.set(message.id, next);
          return <MessageBubble key={message.id} message={message} count={next} />;
        })}
      </Stack>
    </Paper>
  );
}

function Composer() {
  const { sendMessage, isStreaming } = useChat();
  const [draft, setDraft] = React.useState('Stream a reply');

  const send = () => {
    if (draft.trim() === '') {
      return;
    }
    void sendMessage({
      conversationId: 'perf',
      author: demoUsers.alice,
      parts: [{ type: 'text', text: draft }],
    });
  };

  return (
    <Stack direction="row" spacing={1}>
      <TextField
        fullWidth
        size="small"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            send();
          }
        }}
      />
      <Button
        variant="contained"
        disabled={isStreaming || draft.trim() === ''}
        onClick={send}
        sx={{ minWidth: 'auto', px: 2 }}
      >
        <SendRoundedIcon fontSize="small" />
      </Button>
    </Stack>
  );
}

export default function RenderIsolationComparison() {
  const adapter = React.useMemo(() => createStreamingAdapter(), []);

  return (
    <ChatProvider
      adapter={adapter}
      initialMessages={initialMessages}
      initialActiveConversationId="perf"
    >
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            alignItems: 'stretch',
          }}
        >
          <GranularPane />
          <CoarsePane />
        </Box>
        <Composer />
      </Stack>
    </ChatProvider>
  );
}
