'use client';
import * as React from 'react';
import {
  ChatBox,
  ChatMessageContent,
  type ChatMessageContentProps,
} from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const BubbleWithStatusSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      streaming?: boolean;
      error?: boolean;
      status?: string;
    };
  }
>(function BubbleWithStatusSlot({ ownerState, children, ...props }, ref) {
  let dotColor = 'transparent';
  if (ownerState?.streaming) {
    dotColor = 'blue';
  } else if (ownerState?.error) {
    dotColor = 'red';
  } else if (ownerState?.status === 'sent') {
    dotColor = 'green';
  }

  return (
    <div ref={ref} {...props}>
      {children}
      <span style={{ color: dotColor, marginLeft: 4 }}>●</span>
    </div>
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
      slots={{ ...props.slots, bubble: BubbleWithStatusSlot }}
    />
  );
});

const adapter = createEchoAdapter();

export default function BubbleWithStatus() {
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
