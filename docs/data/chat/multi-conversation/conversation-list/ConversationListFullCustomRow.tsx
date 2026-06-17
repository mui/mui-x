import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatConversationList } from '@mui/x-chat';
import type {
  ConversationListItemOwnerState,
  ConversationListItemProps,
} from '@mui/x-chat/headless';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { directoryConversations } from 'docs/src/modules/components/chat-playground/sharedFixtures';

function formatRelativeTime(iso?: string) {
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

type FullCustomRowProps = ConversationListItemProps & {
  ownerState?: ConversationListItemOwnerState;
};

const FullCustomRow = React.forwardRef<HTMLDivElement, FullCustomRowProps>(
  function FullCustomRow({ ownerState, ...props }, ref) {
    const { conversation, selected, unread } = ownerState ?? {};
    const title = conversation?.title ?? 'Untitled';
    const initials = title
      .split(' ')
      .slice(0, 2)
      .map((word) => word[0])
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
              noWrap
              sx={{
                fontWeight: unread ? 'fontWeightBold' : 'fontWeightMedium',
                flex: 1,
              }}
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
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ display: 'block' }}
          >
            {conversation?.subtitle ?? 'No messages yet'}
          </Typography>
        </Box>
      </Box>
    );
  },
);

const activeId = directoryConversations[0].id;

export default function ConversationListFullCustomRow() {
  return (
    <ScopedChat
      conversations={directoryConversations}
      activeConversationId={activeId}
    >
      <Box
        sx={{
          height: 320,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <ChatConversationList slots={{ item: FullCustomRow }} />
      </Box>
    </ScopedChat>
  );
}
