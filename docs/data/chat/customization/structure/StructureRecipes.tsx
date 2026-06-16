'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';

const adapter = createEchoAdapter();

function CustomEmptyState() {
  return (
    <Stack spacing={1} sx={{ alignItems: 'center', p: 4 }}>
      <AutoAwesomeIcon />
      <Typography variant="h6">Ask me anything</Typography>
    </Stack>
  );
}

function CustomSendButton(props: React.ComponentProps<typeof IconButton>) {
  return (
    <IconButton {...props}>
      <SendRoundedIcon />
    </IconButton>
  );
}

export default function StructureRecipes() {
  return (
    <ChatBox
      adapter={adapter}
      slots={{
        emptyState: CustomEmptyState,
        composerSendButton: CustomSendButton,
      }}
      features={{ attachments: false }}
      localeText={{ composerInputPlaceholder: 'Ask anything...' }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
