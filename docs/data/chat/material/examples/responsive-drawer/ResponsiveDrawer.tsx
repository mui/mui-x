'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/examples/shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

const adapter = createEchoAdapter({
  respond: (text) => `Received: "${text}". Try resizing the container!`,
});

export default function ResponsiveDrawer() {
  const [width, setWidth] = React.useState(720);
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    inboxConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(inboxThreads).map(([id, msgs]) => [
        id,
        msgs.map((m) => ({ ...m })),
      ]),
    ),
  );

  const messages = threads[activeConversationId] ?? [];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ px: 1, pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
          Container width
        </Typography>
        <Slider
          value={width}
          onChange={(_, value) => setWidth(value as number)}
          min={320}
          max={900}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}px`}
        />
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}
        >
          {width}px
        </Typography>
      </Box>
      <Box
        sx={{
          width,
          maxWidth: '100%',
          mx: 'auto',
          transition: 'width 200ms ease',
        }}
      >
        <ChatBox
          adapter={adapter}
          activeConversationId={activeConversationId}
          conversations={conversations}
          messages={messages}
          onActiveConversationChange={(nextId) => {
            if (nextId) {
              setActiveConversationId(nextId);
            }
          }}
          onMessagesChange={(nextMessages) => {
            setThreads((prev) => ({
              ...prev,
              [activeConversationId]: nextMessages,
            }));
            setConversations((prev) =>
              syncConversationPreview(prev, activeConversationId, nextMessages),
            );
          }}
          sx={{
            height: 500,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  );
}
