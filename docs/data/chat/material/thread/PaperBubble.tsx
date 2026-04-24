'use client';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
  ChatBox,
  ChatMessageContent,
  type ChatMessageContentProps,
} from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

const PaperBubbleSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ownerState?: { role?: string } }
>(function PaperBubbleSlot({ ownerState, children, ...other }, ref) {
  return (
    <Paper
      ref={ref}
      elevation={ownerState?.role === 'user' ? 0 : 2}
      {...other}
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 2,
        bgcolor: ownerState?.role === 'user' ? 'primary.main' : 'background.paper',
        color: ownerState?.role === 'user' ? 'primary.contrastText' : 'text.primary',
      }}
    >
      {children}
    </Paper>
  );
});

const CustomMessageContent = React.forwardRef<
  HTMLDivElement,
  ChatMessageContentProps
>(function CustomMessageContent(props, ref) {
  return (
    <ChatMessageContent
      ref={ref}
      {...props}
      slots={{ ...props.slots, bubble: PaperBubbleSlot }}
    />
  );
});

const adapter = createEchoAdapter();

export default function PaperBubble() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ messageContent: CustomMessageContent }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
