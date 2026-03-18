---
productId: x-chat
title: Chat - Composer
packageName: '@mui/x-chat'
components: ChatConversationInputTextArea, ChatConversationInputSendButton, ChatConversationInputAttachButton, ChatConversationInputToolbar, ChatConversationInputHelperText
---

# Composer

<p class="description"><code>ChatConversationInput</code> provides a styled message input with auto-growing textarea, send button, attachment button, toolbar, and helper text.</p>

## Default layout

The default composer renders an outlined input with a send button.
The input auto-grows as the draft expands and submits on Enter (Shift+Enter for a new line).

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';

const adapter = createEchoAdapter();

export default function ComposerBasic() {
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
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'Type a message below. The input auto-grows and submits on Enter.',
                },
              ],
            },
          ]}
        />
      </Box>
    </Paper>
  );
}

```

## Toolbar and helper text

Add a toolbar row for additional actions and helper text for draft-level status messages.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';

const adapter = createEchoAdapter();

export default function ComposerWithToolbar() {
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
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'This composer has a custom placeholder and attach button. Try attaching a file or sending a message.',
                },
              ],
            },
          ]}
          localeText={{
            composerInputPlaceholder: 'Ask the assistant anything...',
          }}
        />
      </Box>
    </Paper>
  );
}

```

## Sub-components

`ChatConversationInput` is composed from:

- `ChatConversationInputTextArea` — auto-growing textarea with IME-safe Enter behavior
- `ChatConversationInputSendButton` — submit button that disables when the draft is empty or streaming
- `ChatConversationInputAttachButton` — file input trigger with hidden file picker
- `ChatConversationInputToolbar` — toolbar row for action buttons
- `ChatConversationInputHelperText` — status text below the input

Each sub-component can be used independently for custom layouts or replaced through slots.

## Slot customization

Replace individual parts through the `slots` prop:

```tsx
<ChatConversationInput
  slots={{
    input: CustomTextarea,
    sendButton: CustomSendButton,
  }}
/>
```

## Adjacent pages

- See [Unstyled composer](/x/react-chat/unstyled/composer/) for the structural primitive model.
- See [Slots](/x/react-chat/material/slots/) for the complete slot reference.
