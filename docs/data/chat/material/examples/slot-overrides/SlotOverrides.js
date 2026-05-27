'use client';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ChatBox, ChatMessageContent } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

/**
 * A custom message content component that wraps the default ChatMessageContent
 * and replaces the inner bubble slot with a Paper-based component.
 */
const PaperBubble = React.forwardRef(function PaperBubble(
  { ownerState, children, ...other },
  ref,
) {
  const isUser = ownerState?.role === 'user';

  return (
    <Paper
      ref={ref}
      elevation={isUser ? 0 : 3}
      {...other}
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 3,
        bgcolor: isUser ? 'primary.main' : 'background.paper',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        fontSize: 'body2.fontSize',
        lineHeight: 'body2.lineHeight',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        border: isUser ? 'none' : '1px solid',
        borderColor: 'divider',
      }}
    >
      {children}
    </Paper>
  );
});

/**
 * A custom messageContent slot that delegates to the default ChatMessageContent
 * but swaps the inner bubble slot for PaperBubble.
 */
const CustomMessageContent = React.forwardRef(
  function CustomMessageContent(props, ref) {
    return (
      <ChatMessageContent
        ref={ref}
        {...props}
        slots={{
          ...props.slots,
          bubble: PaperBubble,
        }}
      />
    );
  },
);

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". This reply uses a Paper component as the message bubble — swapped in via slots.messageContent.`,
});

export default function SlotOverrides() {
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
