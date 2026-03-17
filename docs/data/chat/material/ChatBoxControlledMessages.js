import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
} from 'docsx/data/chat/material/shared/demoUtils';

const adapter = {
  async sendMessage({ message }) {
    const text = message.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join(' ');

    return createChunkStream(
      createTextResponseChunks(
        `resp-${message.id}`,
        `You said: "${text}". Here is a controlled response streamed back from the adapter.`,
      ),
    );
  },
};

export default function ChatBoxControlledMessages() {
  const [messages, setMessages] = React.useState([
    {
      id: 'm1',
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-17T09:00:00.000Z',
      parts: [
        {
          type: 'text',
          text: 'This thread uses controlled messages. Try sending a reply.',
        },
      ],
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ height: 480 }}>
          <ChatBox
            adapter={adapter}
            messages={messages}
            onMessagesChange={setMessages}
          />
        </Box>
      </Paper>
      <Typography color="text.secondary" variant="caption">
        Controlled message count: {messages.length}
      </Typography>
    </Box>
  );
}
