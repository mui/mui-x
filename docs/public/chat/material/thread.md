---
productId: x-chat
title: Chat - Thread
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ConversationRoot, ConversationHeader, ConversationTitle, ConversationSubtitle, ConversationHeaderActions
---

# Chat - Thread

Compose the active conversation surface from themed thread components, override individual slots, and recompose the layout using context hooks.

The thread pane is the single-conversation view in a chat interface. It combines a header area, a scrollable message log, and a composer into one cohesive surface. `@mui/x-chat` ships each region as a themed component built with `styled()` and Material UI theme tokens.

The following demo shows the thread in action:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function BasicAiChat() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
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

## Component anatomy

```text
ChatConversation                    ← thread shell, derives the active conversation
  ChatConversationHeader            ← header bar with divider styling
    ChatConversationTitle           ← conversation name
    ChatConversationSubtitle        ← secondary line (participants, presence, etc.)
    ChatConversationHeaderActions   ← action area (archive, mute, context menu)
  ChatMessageList                   ← virtualized scrollable message area
    ChatMessageGroup                ← groups consecutive same-author messages
      ChatMessage                   ← individual message row (grid layout)
        ChatMessageAvatar           ← author avatar
        ChatMessageContent          ← bubble + inner part renderers
        ChatMessageMeta             ← timestamp, status indicator
        ChatMessageActions          ← hover action menu
  ChatComposer             ← composer form (border-top)
    ChatComposerTextArea   ← auto-resizing textarea
    ChatComposerToolbar    ← button row
      ChatComposerAttachButton
      ChatComposerSendButton
```

All components are exported from `@mui/x-chat`.

## Header anatomy

`ChatConversationHeader` is a `<header>` element with divider styling. It reads the active conversation through context so every child has access to the same conversation state without additional wiring.

```tsx
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
} from '@mui/x-chat';
```

### ownerState and how state flows

`ChatConversation` owns the conversation-level `ownerState`, and the header subcomponents inherit that same state through the slot system.

### Conversation ownerState

| Field             | Type                       | Description                                  |
| :---------------- | :------------------------- | :------------------------------------------- |
| `conversationId`  | `string \| undefined`      | Currently selected conversation ID           |
| `conversation`    | `ChatConversation \| null` | Full active conversation object, when loaded |
| `hasConversation` | `boolean`                  | Whether the thread currently has a selection |

The `hasConversation` flag is particularly useful for hiding action buttons or showing a placeholder when no conversation is active. `ChatConversationHeader`, `ChatConversationTitle`, `ChatConversationSubtitle`, and `ChatConversationHeaderActions` all receive this same conversation-level state.

### Overriding a header slot

The most targeted customization is to replace the element type on one slot while keeping everything else:

```tsx
'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ChatBox, ChatConversationHeader } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const GradientHeaderElement = styled('header')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  '& *': { color: 'inherit' },
}));

function CustomHeader(props: React.ComponentProps<typeof ChatConversationHeader>) {
  return (
    <ChatConversationHeader {...props} slots={{ header: GradientHeaderElement }} />
  );
}

const adapter = createEchoAdapter();

export default function GradientHeader() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ conversationHeader: CustomHeader }}
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

### Using ownerState in a custom title

The `ownerState` prop received by slot components carries the full conversation context. This makes it straightforward to render dynamic content derived from the active conversation:

```tsx
import { ChatConversationTitle } from '@mui/x-chat';

const LiveTitle = React.forwardRef(function LiveTitle(
  { ownerState, ...props },
  ref,
) {
  const memberCount = ownerState?.conversation?.metadata?.memberCount;
  return (
    <div ref={ref} {...props}>
      {ownerState?.conversation?.title ?? 'No conversation selected'}
      {memberCount != null && (
        <span style={{ fontWeight: 400, marginLeft: 8 }}>{memberCount} members</span>
      )}
    </div>
  );
});

function CustomConversationTitle(props) {
  return <ChatConversationTitle {...props} slots={{ root: LiveTitle }} />;
}
```

## Message list anatomy

`ChatMessageList` renders three styled slots: a flex column outer shell, a scrolling scroller, and a padded content container.

```tsx
import { ChatMessageList, ChatMessageGroup } from '@mui/x-chat';
```

### ownerState and how state flows

| Slot key              | Default element | ownerState fields            |
| :-------------------- | :-------------- | :--------------------------- |
| `messageList`         | `div`           | `messageCount`, `isAtBottom` |
| `messageListScroller` | `div`           | same                         |
| `messageListContent`  | `div`           | same                         |

The `isAtBottom` flag is useful for toggling a scroll-to-bottom affordance. `messageCount` lets you show an empty-state illustration when the list has no messages.

### Overriding the content container

Use `slotProps` when you only need to pass additional styling without swapping the element type:

```tsx
<ChatMessageList
  renderItem={({ id, index }) => <ChatMessageGroup index={index} messageId={id} />}
  slotProps={{
    messageListContent: {
      sx: { gap: 1, paddingBlock: 2 },
    },
  }}
