'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useChatComposer } from '@mui/x-chat/headless';
import { ComposerDemoShell } from './ComposerDemoShell';

function ComposerInfo() {
  const composer = useChatComposer();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        Current value: {composer.value ? `"${composer.value}"` : '(empty)'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Attachments: {composer.attachments.length}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Submitting: {composer.isSubmitting ? 'Yes' : 'No'}
      </Typography>
      <Button
        size="small"
        onClick={() => composer.clear()}
        sx={{ alignSelf: 'flex-start' }}
      >
        Clear
      </Button>
    </Box>
  );
}

export default function ComposerHookStateStandalone() {
  return (
    <ComposerDemoShell
      beforeComposer={<ComposerInfo />}
      helperText="Type, attach a file, or send to watch the hook state update."
    />
  );
}
