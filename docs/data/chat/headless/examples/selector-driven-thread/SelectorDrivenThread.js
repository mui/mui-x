import * as React from 'react';
import {
  ChatProvider,
  useConversation,
  useConversations,
  useMessage,
  useMessageIds,
} from '@mui/x-chat-headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { demoUsers } from '../shared/demoData';

function createMessages() {
  return Array.from({ length: 14 }, (_, index) => ({
    id: `selector-${index + 1}`,
    conversationId: 'selectors',
    role: index % 2 === 0 ? 'assistant' : 'user',
    author: index % 2 === 0 ? demoUsers.agent : demoUsers.alice,
    status: 'sent',
    parts: [
      {
        type: 'text',
        text: `Row ${index + 1} is subscribed independently.`,
      },
    ],
  }));
}

const MessageRow = React.memo(function MessageRow({ id }) {
  const message = useMessage(id);
  const renders = React.useRef(0);

  React.useEffect(() => {
    renders.current += 1;
  });

  if (!message) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {message.id} &middot; renders {renders.current}
      </Typography>
      <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
        {message.author?.displayName ?? message.role}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {message.parts[0]?.type === 'text' ? message.parts[0].text : null}
      </Typography>
    </Paper>
  );
});

function SelectorThread() {
  const messageIds = useMessageIds();
  const conversations = useConversations();
  const conversation = useConversation('selectors');

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {conversation?.title ?? 'Selector lab'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update one controlled message from the parent to see only the matching row
          rerender.
        </Typography>
      </Box>

      {/* Conversations */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {conversations.map((conv) => (
            <Chip
              key={conv.id}
              label={conv.title ?? conv.id}
              size="small"
              variant={conv.id === 'selectors' ? 'filled' : 'outlined'}
              color={conv.id === 'selectors' ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      </Box>

      {/* Message rows */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: 480,
          overflow: 'auto',
        }}
      >
        {messageIds.map((id) => (
          <MessageRow key={id} id={id} />
        ))}
      </Box>
    </Paper>
  );
}

export default function SelectorDrivenThread() {
  const [messages, setMessages] = React.useState(createMessages);
  const [conversations] = React.useState([
    {
      id: 'selectors',
      title: 'Selector-driven thread',
      subtitle: 'Row-level subscriptions',
    },
  ]);

  const adapter = React.useMemo(
    () => ({
      async sendMessage() {
        return new ReadableStream({
          start(controller) {
            controller.close();
          },
        });
      },
    }),
    [],
  );

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setMessages((previous) =>
              previous.map((message) =>
                message.id === 'selector-6'
                  ? {
                      ...message,
                      parts: [
                        {
                          type: 'text',
                          text: 'Only this row changed in the controlled state.',
                        },
                      ],
                    }
                  : message,
              ),
            );
          }}
        >
          Update message 6
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setMessages((previous) => [
              ...previous,
              {
                id: `selector-${previous.length + 1}`,
                conversationId: 'selectors',
                role: 'assistant',
                author: demoUsers.agent,
                status: 'sent',
                parts: [
                  {
                    type: 'text',
                    text: 'A new row appears without rerendering every item.',
                  },
                ],
              },
            ]);
          }}
        >
          Append one row
        </Button>
      </Stack>
      <ChatProvider
        adapter={adapter}
        messages={messages}
        conversations={conversations}
        activeConversationId="selectors"
      >
        <SelectorThread />
      </ChatProvider>
    </Stack>
  );
}
