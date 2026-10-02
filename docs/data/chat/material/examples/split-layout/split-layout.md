---
title: Chat - Split layout
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Split layout

<p class="description">Render the message list and composer in separate regions of the page while keeping them connected to a single chat store.</p>

{{"demo": "SplitLayout.js", "bg": "inline"}}

## Connecting components through `ChatRoot`

`ChatRoot` sets up a `ChatProvider` context.
Any descendant can read from that context via hooks—regardless of where it sits in the DOM tree.

This means `ChatMessageList` and `ChatComposer` don't need to be siblings or share a parent component.
Place them wherever the layout requires:

```tsx
<ChatRoot adapter={adapter}>
  {/* Could be in main content, a drawer, or a modal */}
  <MessagePane /> {/* calls useMessageIds() */}
  {/* Could be in a toolbar, sidebar, or page footer */}
  <InputPane /> {/* ChatComposer uses useChatComposer() */}
</ChatRoot>
```

Both components stay in sync automatically because they share the same store.

## Choosing the split layout

Use the split layout when `ChatBox`'s default two-pane structure doesn't fit the product layout:

- The chat input lives in the app toolbar or page footer.
- Message history is displayed in one panel while the send area is in another.
- Chat is embedded into a layout that already manages its own structure.

## See also

- [No conversation history](/x/react-chat/material/examples/no-conversation-history/)—compose a thread without `ChatBox`.
- [Message feed](/x/react-chat/material/examples/message-feed/)—display-only embed with no input.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
