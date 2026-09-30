'use client';
import * as React from 'react';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  ChatComposer,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatConversation,
  ChatConversationList,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatProvider, createEchoAdapter } from '@mui/x-chat/headless';

const BILLING_ID = 'conv-billing';
const ONBOARDING_ID = 'conv-onboarding';

const adapter = createEchoAdapter({
  respond: (text) =>
    `You said: "${text || 'nothing'}". The runtime still works under a controlled model.`,
});

const initialConversations = [
  { id: BILLING_ID, title: 'Billing' },
  { id: ONBOARDING_ID, title: 'Onboarding' },
];

const initialMessages = [
  {
    id: 'billing-1',
    conversationId: BILLING_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
      {
        type: 'text' as const,
        text: 'Welcome to billing support. How can I help with your invoice?',
      },
    ],
  },
  {
    id: 'billing-2',
    conversationId: BILLING_ID,
    role: 'user' as const,
    status: 'sent' as const,
    parts: [{ type: 'text' as const, text: 'I was charged twice this month.' }],
  },
  {
    id: 'onboarding-1',
    conversationId: ONBOARDING_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
      {
        type: 'text' as const,
        text: 'Welcome aboard! Let me walk you through setup.',
      },
    ],
  },
  {
    id: 'onboarding-2',
    conversationId: ONBOARDING_ID,
    role: 'user' as const,
    status: 'sent' as const,
    parts: [{ type: 'text' as const, text: 'Where do I add my team members?' }],
  },
];

export default function ControlledActiveConversation() {
  const [activeId, setActiveId] = React.useState<string | undefined>(BILLING_ID);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <ToggleButtonGroup
          exclusive
          size="small"
          value={activeId}
          onChange={(event, nextId) => {
            if (nextId) {
              setActiveId(nextId);
            }
          }}
          aria-label="Active conversation"
        >
          <ToggleButton value={BILLING_ID}>Billing</ToggleButton>
          <ToggleButton value={ONBOARDING_ID}>Onboarding</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="caption" color="text.secondary">
          activeConversationId: {activeId ?? 'undefined'}
        </Typography>
      </Box>
      <ChatProvider
        adapter={adapter}
        activeConversationId={activeId}
        onActiveConversationChange={setActiveId}
        initialConversations={initialConversations}
        initialMessages={initialMessages}
      >
        <Box
          sx={{
            display: 'flex',
            height: 420,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            boxSizing: 'border-box',
            '*, *::before, *::after': { boxSizing: 'inherit' },
          }}
        >
          <Box sx={{ width: 220, flexShrink: 0 }}>
            <ChatConversationList
              slotProps={{ root: { 'aria-label': 'Conversations' } }}
            />
          </Box>
          <ChatConversation>
            <ChatMessageList />
            <ChatComposer>
              <ChatComposerTextArea placeholder="Type a message…" />
              <ChatComposerToolbar>
                <ChatComposerSendButton aria-label="Send message">
                  <SendIcon />
                </ChatComposerSendButton>
              </ChatComposerToolbar>
            </ChatComposer>
          </ChatConversation>
        </Box>
      </ChatProvider>
    </Box>
  );
}
