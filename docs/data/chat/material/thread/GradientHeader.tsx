'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ChatBox, ChatConversationHeader } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const GradientHeaderElement = styled('header')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  '& *': { color: 'inherit' },
}));

function CustomHeader(props: React.ComponentProps<typeof ChatConversationHeader>) {
  return (
    <ChatConversationHeader {...props} slots={{ header: GradientHeaderElement }} />
  );
}

const adapter = createEchoAdapter();

export default function GradientHeader() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ conversationHeader: CustomHeader }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
