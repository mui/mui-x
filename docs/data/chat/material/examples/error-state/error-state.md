---
title: Chat - Error state
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Error state

<p class="description">How the ChatBox behaves when the adapter throws an error during message sending.</p>

This demo uses a failing adapter that always throws an error, demonstrating how errors propagate through `onError`.

- Adapter that throws an error on every `sendMessage` call
- `onError` callback capturing the error
- External error display below the ChatBox
- User message still appears in the thread (optimistic update)
- Composer is re-enabled after the error

{{"demo": "ErrorState.js", "bg": "inline"}}

## API

- [ChatRoot](/x/api/chat/chat-root/)
