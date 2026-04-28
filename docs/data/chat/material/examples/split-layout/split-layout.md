---
title: Chat - Split layout
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Split layout

<p class="description">Place ChatMessageList and ChatComposer in separate DOM zones. Only ChatRoot is needed to connect them.</p>

{{"demo": "SplitLayout.js", "bg": "inline"}}

## How it works

`ChatRoot` sets up a `ChatProvider` context. Any descendant can read from that context
via hooks—regardless of where it sits in the DOM tree.

This means `ChatMessageList` and `ChatComposer` don't need to be siblings
or share a parent component. Place them wherever your layout requires:

```tsx
<ChatRoot adapter={adapter}>
  {/* Could be in main content, a drawer, or a modal */}
  <MessagePane /> {/* calls useMessageIds() */}
  {/* Could be in a toolbar, sidebar, or page footer */}
  <InputPane /> {/* ChatComposer uses useChatComposer() */}
</ChatRoot>
```

Both components stay in sync automatically because they share the same store.

## When to use this pattern

Use split layout when `ChatBox`'s default two-pane structure doesn't fit your product:

- Chat input lives in the app toolbar or page footer
- Message history is displayed in one panel while the send area is in another
- You are embedding chat into an existing layout that already manages its own structure

## See also

- [No conversation history](/x/react-chat/material/examples/no-conversation-history/): compose a thread without `ChatBox`
- [Message feed](/x/react-chat/material/examples/message-feed/): display-only embed with no input

## API

- [ChatRoot](/x/api/chat/chat-root/)
