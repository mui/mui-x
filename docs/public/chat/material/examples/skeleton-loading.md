---
productId: x-chat
title: Chat - Skeleton loading
packageName: '@mui/x-chat'
---

# Skeleton loading

All loading and bootstrapping states including conversation skeletons, message skeletons, and history loading indicators.

```tsx
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { ChatMessageSkeleton, ChatConversationSkeleton } from '@mui/x-chat';

export default function SkeletonLoading() {
  return (
    <Stack spacing={3}>
      <div>
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
      </div>
      <Divider />
      <div>
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
      </div>
      <Divider />
      <div>
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
      </div>
    </Stack>
  );
}
```

## What this example demonstrates

- `ChatMessageSkeleton` with different alignments and line counts
- `ChatConversationSkeleton` in both default and dense modes
- Usage as placeholders while data loads from the adapter
