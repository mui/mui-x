'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatComposer } from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  demoUsers,
  minimalConversation,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter({ respond: () => 'echo' });

function VariantCard({ title, description, children }) {
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
      <Stack spacing={0.25}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      <div>{children}</div>
    </Paper>
  );
}

export default function ComposerVariantsDemo() {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        width: '100%',
      }}
    >
      <ChatProvider
        adapter={adapter}
        currentUser={demoUsers.you}
        members={[demoUsers.you, demoUsers.agent]}
        initialConversations={[minimalConversation]}
        initialActiveConversationId={minimalConversation.id}
      >
        <VariantCard
          title='variant="default"'
          description="Stacked layout — attachment list, textarea, then toolbar with attach + send."
        >
          <ChatComposer variant="default" />
        </VariantCard>
      </ChatProvider>

      <ChatProvider
        adapter={adapter}
        currentUser={demoUsers.you}
        members={[demoUsers.you, demoUsers.agent]}
        initialConversations={[minimalConversation]}
        initialActiveConversationId={minimalConversation.id}
      >
        <VariantCard
          title='variant="compact"'
          description="Inline layout — attach button, textarea and send button share a single row."
        >
          <ChatComposer variant="compact" />
        </VariantCard>
      </ChatProvider>
    </Box>
  );
}
