---
productId: x-chat
title: Loading and empty states
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageSkeleton
---

# Chat - Loading and empty states

<p class="description">Display loading skeletons while messages load and empty state content when a conversation has no messages.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Displaying a loading skeleton

`ChatMessageSkeleton` renders animated shimmer lines that serve as a placeholder while message content is loading.
Use it during initial data fetching or when loading older messages via [history pagination](/x/react-chat/multi-conversation/history-and-pagination/).

### Interactive playground

Use the demo below to adjust the number of shimmer lines:

{{"demo": "ChatMessageSkeletonPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

### Importing the component

```tsx
import { ChatMessageSkeleton } from '@mui/x-chat';
```

### Rendering a skeleton

```tsx
<ChatMessageSkeleton />
```

By default, the skeleton renders three shimmer lines.
The last line is shorter (60% width) to mimic the natural shape of a message.

### Configuring the number of lines

Set the `lines` prop to control how many shimmer lines are displayed:

```tsx
<ChatMessageSkeleton lines={2} />
<ChatMessageSkeleton lines={5} />
```

### Using the skeleton while messages load

Nothing renders the skeleton automatically — you decide where it appears.
Render skeletons in the message area while the fetch is in flight, then swap to `ChatMessageList` once the data arrives.
Set `aria-busy` on the swapping container and `aria-hidden` on each skeleton so assistive technology treats the placeholders as decorative.

{{"demo": "LoadingSkeletonInList.js", "defaultCodeOpen": false, "bg": "inline"}}

When older messages are being fetched via history pagination, render a skeleton at the top of the list instead.
The `isLoadingHistory` flag from `useChat()` reports when a page is in flight.
It is `true` during the initial history fetch and during `loadMoreHistory`, which is why the same flag drives both placements:

```tsx
const { isLoadingHistory } = useChat();
// At the top of the message area:
{
  isLoadingHistory && <ChatMessageSkeleton lines={2} aria-hidden />;
}
```

See [History and pagination](/x/react-chat/multi-conversation/history-and-pagination/) for the full pagination API.

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

### Accessibility

`ChatMessageSkeleton` is purely decorative: it renders plain `div` elements with no `role` or `aria-*` attributes of its own, so assistive technology is not informed that messages are loading.

The Chat components announce other lifecycle stages automatically—the message list is a `role="log"` polite live region for arriving messages, a hidden `role="status"` region announces streaming transitions, and a streaming message carries `aria-busy="true"`—but none of these fire during initial or history loading. Wire the loading state up explicitly:

```tsx
import { visuallyHidden } from '@mui/utils';

<div aria-busy={isLoading}>
  {isLoading ? (
    <React.Fragment>
      <ChatMessageSkeleton aria-hidden="true" />
      <span role="status" style={visuallyHidden}>
        Loading messages…
      </span>
    </React.Fragment>
  ) : (
    children
  )}
</div>;
```

- Set `aria-hidden="true"` on the skeleton (extra props are forwarded to the root slot) so the shimmer lines are removed from the accessibility tree.
- Set `aria-busy` on the container that swaps between skeleton and content.
- Use a `role="status"` element for the announcement—it is a polite live region, so it does not interrupt the user.

The shimmer animation pauses automatically when the user requests reduced motion (`prefers-reduced-motion: reduce`).

## Empty state

When a conversation exists but has no messages yet, `ChatBox` renders an empty message list area with the composer ready for input.
This is the state users see when they start a new conversation.

:::info
**Loading vs. empty:** these are distinct states.
Render the skeleton while a fetch is in flight (your loading flag is `true`), and the empty state only once the fetch resolves with `messages.length === 0`.
Rendering the empty state during the fetch causes a flash of "How can I help you?" before history appears.
:::

The message area below is intentionally empty — only the conversation header and the composer render:

{{"demo": "../../material/examples/empty-state/EmptyState.js", "defaultCodeOpen": false, "bg": "inline"}}

Key characteristics of the empty state:

- The message list area is visible but empty
- The composer is ready for input
- The conversation header is visible (if configured)
- The list area collapses cleanly — no leftover dividers, scroll affordances, or placeholder rows

### Custom empty state content

Provide custom empty state content by composing the thread from individual components. A common pattern is to display suggested prompts that help users start a conversation:

{{"demo": "CustomEmptyState.js", "defaultCodeOpen": false, "bg": "inline"}}

## Streaming indicator

While the assistant is generating a response, streaming tokens are rendered incrementally inside the message bubble.
The message list auto-scrolls to follow new content as long as the user is near the bottom.

The streaming state is reflected in:

- `ChatMessage.status`—set to `'streaming'` during generation
- `ChatTextMessagePart.state`—set to `'streaming'` on the active text part

Use these values to display a typing indicator or pulsing cursor:

```tsx
function TypingIndicator({ message }) {
  if (message.status !== 'streaming') return null;

  return <span className="typing-cursor" />;
}
```

For a live, configurable streaming demo, see [Streaming](/x/react-chat/behavior/streaming/).

## See also

- [Message appearance](/x/react-chat/display/message-appearance/) for details on the overall message layout.
- [Text and Markdown](/x/react-chat/display/message-parts/text-and-markdown/) for details on streaming text display.
- [Message list](/x/react-chat/basics/messages/) for details on auto-scroll behavior during streaming.
- [Accessibility](/x/react-chat/accessibility/) for the keyboard navigation and screen reader model.
