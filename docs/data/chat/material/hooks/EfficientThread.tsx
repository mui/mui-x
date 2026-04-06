'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  ChatProvider,
  useMessageIds,
  useMessage,
  useChatComposer,
} from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) {
    return null;
  }

  const textPart = message.parts.find((p) => p.type === 'text');
  return (
    <Paper
      sx={{
        p: 1.5,
        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
        color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
      }}
    >
      {textPart?.type === 'text' ? textPart.text : null}
    </Paper>
  );
}

function Thread() {
  const messageIds = useMessageIds();

  return (
    <Stack spacing={1} sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} />
      ))}
    </Stack>
  );
}

function SimpleComposer() {
  const { value, setValue, submit, isSubmitting } = useChatComposer();

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}
    >
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
        placeholder="Type a message..."
      />
      <Button variant="contained" onClick={submit} disabled={isSubmitting}>
        Send
      </Button>
    </Stack>
  );
}

const adapter = createEchoAdapter();

export default function EfficientThread() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Thread />
        <SimpleComposer />
      </Box>
    </ChatProvider>
  );
}
