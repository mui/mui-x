'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ComposerControlled() {
  const [value, setValue] = React.useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Composer value: {value ? `"${value}"` : '(empty)'}
      </Typography>
      <ChatBox
        adapter={adapter}
        defaultActiveConversationId={minimalConversation.id}
        defaultConversations={[minimalConversation]}
        defaultMessages={minimalMessages}
        composerValue={value}
        onComposerValueChange={setValue}
        sx={{
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </Box>
  );
}
