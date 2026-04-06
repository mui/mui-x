'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  ChatBox,
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerAttachmentList,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
} from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
  ChatMessagePart,
} from '@mui/x-chat/headless';
import { useChat } from '@mui/x-chat/headless';
import {
  createChunkStream,
  randomId,
  splitText,
  syncConversationPreview,
} from '../../../../../../data/chat/material/examples/shared/demoUtils';
import { demoUsers } from '../../../../../../data/chat/material/examples/shared/demoData';

// --- Types ------------------------------------------------------------------

interface TaskNode {
  conversationId: string;
  label: string;
  relativeTime: string;
  status: 'working' | 'completed';
}

interface ProjectNode {
  id: string;
  name: string;
  tasks: TaskNode[];
}

// --- Constants --------------------------------------------------------------

const SIDEBAR_WIDTH = 260;

// --- Conversation IDs -------------------------------------------------------

const taskMarketingId = randomId();
const taskDeployId = randomId();
const taskBundlerId = randomId();
const taskThemeId = randomId();
const taskSecurityId = randomId();

// --- Project tree data ------------------------------------------------------

const projects: ProjectNode[] = [
  {
    id: 'acme-web',
    name: 'acme-web',
    tasks: [
      {
        conversationId: taskMarketingId,
        label: 'I need to create a marketing site for this app',
        relativeTime: '8m ago',
        status: 'working',
      },
      {
        conversationId: taskDeployId,
        label: 'Scaffold Vercel deployment config',
        relativeTime: '1h ago',
        status: 'completed',
      },
    ],
  },
  {
    id: 'tooling',
    name: 'tooling',
    tasks: [
      {
        conversationId: taskBundlerId,
        label: 'I want to modernize the bundler config',
        relativeTime: '2h ago',
        status: 'working',
      },
    ],
  },
  {
    id: 'design-system',
    name: 'design-system',
    tasks: [
      {
        conversationId: taskThemeId,
        label: 'Update MUI theme colors to teal',
        relativeTime: '3h ago',
        status: 'completed',
      },
      {
        conversationId: taskSecurityId,
        label: 'Review security configuration',
        relativeTime: '5h ago',
        status: 'working',
      },
    ],
  },
];

// Map conversationId → projectName for the header chip
const conversationToProject: Record<string, string> = {};
projects.forEach((p) =>
  p.tasks.forEach((t) => {
    conversationToProject[t.conversationId] = p.name;
  }),
);

// --- AgentTaskTree (conversationList slot) -----------------------------------

function AgentTaskTree(_props: Record<string, unknown>) {
  const { activeConversationId, setActiveConversation } = useChat();

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(projects.map((p) => [p.id, true])),
  );

  const toggleProject = (projectId: string) => {
    setExpanded((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1 }}>
          Tasks
        </Typography>
      </Box>

      {/* Tree body */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 0.5 }}>
        {projects.map((project) => (
          <React.Fragment key={project.id}>
            {/* Project header */}
            <Box
              component="button"
              onClick={() => toggleProject(project.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                px: 1,
                py: 0.5,
                cursor: 'pointer',
                border: 'none',
                bgcolor: 'transparent',
                color: 'text.primary',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 600,
                textAlign: 'left',
                transition: 'background-color 150ms ease',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {expanded[project.id] ? (
                <ExpandMoreIcon sx={{ fontSize: 16, mr: 0.25, color: 'text.secondary' }} />
              ) : (
                <ChevronRightIcon sx={{ fontSize: 16, mr: 0.25, color: 'text.secondary' }} />
              )}
              {project.name}
            </Box>

            {/* Tasks */}
            <Collapse in={expanded[project.id]}>
              {project.tasks.map((task) => {
                const isActive = activeConversationId === task.conversationId;
                return (
                  <Box
                    key={task.conversationId}
                    component="button"
                    onClick={() => setActiveConversation(task.conversationId)}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      width: '100%',
                      pl: 3.5,
                      pr: 1,
                      py: 0.75,
                      cursor: 'pointer',
                      border: 'none',
                      bgcolor: isActive ? 'action.selected' : 'transparent',
                      color: 'text.primary',
                      fontFamily: 'inherit',
                      fontSize: '0.75rem',
                      textAlign: 'left',
                      lineHeight: 1.4,
                      transition: 'background-color 150ms ease',
                      '&:hover': { bgcolor: isActive ? 'action.selected' : 'action.hover' },
                    }}
                  >
                    {/* Status indicator */}
                    {task.status === 'working' ? (
                      <FiberManualRecordIcon sx={{ fontSize: 8, color: 'warning.main' }} />
                    ) : (
                      <CheckCircleOutlineIcon sx={{ fontSize: 11, color: 'success.main' }} />
                    )}

                    {/* Task label + meta */}
                    <Box sx={{ flex: 1, minWidth: 0, pl: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            color: task.status === 'working' ? 'warning.main' : 'success.main',
                            textTransform: 'capitalize',
                            lineHeight: 1,
                          }}
                        >
                          {task.status === 'working' ? 'Working' : 'Completed'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.disabled',
                            fontSize: '0.6rem',
                            flexShrink: 0,
                            lineHeight: 1,
                          }}
                        >
                          {task.relativeTime}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'text.secondary',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.3,
                          mt: 0.25,
                        }}
                      >
                        {task.label}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Collapse>
          </React.Fragment>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 1.5,
          py: 1,
        }}
      >
        <Box
          component="button"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            width: '100%',
            px: 1,
            py: 0.5,
            cursor: 'pointer',
            border: 'none',
            bgcolor: 'transparent',
            color: 'text.secondary',
            fontFamily: 'inherit',
            fontSize: '0.8rem',
            borderRadius: 1,
            transition: 'background-color 150ms ease',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
          Add project
        </Box>
      </Box>
    </Box>
  );
}

