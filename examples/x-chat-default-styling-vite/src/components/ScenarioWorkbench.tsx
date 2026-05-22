import * as React from 'react';
import { Box, Chip, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ChatBox } from '@mui/x-chat';
import type { ChatBoxLayoutMode, ChatDensity, ChatVariant } from '@mui/x-chat';
import type { ChatAdapter, ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { conversations, initialThreads, makeAdapter, sampleSuggestions, users } from '../data';

type ScenarioId = 'ai-assistant' | 'team-inbox' | 'support-widget' | 'agentic-rag';

interface Scenario {
  id: ScenarioId;
  label: string;
  eyebrow: string;
  description: string;
  conversations: ChatConversation[];
  threads: Record<string, ChatMessage[]>;
  activeConversationId: string;
  suggestions: string[];
}

const supportConversation: ChatConversation = {
  id: 'support-widget',
  title: 'Support widget',
  subtitle: 'Billing question',
  participants: [users.me, users.assistant],
  readState: 'read',
  lastMessageAt: '2026-05-05T15:34:00.000Z',
};

const ragConversation: ChatConversation = {
  id: 'agentic-rag',
  title: 'Agentic RAG',
  subtitle: 'Citations and approval',
  participants: [users.me, users.assistant],
  readState: 'unread',
  unreadCount: 1,
  lastMessageAt: '2026-05-05T18:10:00.000Z',
};

const scenarios: Scenario[] = [
  {
    id: 'ai-assistant',
    label: 'AI assistant',
    eyebrow: 'Streaming, markdown, suggestions',
    description: 'A docs assistant with theme-driven bubbles, markdown, code, and starter prompts.',
    conversations,
    threads: initialThreads,
    activeConversationId: conversations[0].id,
    suggestions: sampleSuggestions,
  },
  {
    id: 'team-inbox',
    label: 'Team inbox',
    eyebrow: 'Multi-conversation',
    description:
      'Inbox and thread layout with unread state, grouped messages, and compact density.',
    conversations,
    threads: initialThreads,
    activeConversationId: conversations[1].id,
    suggestions: ['Summarize this thread', 'Show unresolved questions', 'Draft a follow-up'],
  },
  {
    id: 'support-widget',
    label: 'Support widget',
    eyebrow: 'Focused embedded support',
    description: 'Thread-only support surface with attachments, helper text, and a tighter layout.',
    conversations: [supportConversation],
    activeConversationId: supportConversation.id,
    suggestions: ['Upload a receipt', 'Explain this charge', 'Talk to a human'],
    threads: {
      [supportConversation.id]: [
        {
          id: 'support-1',
          conversationId: supportConversation.id,
          role: 'user',
          author: users.me,
          createdAt: '2026-05-05T15:30:00.000Z',
          status: 'read',
          parts: [{ type: 'text', text: 'Can you help me understand my latest invoice?' }],
        },
        {
          id: 'support-2',
          conversationId: supportConversation.id,
          role: 'assistant',
          author: users.assistant,
          createdAt: '2026-05-05T15:31:00.000Z',
          status: 'read',
          parts: [
            {
              type: 'text',
              text: 'Yes. Attach the invoice PDF and I can compare the line items against your plan.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'agentic-rag',
    label: 'Agentic RAG',
    eyebrow: 'Sources, tools, approvals',
    description: 'An agent-style answer with citations, code, and a human approval checkpoint.',
    conversations: [ragConversation],
    activeConversationId: ragConversation.id,
    suggestions: ['Search the docs', 'Compare slot APIs', 'Approve tool call'],
    threads: {
      [ragConversation.id]: [
        {
          id: 'rag-workbench-1',
          conversationId: ragConversation.id,
          role: 'user',
          author: users.me,
          createdAt: '2026-05-05T18:00:00.000Z',
          status: 'read',
          parts: [{ type: 'text', text: 'Map the composer slots and show a minimal override.' }],
        },
        {
          id: 'rag-workbench-2',
          conversationId: ragConversation.id,
          role: 'assistant',
          author: users.assistant,
          createdAt: '2026-05-05T18:03:00.000Z',
          status: 'read',
          parts: [
            {
              type: 'text',
              text: `The composer is a compound form. The main slots are \`composerRoot\`, \`composerInput\`, \`composerToolbar\`, \`composerAttachButton\`, and \`composerSendButton\`.

\`\`\`tsx
<ChatBox
  slotProps={{
    composerInput: { placeholder: 'Ask about this page...' },
    composerSendButton: { sx: { borderRadius: 2 } },
  }}
/>
\`\`\`

Use \`features.attachments\` when you need validation or want to hide the attach controls.`,
            },
          ],
        },
      ],
    },
  },
];

interface ScenarioWorkbenchProps {
  variant: ChatVariant;
  density: ChatDensity;
  layoutMode: ChatBoxLayoutMode | 'auto';
}

export function ScenarioWorkbench({ variant, density, layoutMode }: ScenarioWorkbenchProps) {
  const [activeScenarioId, setActiveScenarioId] = React.useState<ScenarioId>('ai-assistant');
  const activeScenario =
    scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];
  const adapter = React.useMemo<ChatAdapter>(
    () => makeAdapter(activeScenario.threads),
    [activeScenario],
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ px: { xs: 2, md: 2.5 }, pt: { xs: 2, md: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{ justifyContent: 'space-between', alignItems: { md: 'flex-end' } }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h6">Live workbench</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                Switch realistic chat surfaces while the global theme, density, variant, and layout
                controls stay active.
              </Typography>
            </Stack>
            <Chip size="small" color="primary" variant="outlined" label={activeScenario.eyebrow} />
          </Stack>
          <Tabs
            value={activeScenarioId}
            onChange={(_, next) => setActiveScenarioId(next)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Chat gallery scenarios"
            sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, textTransform: 'none' } }}
          >
            {scenarios.map((scenario) => (
              <Tab key={scenario.id} value={scenario.id} label={scenario.label} />
            ))}
          </Tabs>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 280px' },
          gap: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            height: { xs: 560, md: 640 },
            minWidth: 0,
            overflow: 'hidden',
            bgcolor: 'background.default',
          }}
        >
          <ChatBox
            key={activeScenario.id}
            adapter={adapter}
            currentUser={users.me}
            members={[users.me, users.assistant, users.alice]}
            initialConversations={activeScenario.conversations}
            initialActiveConversationId={activeScenario.activeConversationId}
            variant={variant}
            density={density}
            layoutMode={layoutMode === 'auto' ? undefined : layoutMode}
            suggestions={activeScenario.suggestions}
            features={{
              conversationList: activeScenario.conversations.length > 1,
              conversationHeader: true,
              scrollToBottom: true,
              attachments: true,
              helperText: true,
              autoScroll: true,
              suggestions: true,
            }}
            sx={{ height: '100%' }}
          />
        </Box>
        <Stack
          spacing={1.25}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderTop: { xs: '1px solid', lg: 0 },
            borderLeft: { lg: '1px solid' },
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {activeScenario.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeScenario.description}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
            <Chip
              size="small"
              label={`${activeScenario.conversations.length} thread${activeScenario.conversations.length === 1 ? '' : 's'}`}
            />
            <Chip size="small" variant="outlined" label={`layout: ${layoutMode}`} />
            <Chip size="small" variant="outlined" label={`density: ${density}`} />
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
