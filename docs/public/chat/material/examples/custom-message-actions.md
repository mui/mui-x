---
productId: x-chat
title: Chat - Custom message actions
packageName: '@mui/x-chat'
---

# Custom message actions

<p class="description">Add custom action buttons to messages using the <code>messageActions</code> slot — copy, thumbs up, thumbs down, and more.</p>

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDownOutlined';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(c) {
        c.close();
      },
    });
  },
};

const CustomActions = React.forwardRef(function CustomActions(
  props: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { ownerState, ...other } = props;
  const role =
    typeof ownerState === 'object' && ownerState && 'role' in ownerState
      ? ownerState.role
      : undefined;

  if (role !== 'assistant') {
    return null;
  }

  return (
    <Box ref={ref} sx={{ display: 'flex', gap: 0.5 }} {...other}>
      <Tooltip title="Copy">
        <IconButton size="small">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Good response">
        <IconButton size="small">
          <ThumbUpIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bad response">
        <IconButton size="small">
          <ThumbDownIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
});

export default function CustomMessageActions() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox
          adapter={adapter}
          defaultMessages={[
            {
              id: 'm1',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'Explain the benefits of server-side rendering.',
                },
              ],
            },
            {
              id: 'm2',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:01:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'Server-side rendering improves initial load performance by sending fully rendered HTML to the client. This benefits SEO, reduces time-to-first-paint, and works better on low-powered devices.',
                },
              ],
            },
            {
              id: 'm3',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T09:02:00.000Z',
              parts: [{ type: 'text', text: 'What about streaming SSR?' }],
            },
            {
              id: 'm4',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:03:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'Streaming SSR sends HTML in chunks as components resolve. This further reduces time-to-first-byte and allows the browser to start rendering before the full page is ready.',
                },
              ],
            },
          ]}
          slots={{ messageActions: CustomActions }}
        />
      </Box>
    </Paper>
  );
}
```

## What this example demonstrates

- Replacing the `messageActions` slot on `ChatBox`
- Using `ownerState` to conditionally show actions based on message role
- Custom icon buttons for copy, thumbs up, and thumbs down
- Accessible labels and tooltips for each action
