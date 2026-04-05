'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, keyframes } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import InsightsIcon from '@mui/icons-material/Insights';
import {
  ChatComposer,
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
  ChatConversationList,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageList,
  ChatMessageInlineMeta,
} from '@mui/x-chat';
import {
  ChatProvider,
  useMessageIds,
  type ChatAdapter,
  type ChatConversation as ChatConversationModel,
  type ChatMessage as ChatMessageModel,
  type ChatUser,
} from '@mui/x-chat/headless';
import {
  createChunkStream,
  createTextResponseChunks,
  randomId,
  syncConversationPreview,
} from '../../../../../../data/chat/material/examples/shared/demoUtils';

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

const noConversationSelected = '__widget-home__';

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

/* ---------- Background dashboard metric card ---------- */
function MetricCard({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: `0 2px 12px ${alpha(theme.palette.text.primary, 0.06)}`,
        },
      })}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: 0.3 }}
        >
          {label}
        </Typography>
        <Box sx={{ color: 'text.disabled', '& .MuiSvgIcon-root': { fontSize: 16 } }}>{icon}</Box>
      </Stack>
      <Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 500 }}>
        {change}
      </Typography>
    </Box>
  );
}

/* ---------- Background activity row ---------- */
function ActivityRow({ name, action, time }: { name: string; action: string; time: string }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 1.5,
        py: 1,
        '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={(theme) => ({
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'primary.main' }}>
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Typography>
        </Box>
        <div>
          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', lineHeight: 1.3 }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
            {action}
          </Typography>
        </div>
      </Stack>
      <Typography variant="caption" color="text.disabled">
        {time}
      </Typography>
    </Stack>
  );
}

/* ---------- Widget header ---------- */
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
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

function WidgetConversationHome({ onStartConversation }: { onStartConversation: () => void }) {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, pt: 1, pb: 1 }}>
        <ChatConversationList
          slotProps={{
            scroller: {
              sx: {
                width: '100%',
                borderRight: 'none',
                bgcolor: 'transparent',
              },
            },
            viewport: {
              sx: {
                px: 1,
                pt: 0.5,
                pb: 1,
              },
            },
            root: {
              'aria-label': 'Conversations',
              sx: {
                p: 0,
              },
            },
          }}
        />
      </Box>
      <Box sx={{ px: 2, pt: 1, pb: 2 }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <NewConversationButton onClick={onStartConversation} />
        </Box>
      </Box>
    </Box>
  );
}

function WidgetThreadHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  return (
    <ChatConversationHeader sx={{ alignItems: 'center', width: '100%', px: 1 }}>
      <IconButton size="small" onClick={onBack} sx={{ ml: 1, borderRadius: '50%' }}>
        <ArrowBackIcon fontSize="small" />
      </IconButton>
      <ChatConversationHeaderInfo>
        <ChatConversationTitle>{title}</ChatConversationTitle>
        <ChatConversationSubtitle>{subtitle}</ChatConversationSubtitle>
      </ChatConversationHeaderInfo>
    </ChatConversationHeader>
  );
}

function FloatingSupportThread({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    (item: { id: string; index: number }) => (
      <Box
        key={item.id}
        sx={{
          animation: `${messageSlideIn} 0.3s ease-out both`,
          animationDelay: `${Math.min(item.index * 0.05, 0.3)}s`,
        }}
      >
        <ChatMessageGroup messageId={item.id}>
          <ChatMessage messageId={item.id}>
            <ChatMessageAvatar />
            <ChatMessageContent afterContent={<ChatMessageInlineMeta />} />
          </ChatMessage>
        </ChatMessageGroup>
      </Box>
    ),
    [],
  );

  return (
    <ChatConversation sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <WidgetThreadHeader title={title} subtitle={subtitle} onBack={onBack} />
      <ChatMessageList
        renderItem={renderItem}
        items={messageIds}
        slotProps={{
          messageListContent: {
            sx: {
              py: 1.5,
            },
          },
        }}
      />
      <ChatComposer variant="compact" sx={{ mx: 1.5, mb: 1.5, mt: 0 }} />
    </ChatConversation>
  );
}

