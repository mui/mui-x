'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/examples/shared/demoData';

const demoMembers = [demoUsers.you, demoUsers.agent];

const adapter = createEchoAdapter({
  respond: (text) =>
    `Got your message: "${text}". No conversation list is needed for a single-thread copilot.`,
});

export default function ThreadOnly() {
  return (
    <ChatBox
      adapter={adapter}
      members={demoMembers}
      sx={{
        height: 460,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
