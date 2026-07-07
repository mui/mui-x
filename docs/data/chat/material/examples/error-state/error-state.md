---
title: Chat - Error state
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Error state

<p class="description">Display recovery UI when the Chat adapter throws an error during message sending.</p>

- Adapter that throws on every `sendMessage` call
- `onError` callback capturing the error
- External error display below the ChatBox
- User message still appears in the thread (optimistic update)
- Composer is re-enabled after the error

In the demo below, the adapter throws on every send and the error surfaces via `onError`:

{{"demo": "ErrorState.js", "bg": "inline"}}

## API

- [ChatRoot](/x/api/chat/chat-root/)
