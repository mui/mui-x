---
productId: x-chat
title: Loading and Empty States
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageSkeleton
---

# Chat - Loading and Empty States

<p class="description">Display loading skeletons while messages load and empty state content when a conversation has no messages.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Displaying a loading skeleton

`ChatMessageSkeleton` renders animated shimmer lines that serve as a placeholder while message content is loading.
Use it during initial data fetching or when loading older messages via history pagination.

### Import

```tsx
import { ChatMessageSkeleton } from '@mui/x-chat';
```

### Basic usage

```tsx
<ChatMessageSkeleton />
```

By default, the skeleton renders 3 shimmer lines. The last line is shorter (60% width) to mimic the natural shape of a message.

### Configuring the number of lines

Set the `lines` prop to control how many shimmer lines are displayed:

```tsx
<ChatMessageSkeleton lines={2} />
<ChatMessageSkeleton lines={5} />
```

### Slots

| Slot   | Default element | Description                |
| :----- | :-------------- | :------------------------- |
| `root` | `div`           | The outer container        |
| `line` | `div`           | Each animated shimmer line |

Customize the skeleton appearance through slot replacement:

```tsx
<ChatMessageSkeleton
  slots={{
    root: MySkeletonRoot,
    line: MySkeletonLine,
  }}
/>
```

### CSS classes

| Class name                     | Description     |
| :----------------------------- | :-------------- |
| `.MuiChatMessageSkeleton-root` | Root container  |
| `.MuiChatMessageSkeleton-line` | Individual line |

## Empty state

When a conversation exists but has no messages yet, `ChatBox` renders an empty message list area with the composer ready for input.
This is the state users see when they start a new conversation.

{{"demo": "../../material/examples/empty-state/EmptyState.js", "defaultCodeOpen": false, "bg": "inline"}}

Key characteristics of the empty state:

- The message list area is visible but empty
- The composer is ready for input
- The conversation header is visible (if configured)
- No visual artifacts appear when the message list is empty

### Custom empty state content

Provide custom empty state content by composing the thread from individual components. A common pattern is to display suggested prompts that help users start a conversation:

{{"demo": "CustomEmptyState.js", "defaultCodeOpen": false, "bg": "inline"}}

## Streaming indicator

While the assistant is generating a response, streaming tokens are rendered incrementally inside the message bubble.
The message list auto-scrolls to follow new content as long as the user is near the bottom.

The streaming state is reflected in:

- `ChatMessage.status`: set to `'streaming'` during generation
- `ChatTextMessagePart.state`: set to `'streaming'` on the active text part

Use these values to display a typing indicator or pulsing cursor:

```tsx
function TypingIndicator({ message }) {
  if (message.status !== 'streaming') return null;

  return <span className="typing-cursor" />;
}
```

## See also

- [Message appearance](/x/react-chat/display/message-appearance/) for the overall message layout
- [Text and markdown](/x/react-chat/display/message-parts/text-and-markdown/) for streaming text display
- [Message list](/x/react-chat/basics/messages/) for auto-scroll behavior during streaming
