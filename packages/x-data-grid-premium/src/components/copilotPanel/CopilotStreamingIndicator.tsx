'use client';
import * as React from 'react';
import { keyframes, styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useMessageContext } from '@mui/x-chat-headless';

// Wave: each dot scales up + brightens in sequence. Action is compressed
// into the first ~30% of a long cycle so there's a generous rest between
// turns — tuned to feel calm and unhurried rather than fidgety.
const wave = keyframes`
  0%, 30%, 100% { transform: scale(0.72); opacity: 0.42; }
  15%           { transform: scale(1.16); opacity: 0.92; }
`;

const Wrap = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotStreamingIndicator',
})({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 14,
  marginTop: vars.spacing(0.5),
  '& > span': {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: vars.colors.foreground.muted,
    animation: `${wave} 2.6s ease-in-out infinite`,
  },
  '& > span:nth-of-type(2)': { animationDelay: '0.18s' },
  '& > span:nth-of-type(3)': { animationDelay: '0.36s' },
});

function CopilotStreamingIndicator() {
  const ctx = useMessageContext();
  const message = ctx.message;
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
