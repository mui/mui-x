import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderActions,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
} from '@mui/x-chat';

import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';

const conversations = [
  { id: 'support', title: 'Support thread', subtitle: 'Replies in ~1h' },
];

const CustomActions = React.forwardRef(function CustomActions(props, ref) {
  const { ownerState, ...other } = props;
  if (!ownerState?.hasConversation) {
    return null;
  }
  return (
    <div ref={ref} {...other}>
      <IconButton size="small" aria-label="Archive conversation">
        <ArchiveIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="More options">
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </div>
  );
});

export default function CustomHeaderActions() {
  const [active, setActive] = React.useState(true);
  // The sentinel id 'none' matches no seeded conversation, so `hasConversation`
  // is false and the custom actions hide. Toggling to `undefined` would re-select
  // the seed (see ScopedChat's initialActiveConversationId fallback).
  const activeConversationId = active ? 'support' : 'none';

  return (
    <Box sx={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Switch
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
          />
        }
        label="Active conversation"
        sx={{ mb: 1 }}
      />
      <ScopedChat
        conversations={conversations}
        activeConversationId={activeConversationId}
      >
        <ChatConversation>
          <ChatConversationHeader>
            <ChatConversationHeaderInfo>
              <ChatConversationTitle />
              <ChatConversationSubtitle />
            </ChatConversationHeaderInfo>
            <Box sx={{ flex: 1 }} />
            <ChatConversationHeaderActions slots={{ actions: CustomActions }} />
          </ChatConversationHeader>
        </ChatConversation>
      </ScopedChat>
    </Box>
  );
}
