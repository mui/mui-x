'use client';
import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function AutoScrollConfig() {
  const [autoScroll, setAutoScroll] = React.useState(true);

  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={autoScroll}
            onChange={(event) => setAutoScroll(event.target.checked)}
          />
        }
        label="Auto-scroll"
      />
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        features={{ autoScroll }}
        sx={{
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </div>
  );
}
