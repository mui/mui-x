import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { ChatMessageSkeleton, ChatConversationSkeleton } from '@mui/x-chat';

export default function SkeletonLoading() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography gutterBottom variant="h6">
          Message skeletons
        </Typography>
        <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: 2 }}>
          <Stack spacing={2}>
            <ChatMessageSkeleton align="assistant" lines={3} />
            <ChatMessageSkeleton align="user" lines={1} />
            <ChatMessageSkeleton align="assistant" lines={2} />
            <ChatMessageSkeleton align="user" lines={2} />
          </Stack>
        </Paper>
      </Box>
      <Divider />
      <Box>
        <Typography gutterBottom variant="h6">
          Conversation skeletons
        </Typography>
        <Paper
          elevation={0}
          sx={{ border: 1, borderColor: 'divider', p: 1, maxWidth: 320 }}
        >
          <Stack spacing={0.5}>
            <ChatConversationSkeleton />
            <ChatConversationSkeleton />
            <ChatConversationSkeleton />
          </Stack>
        </Paper>
      </Box>
      <Divider />
      <Box>
        <Typography gutterBottom variant="h6">
          Dense conversation skeletons
        </Typography>
        <Paper
          elevation={0}
          sx={{ border: 1, borderColor: 'divider', p: 1, maxWidth: 320 }}
        >
          <Stack spacing={0.5}>
            <ChatConversationSkeleton dense />
            <ChatConversationSkeleton dense />
            <ChatConversationSkeleton dense />
            <ChatConversationSkeleton dense />
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
