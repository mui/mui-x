import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatMessageSkeleton, ChatConversationSkeleton } from '@mui/x-chat';

export default function SkeletonStates() {
  return (
    <Stack spacing={2}>
      <Box>
        <Typography gutterBottom variant="subtitle2">
          Message skeletons
        </Typography>
        <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: 2 }}>
          <Stack spacing={2}>
            <ChatMessageSkeleton align="assistant" lines={3} />
            <ChatMessageSkeleton align="user" lines={1} />
            <ChatMessageSkeleton align="assistant" lines={2} />
          </Stack>
        </Paper>
      </Box>
      <Box>
        <Typography gutterBottom variant="subtitle2">
          Conversation skeletons
        </Typography>
        <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: 2 }}>
          <Stack spacing={1}>
            <ChatConversationSkeleton />
            <ChatConversationSkeleton />
            <ChatConversationSkeleton dense />
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
