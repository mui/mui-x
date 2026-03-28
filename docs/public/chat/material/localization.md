---
productId: x-chat
title: Chat - Localization
packageName: '@mui/x-chat'
---

# Localization

<p class="description">Customize all user-facing strings through the <code>localeText</code> prop or theme-level injection.</p>

## The `localeText` prop

Pass `localeText` to `ChatBox` or to the `ChatRoot` provider to override any user-facing string.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function LocaleTextDemo() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 400 }}>
        <ChatBox
          adapter={adapter}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'This demo uses custom locale text. The composer placeholder, send button label, and thread empty text are all customized.',
                },
              ],
            },
          ]}
          localeText={{
            composerInputPlaceholder: 'Ask me anything...',
            composerSendButtonLabel: 'Submit',
            composerAttachButtonLabel: 'Upload file',
            threadNoMessagesLabel: 'Start a conversation',
            scrollToBottomLabel: 'Jump to latest',
          }}
        />
      </Box>
    </Paper>
  );
}
```

## Available locale keys

The chat surface exposes these localizable strings:

| Key                                    | Default (en-US)          |
| :------------------------------------- | :----------------------- |
| `composerInputPlaceholder`             | "Type a message"         |
| `composerInputAriaLabel`               | "Message input"          |
| `composerSendButtonLabel`              | "Send"                   |
| `composerAttachButtonLabel`            | "Attach files"           |
| `messageCopyCodeButtonLabel`           | "Copy"                   |
| `messageCopiedCodeButtonLabel`         | "Copied"                 |
| `messageEditedLabel`                   | "Edited"                 |
| `messageReasoningLabel`                | "Reasoning"              |
| `messageReasoningStreamingLabel`       | "Thinking..."            |
| `messageToolInputLabel`                | "Input"                  |
| `messageToolOutputLabel`               | "Output"                 |
| `messageToolApproveButtonLabel`        | "Approve"                |
| `messageToolDenyButtonLabel`           | "Deny"                   |
| `retryButtonLabel`                     | "Retry"                  |
| `historyErrorLabel`                    | "Failed to load history" |
| `conversationListNoConversationsLabel` | "No conversations"       |
| `unreadMarkerLabel`                    | "New messages"           |
| `scrollToBottomLabel`                  | "Scroll to bottom"       |
| `threadNoMessagesLabel`                | "No messages yet"        |
| `loadingLabel`                         | "Loading..."             |

Some keys are functions that receive runtime values:

- `messageStatusLabel(status)` — returns status text for pending, sending, sent, error, and cancelled states
- `messageTimestampLabel(dateTime)` — formats message timestamps
- `conversationTimestampLabel(dateTime)` — formats conversation list timestamps
- `typingIndicatorLabel(users)` — returns typing indicator text
- `scrollToBottomWithCountLabel(count)` — returns scroll button text with unseen count

## See also

- See [Theming](/x/react-chat/material/theming/) for visual customization.
- See [Headless overview](/x/react-chat/headless/) for the runtime localization contract.
