'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import { ChatBox } from '@mui/x-chat';
import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
  demoUsers,
} from 'docs/data/chat/material/examples/shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

const RichItemContentSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      conversation?: ChatConversation;
      unread?: boolean;
    };
  }
>(function RichItemContentSlot({ ownerState, children, ...props }, ref) {
  const { conversation, unread } = ownerState ?? {};
  const participantCount = conversation?.participants?.length ?? 0;

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        flex: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="body2"
          noWrap
          sx={{
            fontWeight: unread ? 'fontWeightBold' : 'fontWeightMedium',
            flex: 1,
          }}
        >
          {conversation?.title}
        </Typography>
        {participantCount > 2 && (
          <GroupIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" noWrap>
        {conversation?.subtitle ?? 'No messages yet'}
      </Typography>
    </Box>
  );
});

// Create conversations with extra participants so the group icon shows
const richConversations: ChatConversation[] = inboxConversations.map(
  (conv, index) => ({
    ...conv,
    participants:
      index === 0
        ? [demoUsers.alice, demoUsers.marco, demoUsers.priya, demoUsers.agent]
        : conv.participants,
  }),
);

const adapter = createEchoAdapter();

export default function RichItemContent() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => richConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    richConversations.map((c) => ({ ...c })),
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
        setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
        setConversations((prev) =>
          syncConversationPreview(prev, activeConversationId, nextMessages),
        );
      }}
      slotProps={{
        conversationList: {
          slots: { itemContent: RichItemContentSlot },
        },
      }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
