---
productId: x-chat
title: Chat - Messages
packageName: '@mui/x-chat'
components: ChatMessageRoot, ChatMessageAvatar, ChatMessageContent, ChatMessageMeta, ChatMessageActions, ChatMessageGroup, ChatDateDivider, ChatMarkdownTextPart, ChatMessageSkeleton
---

# Messages

Styled message components render user and assistant messages with avatars, metadata, grouping, date dividers, and AI-specific part renderers.

## Message anatomy

Each message is composed from sub-components:

- `ChatMessageRoot` — container with role-based alignment
- `ChatMessageAvatar` — uses `MuiAvatar` with user images or initials
- `ChatMessageContent` — bubble with part renderers
- `ChatMessageMeta` — timestamp, status, and edited indicators
- `ChatMessageActions` — hover/focus action buttons

`ChatMessageGroup` groups consecutive messages from the same author, applying connected corner styles and collapsing repeated avatars.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  demoUsers,
  createTextMessage,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

const messages = [
  createTextMessage({
    id: 'g1-a1',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-16T09:00:00.000Z',
    text: 'Good morning. I prepared the deployment summary.',
  }),
  createTextMessage({
    id: 'g1-a2',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-16T09:01:00.000Z',
    text: 'All integration tests passed. The staging environment is healthy.',
  }),
  createTextMessage({
    id: 'g1-u1',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-16T09:05:00.000Z',
    text: 'Great. Ship it to production.',
  }),
  createTextMessage({
    id: 'g2-a1',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T10:00:00.000Z',
    text: 'This message is from the next day, so a date divider appears above it.',
  }),
];

export default function MessageAnatomy() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox adapter={adapter} defaultMessages={messages} />
      </Box>
    </Paper>
  );
}
```

## Markdown rendering

The built-in `ChatMarkdownTextPart` renders markdown content with:

- Headings, paragraphs, lists, and inline formatting
- Fenced code blocks with syntax highlighting and a copy button
- Streaming-safe incremental parsing

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { markdownMessages } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function MarkdownMessages() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560 }}>
        <ChatBox adapter={adapter} defaultMessages={markdownMessages} />
      </Box>
    </Paper>
  );
}
```

## AI part renderers

The styled layer ships renderers for common AI message parts:

- **Reasoning**: collapsible panel showing the model's chain of thought
- **Tool calls**: state-specific card (streaming, approval-requested, completed, error)
- **Source URLs**: clickable reference links
- **Source documents**: document reference cards
- **Files**: inline images and file download links

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { aiPartMessages } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function AiPartRenderers() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560 }}>
        <ChatBox adapter={adapter} defaultMessages={aiPartMessages} />
      </Box>
    </Paper>
  );
}
```

## Custom part renderers

Override the default rendering for any part type using the `partRenderers` prop.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ChatAdapter } from '@mui/x-chat/headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

function CustomTextPart(props: { part: { type: 'text'; text: string } }) {
  return (
    <Typography
      sx={{
        fontFamily: '"Georgia", serif',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        color: 'text.primary',
      }}
    >
      {props.part.text}
    </Typography>
  );
}

export default function CustomPartRenderer() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 400 }}>
        <ChatBox
          adapter={adapter}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T10:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'This text uses a custom serif font renderer instead of the default markdown renderer.',
                },
              ],
            },
            {
              id: 'm2',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T10:01:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'The partRenderers prop lets you replace any part type while keeping the rest of the chat surface unchanged.',
                },
              ],
            },
          ]}
          partRenderers={{
            text: (partProps) => <CustomTextPart part={partProps.part} />,
          }}
        />
      </Box>
    </Paper>
  );
}
```

## Date dividers

`ChatDateDivider` renders a centered date label between messages from different days.
It is automatically inserted by `ChatConversation` when dates change in the message list.

## See also

- See [Unstyled messages](/x/react-chat/unstyled/messages/) for the structural primitive model.
- See [Headless message parts](/x/react-chat/headless/examples/message-parts/) for the part type reference.