// --- AgentHeaderBar (conversationHeader slot) --------------------------------

function AgentHeaderBar(_props: Record<string, unknown>) {
  const { conversations, activeConversationId } = useChat();
  const active = conversations.find((c) => c.id === activeConversationId);
  const projectName = activeConversationId
    ? conversationToProject[activeConversationId]
    : undefined;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: 48,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 600, minWidth: 0 }}>
        {active?.title ?? 'Select a task'}
      </Typography>
      {projectName && (
        <Chip
          label={projectName}
          size="small"
          variant="outlined"
          sx={{
            height: 22,
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
      )}
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        <Button
          size="small"
          variant="text"
          startIcon={<AddIcon sx={{ fontSize: 14 }} />}
          sx={{ fontSize: '0.75rem', textTransform: 'none', minWidth: 'auto', px: 1 }}
        >
          Add action
        </Button>
        <Button
          size="small"
          variant="text"
          startIcon={<OpenInNewOutlinedIcon sx={{ fontSize: 14 }} />}
          sx={{ fontSize: '0.75rem', textTransform: 'none', minWidth: 'auto', px: 1 }}
        >
          Open
        </Button>
        <Button
          size="small"
          variant="contained"
          disableElevation
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
          sx={{ fontSize: '0.75rem', textTransform: 'none', minWidth: 'auto', px: 1.5 }}
        >
          Commit &amp; push
        </Button>
      </Box>
    </Box>
  );
}

// --- Composer selectors -------------------------------------------------------

const MODEL_PROVIDERS = [
  { id: 'claude', label: 'Claude', models: ['Opus 4.6', 'Sonnet 4.6', 'Haiku 4.5'] },
  { id: 'codex', label: 'Codex', models: [] as string[] },
  { id: 'cursor', label: 'Cursor', models: [] as string[] },
  { id: 'gemini', label: 'Gemini', models: [] as string[] },
  { id: 'copilot', label: 'GitHub Copilot', models: [] as string[] },
  { id: 'opencode', label: 'OpenCode', models: [] as string[] },
];

const EFFORT_OPTIONS = ['Low', 'Medium', 'High'];

