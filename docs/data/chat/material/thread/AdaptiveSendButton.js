'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import { ChatBox, ChatComposerSendButton } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const AdaptiveSendButtonSlot = React.forwardRef(function AdaptiveSendButtonSlot(
  { ownerState, ...props },
  ref,
) {
  return (
    <IconButton
      ref={ref}
      {...props}
      aria-label={ownerState?.isStreaming ? 'Stop' : 'Send'}
    >
      {ownerState?.isStreaming ? <StopIcon /> : <SendIcon />}
    </IconButton>
  );
});

function CustomSendButton(props) {
  return (
    <ChatComposerSendButton
      {...props}
      slots={{ sendButton: AdaptiveSendButtonSlot }}
    />
  );
}

const adapter = createEchoAdapter();

export default function AdaptiveSendButton() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ composerSendButton: CustomSendButton }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
