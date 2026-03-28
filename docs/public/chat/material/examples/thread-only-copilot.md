---
productId: x-chat
title: Chat - Thread-only copilot
packageName: '@mui/x-chat'
---

# Thread-only copilot

A minimal embedded AI copilot with streaming markdown responses — ideal for dashboards and admin tools.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { ChatAdapter, ChatMessageChunk } from '@mui/x-chat/headless';
import { ChatBox } from '@mui/x-chat';
import { createChunkStream } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

function createMarkdownResponse(
  messageId: string,
  text: string,
): ChatMessageChunk[] {
  const textId = `${messageId}-text`;
  return [
    { type: 'start', messageId },
    { type: 'text-start', id: textId },
    ...text
      .match(/.{1,18}/g)!
      .map(
        (delta) => ({ type: 'text-delta', id: textId, delta }) as ChatMessageChunk,
      ),
    { type: 'text-end', id: textId },
    { type: 'finish', messageId, finishReason: 'stop' },
  ];
}

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const responseId = `resp-${message.id}`;
    const response =
      '### Quick Answer\n\nBased on the current metrics:\n\n- **CPU usage**: 42% average\n- **Memory**: 3.2 GB / 8 GB\n- **Requests**: 1,240/min\n\nAll within normal operating parameters. No action required.';
    return createChunkStream(createMarkdownResponse(responseId, response), {
      delayMs: 50,
    });
  },
};

export default function ThreadOnlyCopilot() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox
          adapter={adapter}
          initialMessages={[
            {
              id: 'seed-1',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [{ type: 'text', text: 'What is the current system status?' }],
            },
            {
              id: 'seed-2',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:01:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: '### System Status\n\nAll services are **operational**.\n\n| Service | Status | Latency |\n|---------|--------|---------|\n| API | Healthy | 45ms |\n| Database | Healthy | 12ms |\n| Cache | Healthy | 3ms |\n\nNo incidents in the last 24 hours.',
                },
              ],
            },
          ]}
          localeText={{ composerInputPlaceholder: 'Ask the copilot...' }}
        />
      </Box>
    </Paper>
  );
}
```

## What this example demonstrates

- Thread-only layout (no conversations sidebar)
- Streaming text with markdown formatting
- Compact height suitable for embedding in panels
- The adapter pattern for AI-style single-turn responses