function ModelSelector() {
  const [model, setModel] = React.useState('Sonnet 4.6');
  const [mainAnchor, setMainAnchor] = React.useState<HTMLElement | null>(null);
  const [subAnchor, setSubAnchor] = React.useState<HTMLElement | null>(null);

  const closeAll = () => {
    setMainAnchor(null);
    setSubAnchor(null);
  };
  const pick = (m: string) => {
    setModel(m);
    closeAll();
  };

  return (
    <React.Fragment>
      <Button
        size="small"
        onClick={(event) => setMainAnchor(event.currentTarget)}
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
        sx={{
          textTransform: 'none',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'text.primary',
          px: 1,
          py: 0.25,
          minWidth: 0,
        }}
      >
        ✳ {model}
      </Button>

      <Menu
        anchorEl={mainAnchor}
        open={Boolean(mainAnchor)}
        onClose={closeAll}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { minWidth: 180 } } }}
      >
        {MODEL_PROVIDERS.map((p) => (
          <MenuItem
            key={p.id}
            dense
            onMouseEnter={(event) => {
              if (p.models.length > 0) {
                setSubAnchor(event.currentTarget);
              } else {
                setSubAnchor(null);
              }
            }}
          >
            <Box component="span" sx={{ flex: 1 }}>
              {p.label}
            </Box>
            {p.models.length > 0 && <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
          </MenuItem>
        ))}
      </Menu>

      {/* Claude model sub-menu */}
      <Menu
        anchorEl={subAnchor}
        open={Boolean(subAnchor)}
        onClose={closeAll}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ pointerEvents: 'none' }}
        slotProps={{ paper: { sx: { pointerEvents: 'auto', minWidth: 140 } } }}
      >
        {MODEL_PROVIDERS[0].models.map((m) => (
          <MenuItem key={m} dense selected={m === model} onClick={() => pick(m)}>
            <Typography variant="body2" sx={{ fontWeight: m === model ? 700 : 400 }}>
              {m}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

function EffortSelector() {
  const [effort, setEffort] = React.useState('Medium');
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  return (
    <React.Fragment>
      <Button
        size="small"
        onClick={(event) => setAnchor(event.currentTarget)}
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
        sx={{
          textTransform: 'none',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'text.primary',
          px: 1,
          py: 0.25,
          minWidth: 0,
        }}
      >
        {effort} effort
      </Button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {EFFORT_OPTIONS.map((opt) => (
          <MenuItem
            key={opt}
            dense
            selected={opt === effort}
            onClick={() => {
              setEffort(opt);
              setAnchor(null);
            }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

// --- AgentComposer (composerRoot slot) ----------------------------------------

function AgentComposer({ children: _children, ...other }: Record<string, unknown>) {
  return (
    <ChatComposer {...other} variant="default">
      <ChatComposerAttachmentList />
      <ChatComposerTextArea />
      <ChatComposerToolbar>
        <ChatComposerAttachButton>
          <AddIcon sx={{ fontSize: 18 }} />
        </ChatComposerAttachButton>
        <ModelSelector />
        <EffortSelector />
        <Chip
          label="Default"
          size="small"
          sx={{
            height: 24,
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,167,38,0.15)' : 'rgba(237,108,2,0.08)',
            color: 'warning.main',
          }}
        />
        <Chip
          label="Full access"
          size="small"
          variant="outlined"
          sx={{ height: 24, fontSize: '0.7rem', fontWeight: 500 }}
        />
        <Box sx={{ flex: 1 }} />
        <ChatComposerSendButton>
          <ArrowUpwardIcon sx={{ fontSize: 18 }} />
        </ChatComposerSendButton>
      </ChatComposerToolbar>
    </ChatComposer>
  );
}

// --- Message factories -------------------------------------------------------

function makeUserMessage(conversationId: string, text: string, createdAt: string): ChatMessage {
  return {
    id: randomId(),
    conversationId,
    role: 'user',
    status: 'sent',
    createdAt,
    author: demoUsers.you,
    parts: [{ type: 'text', text }],
  };
}

function makeAssistantMessage(
  conversationId: string,
  createdAt: string,
  parts: ChatMessagePart[],
): ChatMessage {
  return {
    id: randomId(),
    conversationId,
    role: 'assistant',
    status: 'sent',
    createdAt,
    author: demoUsers.agent,
    parts,
  };
}

// --- Pre-populated conversations ---------------------------------------------

const initialConversations: ChatConversation[] = [
  {
    id: taskMarketingId,
    title: 'Create a marketing site for this app',
    subtitle: 'The repo doesn\u2019t have existing Vercel wiring\u2026',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-31T09:30:00.000Z',
  },
  {
    id: taskDeployId,
    title: 'Scaffold Vercel deployment config',
    subtitle: 'Done \u2014 deployment config is ready.',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-31T08:30:00.000Z',
  },
  {
    id: taskBundlerId,
    title: 'Modernize the bundler configuration',
    subtitle: 'Checking the current Webpack setup\u2026',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'unread',
    unreadCount: 1,
    lastMessageAt: '2026-03-31T07:30:00.000Z',
  },
  {
    id: taskThemeId,
    title: 'Update MUI theme colors to teal',
    subtitle: 'Done \u2014 primary color updated to teal.',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-31T06:30:00.000Z',
  },
  {
    id: taskSecurityId,
    title: 'Review security configuration',
    subtitle: 'Checking dependency audit reports\u2026',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-31T05:30:00.000Z',
  },
];

// --- Pre-populated threads ---------------------------------------------------

const initialThreads: Record<string, ChatMessage[]> = {
  // ── Marketing site ────────────────────────────────────────────────────
  [taskMarketingId]: [
    makeUserMessage(
      taskMarketingId,
      'I need to create a marketing site for this app before launch. Can you scaffold it?',
      '2026-03-31T09:20:00.000Z',
    ),
    makeAssistantMessage(taskMarketingId, '2026-03-31T09:21:00.000Z', [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: "The repo doesn't have existing Vercel/marketing-site wiring, so I have room to scaffold a purpose-built app. Let me check the monorepo conventions first.",
        state: 'done',
      },
      {
        type: 'text',
        text: "The repo doesn't have existing Vercel/marketing-site wiring, so I have room to add a purpose-built app instead of working around prior deployment config. I'm checking the monorepo task conventions next, then I'll scaffold `apps/site` and build the first version in one pass.",
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'bash',
          state: 'output-available',
          input: { command: 'ls -la apps/' },
          output: {
            stdout:
              'total 8\ndrwxr-xr-x  4 user staff 128 Mar 31 09:00 .\ndrwxr-xr-x 12 user staff 384 Mar 31 08:00 ..\ndrwxr-xr-x  6 user staff 192 Mar 30 14:00 dashboard\ndrwxr-xr-x  5 user staff 160 Mar 29 10:00 docs',
            exit_code: 0,
          },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'bash',
          state: 'output-available',
          input: { command: 'cat apps/dashboard/package.json | head -12' },
          output: {
            stdout:
              '{\n  "name": "@acme/dashboard",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build"\n  },\n  "dependencies": {\n    "next": "^15.1.0",\n    "react": "^19.0.0"\n  }\n}',
            exit_code: 0,
          },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'bash',
          state: 'output-available',
          input: {
            command:
              'mkdir -p apps/site && npx create-next-app@latest apps/site --ts --tailwind --app --no-git',
          },
          output: {
            stdout: 'Creating a new Next.js app in apps/site.\nSuccess! Created site at apps/site',
            exit_code: 0,
          },
        },
      },
      {
        type: 'text',
        text: "I've confirmed the new app can stand alone without touching the product runtimes. I'm inspecting the existing brand assets now so the marketing site can reuse what you already have rather than inventing a disconnected visual identity.",
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'glob',
          state: 'output-available',
          input: { pattern: 'packages/ui/src/**/*.{ts,tsx}' },
          output: {
            files: [
              'packages/ui/src/index.ts',
              'packages/ui/src/Button.tsx',
              'packages/ui/src/theme.ts',
              'packages/ui/src/colors.ts',
            ],
          },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'read_file',
          state: 'output-available',
          input: { path: 'packages/ui/src/colors.ts' },
          output: {
            content:
              "export const brand = {\n  primary: '#1976d2',\n  secondary: '#9c27b0',\n  accent: '#00bcd4',\n  background: '#fafafa',\n  surface: '#ffffff',\n};",
          },
        },
      },
      {
        type: 'text',
        text: "The marketing site scaffold is ready at `apps/site`. I've matched the existing brand colors from `packages/ui/src/colors.ts` and set up the Next.js app with TypeScript and Tailwind. The shared color tokens will keep the marketing site visually consistent with the dashboard.",
        state: 'done',
      },
    ]),
  ],

  // ── Deploy config (simple placeholder) ──────────────────────────────
  [taskDeployId]: [
    makeUserMessage(
      taskDeployId,
      'Set up the Vercel deployment config for the new marketing site.',
      '2026-03-31T08:20:00.000Z',
    ),
    makeAssistantMessage(taskDeployId, '2026-03-31T08:25:00.000Z', [
      {
        type: 'text',
        text: "Done \u2014 I've created `apps/site/vercel.json` with the build settings and environment variables. The deployment pipeline will trigger on pushes to `main`.",
        state: 'done',
      },
    ]),
  ],

  // ── Bundler config ────────────────────────────────────────────────────
  [taskBundlerId]: [
    makeUserMessage(
      taskBundlerId,
      'Our Webpack config is getting unwieldy. Can you modernize it?',
      '2026-03-31T07:20:00.000Z',
    ),
    makeAssistantMessage(taskBundlerId, '2026-03-31T07:22:00.000Z', [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: 'The user wants to modernize the bundler. Let me check what version of Webpack they use and assess whether a migration to Vite or Rspack makes sense.',
        state: 'done',
      },
      {
        type: 'text',
        text: 'Let me check the current bundler setup and assess options.',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'glob',
          state: 'output-available',
          input: { pattern: '**/webpack*.{js,ts,mjs}' },
          output: {
            files: ['webpack.config.js', 'webpack.dev.js', 'webpack.prod.js'],
          },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'read_file',
          state: 'output-available',
          input: { path: 'webpack.config.js' },
          output: {
            content:
              "const path = require('path');\nconst HtmlPlugin = require('html-webpack-plugin');\n\nmodule.exports = {\n  entry: './src/index.ts',\n  module: {\n    rules: [\n      { test: /\\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },\n      { test: /\\.css$/, use: ['style-loader', 'css-loader'] },\n    ],\n  },\n  resolve: { extensions: ['.tsx', '.ts', '.js'] },\n  output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist') },\n  plugins: [new HtmlPlugin({ template: './public/index.html' })],\n};",
          },
        },
      },
      {
        type: 'text',
        text: 'Checking the dependency tree for any Webpack 4-only plugins that might block migration.',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'bash',
          state: 'output-available',
          input: {
            command: 'cat package.json | grep -E "webpack|ts-loader|style-loader|css-loader"',
          },
          output: {
            stdout:
              '    "webpack": "^5.90.0",\n    "webpack-cli": "^5.1.0",\n    "ts-loader": "^9.5.0",\n    "style-loader": "^3.3.0",\n    "css-loader": "^6.9.0",\n    "html-webpack-plugin": "^5.6.0"',
            exit_code: 0,
          },
        },
      },
      {
        type: 'text',
        text:
          "Here's my assessment:\n\n" +
          '1. **Current state** \u2014 Webpack 5 with `ts-loader`, a standard setup but slower dev server.\n' +
          '2. **Recommended** \u2014 Migrate to **Vite** for 10\u201320\u00d7 faster cold starts via ESM.\n' +
          "3. **Migration path** \u2014 Replace all three config files with a single `vite.config.ts`, swap `ts-loader` for Vite's built-in esbuild transform, and remove `style-loader`/`css-loader` (Vite handles CSS natively).\n\n" +
          'Want me to perform the migration?',
        state: 'done',
      },
    ]),
  ],

  // ── Theme update ──────────────────────────────────────────────────────
  [taskThemeId]: [
    makeUserMessage(
      taskThemeId,
      'Change the primary color in our MUI theme from blue to teal.',
      '2026-03-31T06:20:00.000Z',
    ),
    makeAssistantMessage(taskThemeId, '2026-03-31T06:22:00.000Z', [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: "I need to find the theme configuration file, read the current primary color, and update it to teal. MUI's teal is available at '@mui/material/colors/teal'.",
        state: 'done',
      },
      {
        type: 'text',
        text: 'Let me find the theme file first.',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'glob',
          state: 'output-available',
          input: { pattern: 'src/**/theme*' },
          output: { files: ['src/theme.ts', 'src/theme.test.ts'] },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'read_file',
          state: 'output-available',
          input: { path: 'src/theme.ts' },
          output: {
            content:
              "import { createTheme } from '@mui/material/styles';\nimport { blue } from '@mui/material/colors';\n\nexport const theme = createTheme({\n  palette: {\n    primary: { main: blue[700] },\n  },\n});",
          },
        },
      },
      {
        type: 'text',
        text: 'Found it. The primary color is currently `blue[700]`. Updating to `teal[600]`.',
        state: 'done',
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'edit_file',
          state: 'output-available',
          input: {
            path: 'src/theme.ts',
            old_str:
              "import { blue } from '@mui/material/colors';\n\nexport const theme = createTheme({\n  palette: {\n    primary: { main: blue[700] },",
            new_str:
              "import { teal } from '@mui/material/colors';\n\nexport const theme = createTheme({\n  palette: {\n    primary: { main: teal[600] },",
          },
          output: { patched: true },
        },
      },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: randomId(),
          toolName: 'bash',
          state: 'output-available',
          input: { command: 'pnpm tsc --noEmit' },
          output: { stdout: 'No errors found.', exit_code: 0 },
        },
      },
      {
        type: 'text',
        text: "Done \u2014 primary color updated to teal. The TypeScript build passes with no errors. You'll see the change reflected across all components that use `theme.palette.primary`.",
        state: 'done',
      },
    ]),
  ],

  // ── Security review (placeholder) ─────────────────────────────────────
  [taskSecurityId]: [
    makeUserMessage(
      taskSecurityId,
      'Can you review our security configuration and flag any issues?',
      '2026-03-31T05:20:00.000Z',
    ),
    makeAssistantMessage(taskSecurityId, '2026-03-31T05:22:00.000Z', [
      {
        type: 'text',
        text: "I'll start by running a dependency audit and checking for known vulnerabilities. Give me a moment to scan the project.",
        state: 'done',
      },
    ]),
  ],
};

