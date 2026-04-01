---
title: Chat - Message feed
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Message feed

<p class="description">Render only <code>ChatMessageList</code> — no input. Send messages programmatically via <code>useChat</code> for read-only embeds and transcript views.</p>

{{"demo": "MessageFeed.js", "bg": "inline"}}

## When to use this pattern

Use a display-only message feed when your app controls the conversation flow externally:
sending happens on the server, on a schedule, or through a different UI element.

Common use cases:

- **Transcripts** — display a completed conversation without allowing replies
- **Notification feeds** — show a stream of AI-generated updates
- **Copilot result panels** — render assistant output alongside an existing form or editor

## How it works

Only `ChatRoot` (the adapter wrapper) and `ChatMessageList` are needed.
`ChatComposer` is simply not rendered — there is no prop to "hide" it.

To send a message programmatically, call `useChat().sendMessage()` from any component inside `ChatRoot`:

```tsx
const { sendMessage, isStreaming } = useChat();

sendMessage({
  conversationId: 'my-thread',
  parts: [{ type: 'text', text: 'Generate a summary.' }],
});
```

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- [No conversation history](/x/react-chat/material/examples/no-conversation-history/) — compose a thread from individual components without `ChatBox`
- [Split layout](/x/react-chat/material/examples/split-layout/) — message list and composer in separate DOM zones
