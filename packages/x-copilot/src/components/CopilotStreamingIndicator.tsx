'use client';
import * as React from 'react';
import { keyframes, styled } from '@mui/material/styles';
import { type ChatMessage, useMessageContext } from '@mui/x-chat-headless';

// Wave: each dot scales up + brightens in sequence. Action is compressed
// into the first ~30% of a long cycle so there's a generous rest between
// turns — tuned to feel calm and unhurried rather than fidgety.
const wave = keyframes`
  0%, 30%, 100% { transform: scale(0.72); opacity: 0.42; }
  15%           { transform: scale(1.16); opacity: 0.92; }
`;

const Wrap = styled('div', {
  name: 'MuiCopilotStreamingIndicator',
  slot: 'Root',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 14,
  marginTop: theme.spacing(0.5),
  '& > span': {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: (theme.vars || theme).palette.text.secondary,
    animation: `${wave} 2.6s ease-in-out infinite`,
  },
  '& > span:nth-of-type(2)': { animationDelay: '0.18s' },
  '& > span:nth-of-type(3)': { animationDelay: '0.36s' },
}));

export interface CopilotStreamingIndicatorProps {
  /**
   * The assistant message to reflect. Falls back to the surrounding
   * `MessageContext` when omitted (the default when mounted inside a chat
   * message).
   */
  message?: ChatMessage | null;
}

/**
 * Generic "generating response" animated dots, shown only while the assistant
 * message is streaming.
 */
function CopilotStreamingIndicator(props: CopilotStreamingIndicatorProps) {
  const ctx = useMessageContext();
  const message = props.message !== undefined ? props.message : ctx.message;
  if (!message || message.role !== 'assistant' || message.status !== 'streaming') {
    return null;
  }
  return (
    <Wrap aria-label="Generating response">
      <span />
      <span />
      <span />
    </Wrap>
  );
}

export { CopilotStreamingIndicator };