// --- Scripted chunk builders -------------------------------------------------

function pushText(chunks: ChatMessageChunk[], id: string, text: string) {
  chunks.push({ type: 'text-start', id });
  for (const delta of splitText(text)) {
    chunks.push({ type: 'text-delta', id, delta });
  }
  chunks.push({ type: 'text-end', id });
}

function pushReasoning(chunks: ChatMessageChunk[], id: string, text: string) {
  chunks.push({ type: 'reasoning-start', id });
  for (const delta of splitText(text)) {
    chunks.push({ type: 'reasoning-delta', id, delta });
  }
  chunks.push({ type: 'reasoning-end', id });
}

function pushTool(
  chunks: ChatMessageChunk[],
  toolCallId: string,
  toolName: string,
  input: unknown,
  output: unknown,
) {
  chunks.push({ type: 'tool-input-start', toolCallId, toolName, dynamic: true });
  for (const delta of splitText(JSON.stringify(input))) {
    chunks.push({ type: 'tool-input-delta', toolCallId, inputTextDelta: delta });
  }
  chunks.push({
    type: 'tool-input-available',
    toolCallId,
    toolName,
    input,
  } as ChatMessageChunk);
  chunks.push({ type: 'tool-output-available', toolCallId, output });
}

// --- Scripted responses per conversation ------------------------------------

