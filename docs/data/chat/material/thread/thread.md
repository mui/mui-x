---
productId: x-chat
title: Chat - Thread
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ConversationRoot, ConversationHeader, ConversationTitle, ConversationSubtitle, ConversationHeaderActions
---

# Chat - Thread

<p class="description">Compose the active conversation surface from themed thread components, override individual slots, and recompose the layout using context hooks</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

The thread pane is the single-conversation view in a chat interface. It combines a header area, a scrollable message log, and a composer into one cohesive surface. `@mui/x-chat` ships each region as a themed component that wraps the corresponding `@mui/x-chat/unstyled` primitive with `styled()` and Material UI theme tokens.

The following demo shows the thread in action:

{{"demo": "../examples/basic-ai-chat/BasicAiChat.js", "bg": "inline", "defaultCodeOpen": false}}

## Component tree

```text
ChatConversation                    ← thread shell, derives active conversation
  ChatConversationHeader            ← header bar (border-bottom, min-height 56px)
    ChatConversationTitle           ← conversation name, typography.body1 bold
    ChatConversationSubtitle        ← secondary line (participants, presence, etc.)
    ChatConversationHeaderActions   ← action area (archive, mute, context menu)
  ChatMessageList                   ← virtualized scrollable message area
    ChatMessageGroup                ← groups consecutive same-author messages
      ChatMessage                   ← individual message row (grid layout)
        ChatMessageAvatar           ← circular avatar, 36 px
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

## The header area

`ChatConversationHeader` is a `<header>` element with a border-bottom divider and a 56 px minimum height. It reads the active conversation through context so every child has access to the same conversation state without additional wiring.

```tsx
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
} from '@mui/x-chat';
```

### Components and their ownerState

| Component                       | Root element | Key ownerState fields                               |
| :------------------------------ | :----------- | :-------------------------------------------------- |
| `ChatConversation`              | `div`        | `conversationId`, `conversation`, `hasConversation` |
| `ChatConversationHeader`        | `header`     | same as above (inherited)                           |
| `ChatConversationTitle`         | `div`        | same as above                                       |
| `ChatConversationSubtitle`      | `div`        | same as above                                       |
| `ChatConversationHeaderActions` | `div`        | same as above                                       |

The `hasConversation` flag is particularly useful for hiding action buttons or showing a placeholder when no conversation is active.

### Overriding a header slot

The most targeted customization is to replace the element type on one slot while keeping everything else:

```tsx
import { ChatConversationHeader } from '@mui/x-chat';
import { styled } from '@mui/material/styles';

const GradientHeader = styled('header')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  '& *': { color: 'inherit' },
}));

function CustomHeader(props) {
  return <ChatConversationHeader {...props} slots={{ header: GradientHeader }} />;
}
```

Pass `CustomHeader` through `ChatBox`'s `slots.conversationHeader` prop:

```tsx
<ChatBox slots={{ conversationHeader: CustomHeader }} />
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

## The message list

`ChatMessageList` wraps `MessageListRoot` from the unstyled layer with three styled slots: a flex column outer shell, a scrolling scroller, and a padded content container.

```tsx
import { ChatMessageList, ChatMessageGroup } from '@mui/x-chat';
```

### Slots and ownerState

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
import { ChatBox, ChatMessageContent } from '@mui/x-chat';
import Paper from '@mui/material/Paper';

const PaperBubble = React.forwardRef(function PaperBubble(
  { ownerState, ...props },
  ref,
) {
  return (
    <Paper
      ref={ref}
      elevation={ownerState?.role === 'user' ? 0 : 2}
      {...props}
      sx={{
        ...props.sx,
        px: 2,
        py: 1.25,
        borderRadius: 2,
        bgcolor: ownerState?.role === 'user' ? 'primary.main' : 'background.paper',
        color: ownerState?.role === 'user' ? 'primary.contrastText' : 'text.primary',
      }}
    />
  );
});

const CustomMessageContent = React.forwardRef(
  function CustomMessageContent(props, ref) {
    return (
      <ChatMessageContent
        ref={ref}
        {...props}
        slots={{ ...props.slots, bubble: PaperBubble }}
      />
    );
  },
);

<ChatBox slots={{ messageContent: CustomMessageContent }} />;
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

## The composer

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

### Shared ownerState

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
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import { ChatComposerSendButton } from '@mui/x-chat';

const AdaptiveSendButton = React.forwardRef(function AdaptiveSendButton(
  { ownerState, ...props },
  ref,
) {
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

function CustomSendButton(props) {
  return <ChatComposerSendButton {...props} slots={{ root: AdaptiveSendButton }} />;
}

<ChatBox slots={{ composerSendButton: CustomSendButton }} />;
```

## Accessing message state in custom children

Custom children placed inside `ChatMessage` receive the message's `ownerState` through the slot system. When you need to read message state (role, streaming status, error) inside a deeply nested component, define a custom slot and accept `ownerState` as a prop:

```tsx
import { ChatMessageContent } from '@mui/x-chat';

// A custom bubble slot that renders a colored status dot
const BubbleWithStatus = React.forwardRef(function BubbleWithStatus(
  { ownerState, children, ...props },
  ref,
) {
  const dotColor = ownerState?.streaming
    ? 'blue'
    : ownerState?.error
      ? 'red'
      : ownerState?.status === 'sent'
        ? 'green'
        : 'transparent';

  return (
    <div ref={ref} {...props}>
      {children}
      <span style={{ color: dotColor, marginLeft: 4 }}>●</span>
    </div>
  );
});

function CustomMessageContent(props) {
  return (
    <ChatMessageContent
      {...props}
      slots={{ ...props.slots, bubble: BubbleWithStatus }}
    />
  );
}
```

The `ownerState` includes `role`, `status`, `streaming`, `error`, `isGrouped`, and `showAvatar` — the same fields listed in the `ChatMessage` ownerState table above.

For conversation-level state (the active conversation title, participants, etc.), use the `ownerState` received by header slot components — see the [header area](#the-header-area) section above.

## Full recomposition example

When `ChatBox` slots are not enough — for example when you want to add a pinned banner between the header and the message list, or position the typing indicator inside the header instead of above the composer — you can assemble the thread from individual Material UI components directly.

The following example shows a fully assembled thread pane without relying on `ChatBox` layout defaults:

```tsx
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
import Box from '@mui/material/Box';

function CustomThread() {
  return (
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
  );
}
```

Wrap `CustomThread` with a `ChatProvider` from `@mui/x-chat/headless` to wire it to your adapter.

## API

- [ConversationRoot](/x/api/chat/conversation-root/)
- [ConversationHeader](/x/api/chat/conversation-header/)
- [ConversationTitle](/x/api/chat/conversation-title/)
- [ConversationSubtitle](/x/api/chat/conversation-subtitle/)
- [ConversationHeaderActions](/x/api/chat/conversation-header-actions/)

## See also

- [Conversation list](/x/react-chat/material/conversation-list/) for the companion sidebar component.
- [Customization](/x/react-chat/material/customization/) for the complete slot and slotProps reference.
- [Unstyled thread](/x/react-chat/unstyled/thread/) for the primitive layer that this page builds on.
- [Slot overrides](/x/react-chat/material/examples/slot-overrides/) for a runnable demo using a `Paper` bubble.
