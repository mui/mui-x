---
productId: x-chat
title: Message Actions
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageActions
---

# Chat - Message Actions

Add hover-triggered action buttons to messages for copy, edit, delete, and custom operations.



`ChatMessageActions` renders an action bar that appears when the user hovers over a message or focuses within it. The actions area is positioned in the message grid and transitions from hidden to visible using an opacity animation.

## Import

```tsx
import { ChatMessageActions } from '@mui/x-chat';
```

:::info
When using `ChatBox`, message actions are already included as a built-in part of the message composition.
You only need to import `ChatMessageActions` directly when building a custom layout.
:::

## Visibility behavior

The action bar is hidden by default (`opacity: 0`) and becomes visible when:

- The user hovers over the parent `ChatMessage` row
- Focus moves to an element inside the `ChatMessage` row (keyboard navigation)

The transition uses a short opacity animation. When the user prefers reduced motion, the transition is disabled.

```css
/* Visibility is controlled by the parent message's hover/focus state */
.MuiChatMessage-root:hover .MuiChatMessage-actions,
.MuiChatMessage-root:focus-within .MuiChatMessage-actions {
  opacity: 1;
}
```

## Component anatomy

`ChatMessageActions` occupies the `actions` grid area in the message row layout:

```text
ChatMessage (grid)
  ├── ChatMessageAvatar    → grid-area: avatar
  ├── ChatMessageContent   → grid-area: content
  ├── ChatMessageMeta      → grid-area: meta
  └── ChatMessageActions   → grid-area: actions
```

## Adding custom actions

The `MessageActions` primitive renders a `<div>` (or custom slot element) that you populate with your own action buttons. Override the actions slot through `ChatBox`:

```tsx
'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

function MyMessageActions() {
  return (
    <React.Fragment>
      <IconButton size="small" aria-label="Copy">
        <ContentCopyIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="Edit">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="Delete">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
}

const adapter = createEchoAdapter();

export default function BasicMessageActions() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ messageActions: MyMessageActions }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

### Accessing message context

Inside a custom actions component, use the `ownerState` prop to access the current message data and show different actions for user and assistant messages:

```tsx
'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ChatBox } from '@mui/x-chat';
import { useMessage } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

function RoleBasedActions({ messageId }: { messageId: string }) {
  const message = useMessage(messageId);
  const role = message?.role;

  return (
    <React.Fragment>
      <IconButton size="small" aria-label="Copy">
        <ContentCopyIcon fontSize="small" />
      </IconButton>
      {role === 'assistant' && (
        <IconButton size="small" aria-label="Regenerate">
          <RefreshIcon fontSize="small" />
        </IconButton>
      )}
      {role === 'user' && (
        <IconButton size="small" aria-label="Edit">
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </React.Fragment>
  );
}

const adapter = createEchoAdapter();

export default function RoleBasedMessageActions() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ messageActions: RoleBasedActions }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

## Owner state

The `MessageActions` component receives the message context as owner state, which slot components can use for conditional styling:

| Property    | Type                | Description                       |
| :---------- | :------------------ | :-------------------------------- |
| `messageId` | `string`            | ID of the current message         |
| `role`      | `ChatRole`          | Role of the message author        |
| `status`    | `ChatMessageStatus` | Current status of the message     |
| `streaming` | `boolean`           | Whether the message is streaming  |
| `isGrouped` | `boolean`           | Whether the message is in a group |

## Slots

| Slot      | Default element | Description              |
| :-------- | :-------------- | :----------------------- |
| `actions` | `div`           | The action bar container |

## See also

- [Message Appearance](/x/react-chat/display/message-appearance/) for the overall message layout and visual presentation
