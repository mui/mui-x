import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function ConversationsDense() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox
          adapter={adapter}
          defaultActiveConversationId="design"
          defaultConversations={inboxConversations}
          defaultMessages={inboxThreads.design}
          slotProps={{
            conversations: { dense: true },
          }}
        />
      </Box>
    </Paper>
  );
}
