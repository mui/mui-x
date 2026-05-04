import * as React from 'react';
import { Box, Button, ButtonGroup, Chip, Paper, Stack, Typography } from '@mui/material';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
} from '@mui/x-chat/headless';

type FrameWidth = 'desktop' | 'tablet' | 'mobile';

const frameWidths: Record<FrameWidth, number> = {
  desktop: 920,
  tablet: 540,
  mobile: 360,
};

const users = {
  me: {
    id: 'you',
    displayName: 'You',
    role: 'user' as const,
  },
  assistant: {
    id: 'assistant',
    displayName: 'MUI Assistant',
    role: 'assistant' as const,
  },
  alice: {
    id: 'alice',
    displayName: 'Alice Chen',
    role: 'user' as const,
  },
  marco: {
    id: 'marco',
    displayName: 'Marco Diaz',
    role: 'user' as const,
  },
};

const conversations: ChatConversation[] = [
  {
    id: 'component-questions',
    title: 'Component questions',
    subtitle: 'Container queries for the sidebar',
    participants: [users.alice, users.assistant],
    readState: 'unread',
    unreadCount: 2,
    lastMessageAt: '2026-04-17T09:15:00.000Z',
  },
  {
    id: 'theme-help',
    title: 'Theme help',
    subtitle: 'Keeping the drawer inside the component',
    participants: [users.marco, users.assistant],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-04-16T18:02:00.000Z',
  },
];

const initialThreads: Record<string, ChatMessage[]> = {
  'component-questions': [
    {
      id: 'cq-1',
      conversationId: 'component-questions',
      role: 'user',
      author: users.alice,
      createdAt: '2026-04-17T09:10:00.000Z',
      status: 'read',
      parts: [
        {
          type: 'text',
          text: 'Can the mobile layout follow the chat box width instead of the page width?',
        },
      ],
    },
    {
      id: 'cq-2',
      conversationId: 'component-questions',
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-04-17T09:12:00.000Z',
      status: 'read',
      parts: [
        {
          type: 'text',
          text: 'Yes. This playground lets you shrink the frame without changing the viewport so container queries are easy to verify.',
        },
      ],
    },
    {
      id: 'cq-3',
      conversationId: 'component-questions',
      role: 'user',
      author: users.me,
      createdAt: '2026-04-17T09:15:00.000Z',
      status: 'sent',
      parts: [
        {
          type: 'text',
          text: 'Open the menu in mobile mode and check that the drawer stays inside the bordered frame.',
        },
      ],
    },
  ],
  'theme-help': [
    {
      id: 'th-1',
      conversationId: 'theme-help',
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-04-16T18:02:00.000Z',
      status: 'read',
      parts: [
        {
          type: 'text',
          text: 'The page panel on the right should remain visible when the conversation drawer opens.',
        },
      ],
    },
  ],
};

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function splitText(text: string, size = 24) {
  const chunks: string[] = [];

  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }

  return chunks;
}

function createStream(messageId: string, text: string) {
  const chunks: ChatMessageChunk[] = [
    { type: 'start', messageId, author: users.assistant },
    { type: 'text-start', id: `${messageId}-text` },
    ...splitText(text).map((delta) => ({
      type: 'text-delta' as const,
      id: `${messageId}-text`,
      delta,
    })),
    { type: 'text-end', id: `${messageId}-text` },
    { type: 'finish', messageId, finishReason: 'stop' },
  ];

  return new ReadableStream<ChatMessageChunk>({
    start(controller) {
      chunks.forEach((chunk, index) => {
        setTimeout(
          () => {
            controller.enqueue(chunk);
            if (index === chunks.length - 1) {
              controller.close();
            }
          },
          120 * (index + 1),
        );
      });
    },
  });
}

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const input = message.parts
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join(' ')
      .trim();

    return createStream(
      randomId('reply'),
      input.length === 0
        ? 'Try sending any message. The sidebar behavior is the main thing to inspect here.'
        : `Replying inside the constrained frame. Your last message was: "${input}".`,
    );
  },
};

export default function App() {
  const [frameWidth, setFrameWidth] = React.useState<FrameWidth>('desktop');
  const threadMapRef = React.useRef(initialThreads);
  const adapterWithMessages = React.useMemo<ChatAdapter>(
    () => ({
      ...adapter,
      async listMessages({ conversationId }) {
        return {
          messages: threadMapRef.current[conversationId] ?? [],
          hasMore: false,
        };
      },
    }),
    [],
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        color: 'text.primary',
        backgroundImage:
          'linear-gradient(180deg, rgba(15,23,42,0.04), rgba(15,23,42,0) 220px), radial-gradient(circle at top left, rgba(25,118,210,0.08), transparent 40%)',
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between' }}
          >
            <Stack spacing={1}>
              <Typography variant="overline" color="primary.main">
                x-chat mobile layout playground
              </Typography>
              <Typography variant="h4">Resize the chat frame, not the page.</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                Use the width toggles to force the chat box into desktop, tablet, and mobile states.
                In mobile mode the conversation drawer should stay inside the bordered chat frame
                and not cover the page content panel.
              </Typography>
            </Stack>
            <Stack spacing={1} sx={{ alignItems: { xs: 'flex-start', lg: 'flex-end' } }}>
              <Chip
                label={`frame width: ${frameWidths[frameWidth]}px`}
                color="primary"
                variant="outlined"
              />
              <ButtonGroup variant="outlined" size="small" aria-label="Set frame width">
                <Button onClick={() => setFrameWidth('desktop')}>Desktop</Button>
                <Button onClick={() => setFrameWidth('tablet')}>Tablet</Button>
                <Button onClick={() => setFrameWidth('mobile')}>Mobile</Button>
              </ButtonGroup>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' },
              alignItems: 'start',
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 1.5, md: 2 },
                bgcolor: 'background.default',
                borderRadius: 3,
              }}
            >
              <Box
                data-testid="chat-frame"
                sx={{
                  width: '100%',
                  maxWidth: frameWidths[frameWidth],
                  transition: 'max-width 200ms ease',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: 720,
                    overflow: 'hidden',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                  }}
                >
                  <ChatBox
                    adapter={adapterWithMessages}
                    conversations={conversations}
                    initialActiveConversationId={conversations[0].id}
                    sx={{ height: '100%' }}
                  />
                </Paper>
              </Box>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: 'background.paper',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">Page context panel</Typography>
                <Typography variant="body2" color="text.secondary">
                  This panel intentionally sits outside the chat box. If the mobile drawer is scoped
                  correctly, it should never cover this content when the frame is set to mobile and
                  the conversation menu is opened.
                </Typography>
                <Stack spacing={1}>
                  <Chip label="Expected in mobile mode" />
                  <Typography variant="body2" color="text.secondary">
                    1. The sidebar disappears from the main layout.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    2. A menu icon appears in the conversation header.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    3. The drawer opens only inside the bordered chat surface.
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