function createMarketingChunks(messageId: string): ChatMessageChunk[] {
  const chunks: ChatMessageChunk[] = [];

  chunks.push({ type: 'start', messageId, author: demoUsers.agent });

  pushReasoning(
    chunks,
    `${messageId}-r`,
    'Follow-up on the marketing site. Let me check if the layout components are set up correctly.',
  );

  chunks.push({ type: 'start-step' });

  pushText(chunks, `${messageId}-t1`, 'Let me verify the page structure and check the layout.');

  pushTool(
    chunks,
    `${messageId}-read`,
    'read_file',
    { path: 'apps/site/app/page.tsx' },
    {
      content:
        'export default function Home() {\n  return (\n    <main>\n      <h1>Welcome to Acme</h1>\n      <p>The fastest way to ship.</p>\n    </main>\n  );\n}',
    },
  );

  pushText(
    chunks,
    `${messageId}-t2`,
    'The landing page needs hero and feature sections. Let me add them.',
  );

  pushTool(
    chunks,
    `${messageId}-edit`,
    'edit_file',
    {
      path: 'apps/site/app/page.tsx',
      old_str: '<h1>Welcome to Acme</h1>',
      new_str: '<Hero />\n      <Features />\n      <Pricing />',
    },
    { patched: true },
  );

  pushText(
    chunks,
    `${messageId}-t3`,
    "Updated the landing page with Hero, Features, and Pricing sections. Each pulls colors from the shared brand tokens. The layout is responsive out of the box via Tailwind's grid utilities.",
  );

  chunks.push({ type: 'finish', messageId, finishReason: 'stop' });
  return chunks;
}

