'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, keyframes } from '@mui/material/styles';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatConversation as ChatConversationModel,
  ChatMessage as ChatMessageModel,
  ChatUser,
} from '@mui/x-chat/headless';
import {
  createChunkStream,
  createTextResponseChunks,
  randomId,
  syncConversationPreview,
} from '../../../../../../data/chat/core/examples/shared/demoUtils';

function createAvatarDataUrl(label: string, background: string, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createTextMessage(params: {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
  author: ChatUser;
  status?: ChatMessageModel['status'];
}): ChatMessageModel {
  const { id, conversationId, role, text, createdAt, author, status = 'sent' } = params;

  return {
    id,
    conversationId,
    role,
    status,
    createdAt,
    author,
    parts: [{ type: 'text', text }],
  };
}

const supportAgent: ChatUser = {
  id: 'support',
  displayName: 'Acme Support',
  avatarUrl: createAvatarDataUrl('AS', '#635bff'),
  role: 'assistant',
};

const billingAgent: ChatUser = {
  id: 'billing',
  displayName: 'Billing Team',
  avatarUrl: createAvatarDataUrl('BT', '#00897b'),
  role: 'assistant',
};

const productAgent: ChatUser = {
  id: 'product',
  displayName: 'Product Help',
  avatarUrl: createAvatarDataUrl('PH', '#f57c00'),
  role: 'assistant',
};

const you: ChatUser = {
  id: 'you',
  displayName: 'You',
  avatarUrl: createAvatarDataUrl('Y', '#1976d2'),
  role: 'user',
};

const conversationsSeed: ChatConversationModel[] = [
  {
    id: 'support-chat',
    title: 'Acme Support',
    subtitle: 'We typically reply in a few minutes',
    participants: [you, supportAgent],
    readState: 'unread',
    unreadCount: 2,
    lastMessageAt: '2026-03-31T10:02:00.000Z',
  },
  {
    id: 'billing-chat',
    title: 'Billing questions',
    subtitle: 'Invoices, plans, and payment methods',
    participants: [you, billingAgent],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-31T09:20:00.000Z',
  },
  {
    id: 'product-chat',
    title: 'Product onboarding',
    subtitle: 'Setup guidance and best practices',
    participants: [you, productAgent],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-30T16:45:00.000Z',
  },
];

const threadSeed: Record<string, ChatMessageModel[]> = {
  'support-chat': [
    createTextMessage({
      id: 'w-a1',
      conversationId: 'support-chat',
      role: 'assistant',
      author: supportAgent,
      createdAt: '2026-03-31T10:00:00.000Z',
      text: "Hey there! I'm here to help with questions about our products or services.",
    }),
    createTextMessage({
      id: 'w-u1',
      conversationId: 'support-chat',
      role: 'user',
      author: you,
      createdAt: '2026-03-31T10:01:00.000Z',
      text: 'Hi! I just signed up for the Pro plan. How do I set up my first project?',
    }),
    createTextMessage({
      id: 'w-a2',
      conversationId: 'support-chat',
      role: 'assistant',
      author: supportAgent,
      createdAt: '2026-03-31T10:02:00.000Z',
      text: 'Start in your dashboard, create a new project, then invite teammates from settings.',
    }),
  ],
  'billing-chat': [
    createTextMessage({
      id: 'b-a1',
      conversationId: 'billing-chat',
      role: 'assistant',
      author: billingAgent,
      createdAt: '2026-03-31T09:18:00.000Z',
      text: 'Need help with billing? We can assist with invoices, VAT, and plan changes.',
    }),
    createTextMessage({
      id: 'b-u1',
      conversationId: 'billing-chat',
      role: 'user',
      author: you,
      createdAt: '2026-03-31T09:20:00.000Z',
      text: 'Where can I update the card on file?',
    }),
  ],
  'product-chat': [
    createTextMessage({
      id: 'p-a1',
      conversationId: 'product-chat',
      role: 'assistant',
      author: productAgent,
      createdAt: '2026-03-30T16:40:00.000Z',
      text: 'We can walk you through your first project, integrations, and team setup.',
    }),
    createTextMessage({
      id: 'p-u1',
      conversationId: 'product-chat',
      role: 'user',
      author: you,
      createdAt: '2026-03-30T16:45:00.000Z',
      text: 'Do you have a checklist for onboarding a new workspace?',
    }),
  ],
};

const scriptedRepliesByConversation: Record<string, { text: string; author: ChatUser }[]> = {
  'support-chat': [
    {
      text: 'You can also invite teammates from Settings -> Members once the project is created.',
      author: supportAgent,
    },
    {
      text: 'If you want, I can point you to the quickest setup path for your use case.',
      author: supportAgent,
    },
  ],
  'billing-chat': [
    {
      text: 'Open Billing -> Payment methods and choose Update card.',
      author: billingAgent,
    },
    {
      text: 'If your plan is annual, I can also help explain invoice timing.',
      author: billingAgent,
    },
  ],
  'product-chat': [
    {
      text: 'Yes. Start with workspace settings, create the first project, then connect integrations.',
      author: productAgent,
    },
    {
      text: 'I recommend inviting owners first so permissions are in place before rollout.',
      author: productAgent,
    },
  ],
};

const replyIndexByConversation: Record<string, number> = {};

function createSupportAdapter(): ChatAdapter {
  return {
    async sendMessage({ conversationId }) {
      const conversationKey = conversationId ?? conversationsSeed[0].id;
      const replies =
        scriptedRepliesByConversation[conversationKey] ??
        scriptedRepliesByConversation['support-chat'];
      const nextIndex = replyIndexByConversation[conversationKey] ?? 0;
      const reply = replies[nextIndex % replies.length];
      replyIndexByConversation[conversationKey] = nextIndex + 1;
      const messageId = randomId();

      return createChunkStream(
        createTextResponseChunks(messageId, reply.text, { author: reply.author }),
        { delayMs: 140 },
      );
    },
  };
}

/* ---------- Pulse animation for FAB ---------- */
const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.4; }
  70% { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
`;

/* ---------- Message entrance animation ---------- */
const messageSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* ---------- Hypothetical Data Grid backdrop (DataGrid skeleton overlay) ---------- */
const BACKDROP_COLUMNS: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1.4 },
  { field: 'email', headerName: 'Email', flex: 1.6 },
  { field: 'role', headerName: 'Role', flex: 0.9 },
  { field: 'status', headerName: 'Status', flex: 0.9 },
  { field: 'lastActive', headerName: 'Last active', flex: 1.1 },
  { field: 'created', headerName: 'Created', flex: 1.1 },
];

/* ---------- Widget home greeting header ---------- */
function WidgetHomeHeader({ onClose }: { onClose: () => void }) {
  return (
    <Box
      sx={(theme) => ({
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.85)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'primary.contrastText',
        px: 2.5,
        pt: 2.5,
        pb: 5,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        },
      })}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: '100%' }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#4ade80',
              boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)',
            }}
          />
          <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: 0.2 }}>
            Acme Support
          </Typography>
        </Stack>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: 'inherit',
            background: 'rgba(255,255,255,0.12)',
            border: 'none',
            borderRadius: '50%',
            backdropFilter: 'blur(8px)',
            '&:hover': { background: 'rgba(255,255,255,0.22)' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Typography
        sx={{
          mt: 3,
          fontSize: 22,
          lineHeight: 1.2,
          fontWeight: 800,
          letterSpacing: -0.3,
        }}
      >
        Hi there. How can we help?
      </Typography>
      <Typography
        sx={{
          mt: 0.75,
          fontSize: 13,
          opacity: 0.75,
          fontWeight: 400,
        }}
      >
        We typically reply in a few minutes
      </Typography>
    </Box>
  );
}

function NewConversationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      size="small"
      variant="contained"
      endIcon={<HelpOutlineIcon fontSize="small" />}
      sx={{
        borderRadius: 6,
        textTransform: 'none',
        px: 2.5,
        fontWeight: 600,
        boxShadow: 'none',
        transition: 'transform 0.2s ease, background-color 0.2s ease',
        '&:hover': {
          boxShadow: 'none',
          transform: 'scale(1.03)',
        },
        '&:active': {
          transform: 'scale(0.97)',
        },
      }}
    >
      Ask a question
    </Button>
  );
}

export default function WidgetDemo() {
  const [open, setOpen] = React.useState(true);
  const [activeConversationId, setActiveConversationId] = React.useState<string | undefined>(
    undefined,
  );
  const [conversations, setConversations] = React.useState<ChatConversationModel[]>(() =>
    conversationsSeed.map((conversation) => ({ ...conversation })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessageModel[]>>(() =>
    Object.fromEntries(
      Object.entries(threadSeed).map(([id, messages]) => [
        id,
        messages.map((message) => ({ ...message })),
      ]),
    ),
  );

  const adapter = React.useMemo(() => createSupportAdapter(), []);
  const messages = activeConversationId == null ? [] : (threads[activeConversationId] ?? []);
  const isHome = activeConversationId == null;

  const handleStartConversation = React.useCallback(() => {
    const conversationId = randomId();
    const createdAt = new Date().toISOString();
    const conversation: ChatConversationModel = {
      id: conversationId,
      title: 'New conversation',
      subtitle: 'Ask us anything',
      participants: [you, supportAgent],
      readState: 'read',
      unreadCount: 0,
      lastMessageAt: createdAt,
    };
    const initialMessages = [
      createTextMessage({
        id: randomId(),
        conversationId,
        role: 'assistant',
        author: supportAgent,
        createdAt,
        text: 'Hi. This is a new thread. Ask anything and we will help from here.',
      }),
    ];

    setConversations((prev) => [conversation, ...prev]);
    setThreads((prev) => ({ ...prev, [conversationId]: initialMessages }));
    setActiveConversationId(conversationId);
  }, []);

  const handleMessagesChange = React.useCallback(
    (nextMessages: ChatMessageModel[]) => {
      if (activeConversationId == null) {
        return;
      }
      setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
      setConversations((prev) => syncConversationPreview(prev, activeConversationId, nextMessages));
    },
    [activeConversationId],
  );

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* ---------- Hypothetical Data Grid backdrop ---------- */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          p: 3,
          pointerEvents: 'none',
        }}
      >
        <DataGrid loading rows={[]} columns={BACKDROP_COLUMNS} />
      </Box>
      {/* ---------- Chat widget ---------- */}
      <Grow in={open} style={{ transformOrigin: 'bottom right' }} mountOnEnter unmountOnExit>
        <Paper
          elevation={0}
          sx={(theme) => ({
            position: 'absolute',
            bottom: 80,
            right: 16,
            width: 388,
            height: 640,
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.6),
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 24px 80px ${alpha('#000', 0.5)}, 0 8px 24px ${alpha('#000', 0.3)}`
                : `0 24px 80px ${alpha(theme.palette.primary.main, 0.12)}, 0 8px 24px ${alpha('#000', 0.08)}`,
          })}
        >
          {isHome && <WidgetHomeHeader onClose={() => setOpen(false)} />}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              ...(isHome && {
                mt: -2.5,
                mx: 1,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
                zIndex: 1,
              }),
            }}
          >
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <ChatBox
                adapter={adapter}
                conversations={conversations}
                messages={messages}
                activeConversationId={activeConversationId}
                onActiveConversationChange={(nextId) =>
                  setActiveConversationId(nextId ?? undefined)
                }
                onMessagesChange={handleMessagesChange}
                currentUser={you}
                layoutMode="split"
                features={{ conversationList: true, helperText: false }}
                slotProps={{
                  conversationList: {
                    slotProps: {
                      viewport: {
                        sx: { px: 1, pt: 0.5, pb: 1 },
                      } as any,
                      root: {
                        'aria-label': 'Conversations',
                        sx: { p: 0 },
                      } as any,
                    },
                  },

                  messageList: {
                    slotProps: {
                      messageListContent: {
                        sx: { py: 1.5 },
                      } as any,
                    },
                  },

                  messageGroup: {
                    sx: {
                      animation: `${messageSlideIn} 0.3s ease-out both`,
                    },
                  },

                  composerRoot: {
                    variant: 'compact',
                    sx: { mx: 1.5, mb: 1.5, mt: 0 },
                  },
                }}
              />
            </Box>
            {isHome && (
              <Box
                sx={{
                  px: 2,
                  pt: 1,
                  pb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <NewConversationButton onClick={handleStartConversation} />
              </Box>
            )}
          </Box>
        </Paper>
      </Grow>
      {/* ---------- FAB with pulse ring ---------- */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
      >
        {!open && (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
              animation: `${pulseRing} 2s ease-out infinite`,
              pointerEvents: 'none',
            })}
          />
        )}
        <Fab
          color="primary"
          onClick={() => setOpen((prev) => !prev)}
          sx={(theme) => ({
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`
                : `0 4px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s',
            '&:hover': {
              transform: 'scale(1.06)',
              boxShadow: `0 6px 28px ${alpha(theme.palette.primary.main, 0.45)}`,
            },
          })}
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: 24,
              height: 24,
            }}
          >
            <CloseIcon
              sx={{
                position: 'absolute',
                transition: 'opacity 0.25s, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: open ? 1 : 0,
                transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            />
            <ChatBubbleOutlineIcon
              sx={{
                position: 'absolute',
                transition: 'opacity 0.25s, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: open ? 0 : 1,
                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            />
          </Box>
        </Fab>
      </Box>
    </Box>
  );
}
