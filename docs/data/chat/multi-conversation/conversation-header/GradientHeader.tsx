import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderActions,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
} from '@mui/x-chat';
import type { ChatConversation as ChatConversationType } from '@mui/x-chat/headless';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';

const conversations: ChatConversationType[] = [
  { id: 'design', title: 'Design crit', subtitle: 'Weekly sync' },
];

const StyledGradientHeader = styled('header')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  '& *': { color: 'inherit' },
}));

function CustomHeader(props: React.ComponentProps<typeof ChatConversationHeader>) {
  return (
    <ChatConversationHeader {...props} slots={{ header: StyledGradientHeader }} />
  );
}

export default function GradientHeader() {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <ScopedChat conversations={conversations} activeConversationId="design">
        <ChatConversation>
          <CustomHeader>
            <ChatConversationHeaderInfo>
              <ChatConversationTitle />
              <ChatConversationSubtitle />
            </ChatConversationHeaderInfo>
            <Box sx={{ flex: 1 }} />
            <ChatConversationHeaderActions>
              <IconButton size="small" aria-label="More options">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </ChatConversationHeaderActions>
          </CustomHeader>
        </ChatConversation>
      </ScopedChat>
    </Box>
  );
}
