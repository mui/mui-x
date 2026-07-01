'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';

import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  demoUsers,
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter({ respond: () => 'echo' });

function VariantPanel({ variant, caption }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {caption}
      </Typography>
      <Box sx={{ height: 380 }}>
        <ChatBox
          adapter={adapter}
          currentUser={demoUsers.you}
          members={[demoUsers.you, demoUsers.agent]}
          initialConversations={[minimalConversation]}
          initialMessages={minimalMessages}
          initialActiveConversationId={minimalConversation.id}
          variant={variant}
          sx={{ height: '100%' }}
        />
      </Box>
    </Paper>
  );
}

export default function MessageVariantsDemo() {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        width: '100%',
      }}
    >
      <VariantPanel variant="default" caption='variant="default"' />
      <VariantPanel variant="compact" caption='variant="compact"' />
    </Box>
  );
}