function FloatingSupportWidget({
  activeConversation,
  onBack,
  onClose,
  onStartConversation,
}: {
  activeConversation: ChatConversationModel | undefined;
  onBack: () => void;
  onClose: () => void;
  onStartConversation: () => void;
}) {
  const isThreadOpen = activeConversation != null;
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={containerRef}
      sx={(theme) => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.85)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        overflow: 'hidden',
        position: 'relative',
      })}
    >
      {/* Home view */}
      <Fade in={!isThreadOpen} timeout={250} unmountOnExit>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <WidgetHomeHeader onClose={onClose} />
          <Box
            sx={{
              mt: -2.5,
              flex: 1,
              minHeight: 0,
              mx: 1,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
              zIndex: 1,
            }}
          >
            <WidgetConversationHome onStartConversation={onStartConversation} />
          </Box>
        </Box>
      </Fade>

      {/* Thread view - slides in from the right */}
      <Slide
        direction="left"
        in={isThreadOpen}
        container={containerRef.current}
        timeout={300}
        easing={{ enter: 'cubic-bezier(0.2, 0, 0, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)' }}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'background.paper',
            zIndex: 2,
          }}
        >
          {activeConversation != null && (
            <FloatingSupportThread
              title={activeConversation.title}
              subtitle={activeConversation.subtitle}
              onBack={onBack}
            />
          )}
        </Box>
      </Slide>
    </Box>
  );
}

export default function WidgetDemo() {
  const [open, setOpen] = React.useState(true);
  const [activeConversationId, setActiveConversationId] = React.useState(noConversationSelected);
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
  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );
  const messages = activeConversation == null ? [] : (threads[activeConversationId] ?? []);

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

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* ---------- Mock SaaS dashboard background ---------- */}
      <Box sx={{ p: 3, height: '100%' }}>
        {/* Top bar */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={(theme) => ({
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>A</Typography>
            </Box>
            <div>
              <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
                Acme Inc.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Dashboard
              </Typography>
            </div>
          </Stack>
          <Stack direction="row" spacing={1}>
            {['Overview', 'Analytics', 'Team'].map((tab) => (
              <Typography
                key={tab}
                variant="caption"
                sx={(theme) => ({
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: tab === 'Overview' ? 600 : 400,
                  bgcolor:
                    tab === 'Overview' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  color: tab === 'Overview' ? 'primary.main' : 'text.secondary',
                  cursor: 'default',
                })}
              >
                {tab}
              </Typography>
            ))}
          </Stack>
        </Stack>

        {/* Metric cards */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <MetricCard
            label="Revenue"
            value="$48.2K"
            change="+12.5% from last month"
            icon={<TrendingUpIcon />}
          />
          <MetricCard
            label="Users"
            value="2,847"
            change="+8.1% from last month"
            icon={<PeopleOutlineIcon />}
          />
          <MetricCard
            label="Conversion"
            value="3.24%"
            change="+0.4% from last month"
            icon={<InsightsIcon />}
          />
        </Stack>

        {/* Activity feed + chart placeholder */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
          {/* Recent activity */}
          <Box
            sx={{
              flex: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: 1.5, py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Recent activity
              </Typography>
            </Box>
            <ActivityRow name="Sarah Kim" action="Joined the team" time="2m ago" />
            <ActivityRow name="Alex Torres" action="Deployed v2.4.1" time="18m ago" />
            <ActivityRow name="Jordan Lee" action="Updated billing plan" time="1h ago" />
            <ActivityRow name="Morgan Wu" action="Created project Orion" time="3h ago" />
          </Box>

          {/* Mini chart placeholder */}
          <Box
            sx={{
              flex: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1 }}>
              Weekly traffic
            </Typography>
            {/* SVG chart bars */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 0.75 }}>
              {[40, 65, 55, 80, 70, 90, 60].map((h, i) => (
                <Box
                  key={i}
                  sx={(theme) => ({
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: 0.75,
                    background:
                      i === 5
                        ? theme.palette.primary.main
                        : alpha(theme.palette.primary.main, 0.15),
                    transition: 'height 0.4s ease',
                  })}
                />
              ))}
            </Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  color="text.disabled"
                  sx={{ flex: 1, textAlign: 'center', fontSize: 10 }}
                >
                  {d}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
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
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.6),
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 24px 80px ${alpha('#000', 0.5)}, 0 8px 24px ${alpha('#000', 0.3)}`
                : `0 24px 80px ${alpha(theme.palette.primary.main, 0.12)}, 0 8px 24px ${alpha('#000', 0.08)}`,
          })}
        >
          <ChatProvider
            adapter={adapter}
            activeConversationId={activeConversationId}
            conversations={conversations}
            messages={messages}
            onActiveConversationChange={setActiveConversationId}
            onMessagesChange={(nextMessages) => {
              if (activeConversation == null) {
                return;
              }

              setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
              setConversations((prev) =>
                syncConversationPreview(prev, activeConversationId, nextMessages),
              );
            }}
            currentUser={you}
          >
            <Box sx={{ height: '100%', width: '100%' }}>
              <FloatingSupportWidget
                activeConversation={activeConversation}
                onBack={() => setActiveConversationId(noConversationSelected)}
                onClose={() => setOpen(false)}
                onStartConversation={handleStartConversation}
              />
            </Box>
          </ChatProvider>
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