function createBundlerChunks(messageId: string): ChatMessageChunk[] {
  const chunks: ChatMessageChunk[] = [];

  chunks.push({ type: 'start', messageId, author: demoUsers.agent });

  pushReasoning(
    chunks,
    `${messageId}-r`,
    'The user confirmed migration. Let me create the Vite config and remove the old Webpack files.',
  );

  chunks.push({ type: 'start-step' });

  pushText(chunks, `${messageId}-t1`, 'Starting the migration to Vite now.');

  pushTool(
    chunks,
    `${messageId}-install`,
    'bash',
    {
      command:
        'pnpm add -D vite @vitejs/plugin-react && pnpm remove webpack webpack-cli ts-loader style-loader css-loader html-webpack-plugin',
    },
    {
      stdout: 'Packages: +2 -6\nProgress: resolved 847, reused 830, downloaded 2\ndone',
      exit_code: 0,
    },
  );

  pushTool(
    chunks,
    `${messageId}-create`,
    'edit_file',
    {
      path: 'vite.config.ts',
      new_content:
        "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 3000 },\n});",
    },
    { created: true },
  );

  pushTool(
    chunks,
    `${messageId}-rm`,
    'bash',
    { command: 'rm webpack.config.js webpack.dev.js webpack.prod.js' },
    {
      stdout: '',
      exit_code: 0,
    },
  );

  pushText(
    chunks,
    `${messageId}-t2`,
    'Migration complete. Replaced three Webpack config files with a single `vite.config.ts`. Dev server cold-start should drop from ~8s to under 500ms.',
  );

  chunks.push({ type: 'finish', messageId, finishReason: 'stop' });
  return chunks;
}

