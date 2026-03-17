import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/shared/demoData';
import {
  cloneConversations,
  cloneMessages,
} from 'docsx/data/chat/material/shared/demoUtils';

const adapter = createEchoAdapter();

export default function ChatBoxControlled() {
  const [activeConversationId, setActiveConversationId] = React.useState('triage');
  const [conversations, setConversations] = React.useState(() =>
    cloneConversations(inboxConversations),
  );
  const [messages, setMessages] = React.useState(() =>
    cloneMessages(inboxThreads.triage),
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ height: 480 }}>
          <ChatBox
            activeConversationId={activeConversationId}
            adapter={adapter}
            conversations={conversations}
            messages={messages}
            onActiveConversationChange={setActiveConversationId}
            onConversationsChange={setConversations}
            onMessagesChange={setMessages}
          />
        </Box>
      </Paper>
      <Typography color="text.secondary" variant="caption">
        Active: {activeConversationId ?? 'none'} · Conversations:{' '}
        {conversations.length} · Messages: {messages.length}
      </Typography>
    </Box>
  );
}