/>
```

## Message groups and individual messages

`ChatMessageGroup` decides whether consecutive messages from the same author form a visual group, exposing `isFirst` and `isLast` grouping flags. `ChatMessage` then uses those flags to adjust spacing and avatar visibility.

```tsx
import {
  ChatMessageGroup,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageMeta,
  ChatMessageActions,
} from '@mui/x-chat';
```

### `ChatMessageGroup` ownerState

| Field        | Type                    | Description                          |
| :----------- | :---------------------- | :----------------------------------- |
| `isFirst`    | `boolean`               | First message in a consecutive group |
| `isLast`     | `boolean`               | Last message in a consecutive group  |
| `authorRole` | `'user' \| 'assistant'` | Role of the group author             |
| `authorId`   | `string \| undefined`   | Identity of the group author         |

### `ChatMessage` ownerState

| Field        | Type                    | Description                                   |
| :----------- | :---------------------- | :-------------------------------------------- |
| `role`       | `'user' \| 'assistant'` | Author role, drives bubble alignment          |
| `status`     | `string`                | Delivery/streaming status                     |
| `streaming`  | `boolean`               | Whether the message is still streaming        |
| `error`      | `boolean`               | Whether the message ended in an error state   |
| `isGrouped`  | `boolean`               | Whether this row is part of a group           |
| `showAvatar` | `boolean`               | Controls the phantom-column width calculation |

### Overriding the message bubble

The recommended pattern for customizing the bubble is to wrap `ChatMessageContent` and replace only its inner `bubble` slot. This preserves part iteration, markdown rendering, tool-call renderers, and source citations:

```tsx
'use client';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
  ChatBox,
  ChatMessageContent,
  type ChatMessageContentProps,
} from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const PaperBubbleSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ownerState?: { role?: string } }
>(function PaperBubbleSlot({ ownerState, children, ...other }, ref) {
  return (
    <Paper
      ref={ref}
      elevation={ownerState?.role === 'user' ? 0 : 2}
      {...other}
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 2,
        bgcolor: ownerState?.role === 'user' ? 'primary.main' : 'background.paper',
        color: ownerState?.role === 'user' ? 'primary.contrastText' : 'text.primary',
      }}
    >
      {children}
    </Paper>
  );
});

const CustomMessageContent = React.forwardRef<
  HTMLDivElement,
  ChatMessageContentProps
>(function CustomMessageContent(props, ref) {
  return (
    <ChatMessageContent
      ref={ref}
      {...props}
      slots={{ ...props.slots, bubble: PaperBubbleSlot }}
    />
  );
});

const adapter = createEchoAdapter();

export default function PaperBubble() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ messageContent: CustomMessageContent }}
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

Forward `ref` and spread `...props` before your overrides so the wrapping pattern does not silently discard required props.

### Adding custom children to a message row

When you need to insert additional content inside a message row — for example a copy-to-clipboard button — provide custom children to `ChatMessage`:

```tsx
<ChatMessage messageId={id}>
  <ChatMessageAvatar />
  <ChatMessageContent />
  <CopyButton messageId={id} />
  <ChatMessageMeta />
</ChatMessage>
```

Children passed to `ChatMessage` are rendered inside the grid layout, so they inherit the same column structure as the default slots.

## Composer anatomy

`ChatComposer` is a `<form>` element that handles text input, attachment state, and submission. Its children own specific regions of the composer.

```tsx
import {
  ChatComposer,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatComposerAttachButton,
  ChatComposerSendButton,
  ChatComposerHelperText,
} from '@mui/x-chat';
```

### ownerState and how state flows

Every composer component shares the same ownerState shape:

| Field             | Type      | Description                        |
| :---------------- | :-------- | :--------------------------------- |
| `isSubmitting`    | `boolean` | Form submission in progress        |
| `hasValue`        | `boolean` | Textarea has non-empty value       |
| `isStreaming`     | `boolean` | An assistant response is streaming |
| `attachmentCount` | `number`  | Number of staged attachments       |
| `disabled`        | `boolean` | Input is disabled                  |

`ChatComposerHelperText` also receives an `error` boolean.

### Changing the placeholder and disabling the attach button

Use `slotProps` on `ChatBox` for light prop-only overrides that do not require a component replacement:

```tsx
<ChatBox
  slotProps={{
    composerInput: {
      placeholder: 'Ask a question…',
      'aria-label': 'Message input',
    },
    composerAttachButton: {
      sx: { display: 'none' },
    },
  }}
/>
```

### Overriding the send button with an ownerState-aware component