function createThemeChunks(messageId: string): ChatMessageChunk[] {
  const chunks: ChatMessageChunk[] = [];

  chunks.push({ type: 'start', messageId, author: demoUsers.agent });

  pushReasoning(
    chunks,
    `${messageId}-r`,
    'The user wants another theme change. Let me read the current theme file and apply the update.',
  );

  chunks.push({ type: 'start-step' });

  pushText(chunks, `${messageId}-t1`, 'Reading the current theme configuration\u2026');

  pushTool(
    chunks,
    `${messageId}-read`,
    'read_file',
    { path: 'src/theme.ts' },
    {
      content:
        "import { createTheme } from '@mui/material/styles';\nimport { teal } from '@mui/material/colors';\n\nexport const theme = createTheme({\n  palette: {\n    primary: { main: teal[600] },\n  },\n});",
    },
  );

  pushText(chunks, `${messageId}-t2`, 'Applying the requested changes now\u2026');

  pushTool(
    chunks,
    `${messageId}-edit`,
    'edit_file',
    {
      path: 'src/theme.ts',
      old_str: 'primary: { main: teal[600] },',
      new_str: "primary: { main: '#9c27b0' }, // Deep Purple",
    },
    { patched: true },
  );

  pushTool(
    chunks,
    `${messageId}-check`,
    'bash',
    { command: 'pnpm tsc --noEmit' },
    {
      stdout: 'No errors found.',
      exit_code: 0,
    },
  );

  pushText(
    chunks,
    `${messageId}-t3`,
    'Updated and verified \u2014 the build passes. The new primary color will apply across all MUI components.',
  );

  chunks.push({ type: 'finish', messageId, finishReason: 'stop' });
  return chunks;
}

const chunkBuilders: Record<string, (messageId: string) => ChatMessageChunk[]> = {
  [taskMarketingId]: createMarketingChunks,
  [taskBundlerId]: createBundlerChunks,
  [taskThemeId]: createThemeChunks,
};

// --- Main component ----------------------------------------------------------

export default function AgentDemo() {
  const [activeId, setActiveId] = React.useState(() => initialConversations[0].id);
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    initialConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(initialThreads).map(([id, msgs]) => [id, msgs.map((m) => ({ ...m }))]),
    ),
  );

  const activeIdRef = React.useRef(activeId);
  activeIdRef.current = activeId;

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        const buildChunks = chunkBuilders[activeIdRef.current] ?? createMarketingChunks;
        return createChunkStream(buildChunks(randomId()), { delayMs: 120 });
      },
    }),
    [],
  );

  const messages = threads[activeId] ?? [];

  return (
    <ChatBox
      adapter={adapter}
      activeConversationId={activeId}
      conversations={conversations}
      messages={messages}
      variant="compact"
      density="compact"
      slots={{
        conversationList: AgentTaskTree,
        conversationHeader: AgentHeaderBar,
        composerRoot: AgentComposer,
      }}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({ ...prev, [activeId]: nextMessages }));
        setConversations((prev) => syncConversationPreview(prev, activeId, nextMessages));
      }}
      sx={{ height: '100%' }}
    />
  );
}
