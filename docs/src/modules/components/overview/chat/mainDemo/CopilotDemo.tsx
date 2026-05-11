'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { ChatComposer, ChatConversation, ChatMessageList, ChatSuggestions } from '@mui/x-chat';
import { ChatProvider, useMessageIds } from '@mui/x-chat/headless';
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
} from '../../../../../../data/chat/material/examples/shared/demoUtils';

function createAvatarDataUrl(label: string, background: string, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const copilotAgent: ChatUser = {
  id: 'copilot',
  displayName: 'Copilot',
  avatarUrl: createAvatarDataUrl('C', '#1a73e8'),
  role: 'assistant',
};

const you: ChatUser = {
  id: 'you',
  displayName: 'You',
  avatarUrl: createAvatarDataUrl('Y', '#5f6368'),
  role: 'user',
};

const CONVERSATION_ID = 'copilot-overview';

const copilotConversation: ChatConversationModel = {
  id: CONVERSATION_ID,
  title: 'Copilot',
  subtitle: 'Ask about the data',
  participants: [you, copilotAgent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-04-01T10:00:00.000Z',
};

const SUGGESTIONS = [
  'Summarize this table',
  'Which country has the highest average rating?',
  'Filter to admins only',
];

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

function buildResponseText(userText: string, rowCount: number, columnCount: number) {
  return (
    `You asked: "${userText}". In a real product the adapter would receive the ${rowCount} ` +
    `row(s) and ${columnCount} visible column(s) as context, then call an LLM. ` +
    `This demo just echoes your request back.`
  );
}

function createCopilotAdapter(
  getContext: () => { rowCount: number; columnCount: number },
): ChatAdapter {
  return {
    async sendMessage({ message }) {
      const text = message.parts
        .map((part) => (part.type === 'text' ? part.text : ''))
        .filter(Boolean)
        .join('');
      const { rowCount, columnCount } = getContext();
      const responseText = buildResponseText(text, rowCount, columnCount);

      return createChunkStream(
        createTextResponseChunks(randomId(), responseText, { author: copilotAgent }),
        { delayMs: 120 },
      );
    },
  };
}

function CopilotEmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 0.5,
        px: 3,
        pt: 4,
        pb: 1,
      }}
    >
      <Box
        sx={(theme) => ({
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(
            theme.palette.secondary?.main ?? theme.palette.primary.dark,
            0.18,
          )})`,
        })}
      >
        <AutoAwesomeOutlinedIcon
          sx={(theme) => ({
            fontSize: 24,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary?.main ?? theme.palette.primary.dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          })}
        />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>How can I help?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
        Ask anything about your data, or pick a suggestion to get started.
      </Typography>
    </Box>
  );
}

function CopilotThread() {
  const messageIds = useMessageIds();
  const isEmpty = messageIds.length === 0;

  return (
    <ChatConversation sx={{ height: '100%', bgcolor: 'background.paper' }}>
      {isEmpty ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <CopilotEmptyState />
          <ChatSuggestions
            suggestions={SUGGESTIONS}
            autoSubmit
            slotProps={{
              root: { sx: { px: 2, py: 1.5, justifyContent: 'flex-start' } } as any,
            }}
          />
        </Box>
      ) : (
        <ChatMessageList />
      )}
      <ChatComposer variant="compact" sx={{ mx: 1.5, mb: 1.5 }} />
    </ChatConversation>
  );
}

export default function CopilotDemo() {
  const [open, setOpen] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 60,
  });

  const contextRef = React.useRef({ rowCount: 0, columnCount: VISIBLE_FIELDS.length });
  contextRef.current = {
    rowCount: data.rows.length,
    columnCount: VISIBLE_FIELDS.length,
  };

  const adapter = React.useMemo(() => createCopilotAdapter(() => contextRef.current), []);
  const [messages, setMessages] = React.useState<ChatMessageModel[]>([]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Grid pane */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            minHeight: 48,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Employees</Typography>
            <Typography variant="caption" color="text.secondary">
              {data.rows.length} rows
            </Typography>
          </Stack>
          {!open && (
            <Button
              size="small"
              variant="contained"
              disableElevation
              startIcon={<AutoAwesomeOutlinedIcon fontSize="small" />}
              onClick={() => setOpen(true)}
              sx={{
                textTransform: 'none',
                borderRadius: 5,
                fontWeight: 600,
                px: 1.75,
              }}
            >
              Ask Copilot
            </Button>
          )}
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <DataGrid
            {...data}
            loading={loading}
            density="compact"
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              borderRadius: 0,
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'background.paper',
              },
            }}
          />
        </Box>
      </Box>

      {/* Side panel */}
      <Slide
        direction="left"
        in={open}
        container={containerRef.current}
        timeout={260}
        easing={{ enter: 'cubic-bezier(0.2, 0, 0, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)' }}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={(theme) => ({
            width: 360,
            flexShrink: 0,
            borderLeft: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: `-8px 0 24px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.3 : 0.04)}`,
          })}
        >
          <Stack
            direction="row"
            sx={(theme) => ({
              alignItems: 'center',
              justifyContent: 'space-between',
              pl: 1.75,
              pr: 0.5,
              height: 44,
              borderBottom: '1px solid',
              borderColor: 'divider',
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.background.paper, 0)})`
                  : `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)}, ${alpha(theme.palette.background.paper, 0)})`,
            })}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
              <AutoAwesomeOutlinedIcon
                sx={(theme) => ({
                  fontSize: 18,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary?.main ?? theme.palette.primary.dark})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                })}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: -0.1,
                  lineHeight: 1,
                }}
              >
                Copilot
              </Typography>
              <Box
                component="span"
                sx={(theme) => ({
                  px: 0.625,
                  py: 0.125,
                  borderRadius: 0.75,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 0.4,
                  lineHeight: 1.4,
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  textTransform: 'uppercase',
                })}
              >
                Beta
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
              <IconButton
                size="small"
                aria-label="Copilot options"
                sx={{ width: 32, height: 32, color: 'text.secondary' }}
              >
                <MoreVertIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Close Copilot"
                onClick={() => setOpen(false)}
                sx={{ width: 32, height: 32, color: 'text.secondary' }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ChatProvider
              adapter={adapter}
              activeConversationId={CONVERSATION_ID}
              conversations={[copilotConversation]}
              messages={messages}
              onMessagesChange={setMessages}
              currentUser={you}
            >
              <CopilotThread />
            </ChatProvider>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}
