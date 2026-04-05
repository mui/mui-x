'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
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

function formatRelativeTime(iso) {
  if (!iso) {
    return '';
  }
  const diff = Date.now() - new Date(iso).getTime();
  if (diff <= 0) {
    return 'now';
  }
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) {
    return 'now';
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  return `${Math.floor(hours / 24)}d`;
}

const FullCustomRowSlot = React.forwardRef(function FullCustomRowSlot(
  { ownerState, ...props },
  ref,
) {
  const { conversation, selected, unread } = ownerState ?? {};
  const title = conversation?.title ?? 'Untitled';
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        cursor: 'pointer',
        bgcolor: selected ? 'action.selected' : 'transparent',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: -2,
        },
        '&:hover': {
          bgcolor: selected ? 'action.selected' : 'action.hover',
        },
      }}
    >
      <Badge
        badgeContent={conversation?.unreadCount}
        color="primary"
        max={99}
        invisible={!unread}
      >
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}>
          {initials}
        </Avatar>
      </Badge>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Typography
            variant="body2"
            fontWeight={unread ? 'fontWeightBold' : 'fontWeightMedium'}
            noWrap
            sx={{ flex: 1 }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ ml: 1, flexShrink: 0 }}
          >
            {formatRelativeTime(conversation?.lastMessageAt)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" noWrap display="block">
          {conversation?.subtitle ?? 'No messages yet'}
        </Typography>
      </Box>
    </Box>
  );
});

const adapter = createEchoAdapter();

export default function FullCustomRow() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState(() =>
    inboxConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState(() =>
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
          slots: { item: FullCustomRowSlot },
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