The `isStreaming` flag lets you replace the send icon with a stop icon while a response is in progress:

```tsx
'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import { ChatBox, ChatComposerSendButton } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const AdaptiveSendButtonSlot = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ownerState?: { isStreaming?: boolean };
  }
>(function AdaptiveSendButtonSlot({ ownerState, ...props }, ref) {
  return (
    <IconButton
      ref={ref}
      {...props}
      aria-label={ownerState?.isStreaming ? 'Stop' : 'Send'}
    >
      {ownerState?.isStreaming ? <StopIcon /> : <SendIcon />}
    </IconButton>
  );
});

function CustomSendButton(
  props: React.ComponentProps<typeof ChatComposerSendButton>,
) {
  return (
    <ChatComposerSendButton {...props} slots={{ root: AdaptiveSendButtonSlot }} />
  );
}

const adapter = createEchoAdapter();

export default function AdaptiveSendButton() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ composerSendButton: CustomSendButton }}
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

## Accessing message state in custom children

Custom children placed inside `ChatMessage` receive the message's `ownerState` through the slot system. When you need to read message state (role, streaming status, error) inside a deeply nested component, define a custom slot and accept `ownerState` as a prop:

```tsx
'use client';
import * as React from 'react';
import {
  ChatBox,
  ChatMessageContent,
  type ChatMessageContentProps,
} from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const BubbleWithStatusSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      streaming?: boolean;
      error?: boolean;
      status?: string;
    };
  }
>(function BubbleWithStatusSlot({ ownerState, children, ...props }, ref) {
  let dotColor = 'transparent';
  if (ownerState?.streaming) {
    dotColor = 'blue';
  } else if (ownerState?.error) {
    dotColor = 'red';
  } else if (ownerState?.status === 'sent') {
    dotColor = 'green';
  }

  return (
    <div ref={ref} {...props}>
      {children}
      <span style={{ color: dotColor, marginLeft: 4 }}>●</span>
    </div>
  );
});

const CustomMessageContent = React.forwardRef<
  HTMLDivElement,
  ChatMessageContentProps
>(function CustomMessageContent(props, ref) {
  return (
    <ChatMessageContent
      ref={ref}
      {...props}
      slots={{ ...props.slots, bubble: BubbleWithStatusSlot }}
    />
  );
});

const adapter = createEchoAdapter();

export default function BubbleWithStatus() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ messageContent: CustomMessageContent }}
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

The `ownerState` includes `role`, `status`, `streaming`, `error`, `isGrouped`, and `showAvatar` — the same fields listed in the `ChatMessage` ownerState table above.

For conversation-level state (the active conversation title, participants, etc.), use the `ownerState` received by header slot components — see the [Header anatomy](#header-anatomy) section above.

## Full recomposition example

When `ChatBox` slots are not enough — for example when you want to add a pinned banner between the header and the message list, or position the typing indicator inside the header instead of above the composer — you can assemble the thread from individual Material UI components directly.

The following example shows a fully assembled thread pane without relying on `ChatBox` layout defaults. It inserts a custom warning banner between the header and the message list:

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatComposerSendButton,
} from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ThreadRecomposition() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatConversation sx={{ height: '100%' }}>
          <ChatConversationHeader>
            <ChatConversationTitle />
            <ChatConversationSubtitle />
            <Box sx={{ flex: 1 }} />
            <ChatConversationHeaderActions />
          </ChatConversationHeader>

          {/* Custom pinned notice between header and messages */}
          <Box
            sx={{
              px: 2,
              py: 0.75,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              fontSize: 'caption.fontSize',
            }}
          >
            Responses are AI-generated. Verify before acting.
          </Box>

          <ChatMessageList
            renderItem={({ id, index }) => (
              <ChatMessageGroup index={index} messageId={id} />
            )}
          />

          <ChatComposer>
            <ChatComposerTextArea placeholder="Type a message…" />
            <ChatComposerToolbar>
              <ChatComposerSendButton />
            </ChatComposerToolbar>
          </ChatComposer>
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
```

Wrap your custom thread with a `ChatProvider` from `@mui/x-chat` to wire runtime state to your adapter.

## See also

- [Conversation list](/x/react-chat/material/conversation-list/) for the companion sidebar component.
- [Customization](/x/react-chat/material/customization/) for the complete slot and slotProps reference.
- [Slot overrides](/x/react-chat/material/examples/slot-overrides/) for a runnable demo using a `Paper` bubble.

## API

- [ConversationRoot](/x/api/chat/conversation-root/)
- [ConversationHeader](/x/api/chat/conversation-header/)
- [ConversationTitle](/x/api/chat/conversation-title/)
- [ConversationSubtitle](/x/api/chat/conversation-subtitle/)
- [ConversationHeaderActions](/x/api/chat/conversation-header-actions/)
