'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import {
  ChatProvider,
  chatSelectors,
  useChatComposer,
  useChatStatus,
  useChatStore,
  useMessage,
  useMessageIds,
} from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter();

function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) {
    return null;
  }

  const textPart = message.parts.find((part) => part.type === 'text');
  const isUser = message.role === 'user';

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        maxWidth: '75%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        bgcolor: isUser ? 'primary.main' : 'background.paper',
        color: isUser ? 'primary.contrastText' : 'text.primary',
      }}
    >
      {textPart?.type === 'text' ? textPart.text : null}
    </Paper>
  );
}

function Thread() {
  const messageIds = useMessageIds();

  return (
    <Stack spacing={1} sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} />
      ))}
    </Stack>
  );
}

function StatusFooter() {
  const { isStreaming, error } = useChatStatus();

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  if (isStreaming) {
    return <LinearProgress />;
  }
  return null;
}

function MessageCounter() {
  const store = useChatStore();
  const count = store.use(chatSelectors.messageCount);

  return <Chip size="small" label={`${count} messages`} />;
}

function CustomComposer() {
  const { value, setValue, submit, isSubmitting } = useChatComposer();

  return (
    <Stack direction="row" spacing={1} sx={{ p: 2, pt: 1 }}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Type a message…"
      />
      <Button variant="contained" onClick={() => submit()} disabled={isSubmitting}>
        Send
      </Button>
    </Stack>
  );
}

export default function HooksHeadlessChat() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          height: 420,
          display: 'flex',
          flexDirection: 'column',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: 'flex-end',
            p: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <MessageCounter />
        </Stack>
        <Thread />
        <StatusFooter />
        <CustomComposer />
      </Box>
    </ChatProvider>
  );
}
