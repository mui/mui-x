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
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid } from '@mui/x-data-grid';
import { getEmployeeColumns } from '@mui/x-data-grid-generator';
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
} from '../../../../../../data/chat/core/examples/shared/demoUtils';

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

const columns = getEmployeeColumns();
const estimatedRowCount = 100;

export default function CopilotDemo() {
  const [open, setOpen] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const contextRef = React.useRef({ rowCount: estimatedRowCount, columnCount: columns.length });
  contextRef.current = {
    rowCount: estimatedRowCount,
    columnCount: columns.length,
  };

  const adapter = React.useMemo(() => createCopilotAdapter(() => contextRef.current), []);
  const [messages, setMessages] = React.useState<ChatMessageModel[]>([]);
  // Bumping this key remounts ChatBox so any in-flight stream subscription is
  // torn down on cleanup — otherwise a stream that resolves after reset would
  // re-push its message back into the cleared thread.
  const [chatInstanceKey, setChatInstanceKey] = React.useState(0);

  const handleReset = React.useCallback(() => {
    setMessages([]);
    setChatInstanceKey((k) => k + 1);
  }, []);

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
              100 rows
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
            columns={columns}
            estimatedRowCount={estimatedRowCount}
            loading
            density="compact"
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              borderRadius: 0,
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'background.paper',
              },
              '& .MuiSkeleton-root': {
                // prevent from flickering
                animation: 'none',
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
                aria-label="Reset Copilot conversation"
                onClick={handleReset}
                disabled={messages.length === 0}
                sx={{ width: 32, height: 32, color: 'text.secondary' }}
              >
                <RefreshIcon sx={{ fontSize: 18 }} />
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
            <ChatBox
              key={chatInstanceKey}
              adapter={adapter}
              activeConversationId={CONVERSATION_ID}
              conversations={[copilotConversation]}
              messages={messages}
              onMessagesChange={setMessages}
              currentUser={you}
              variant="compact"
              suggestions={SUGGESTIONS}
              suggestionsAutoSubmit
              slots={{ emptyState: CopilotEmptyState }}
              slotProps={{
                composerRoot: { variant: 'compact', sx: { mx: 1.5, mb: 1.5 } },
              }}
              features={{
                conversationHeader: false,
                attachments: false,
                scrollToBottom: true,
                autoScroll: true,
              }}
              sx={{ height: '100%', bgcolor: 'background.paper' }}
            />
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}
