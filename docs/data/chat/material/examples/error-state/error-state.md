---
title: Chat - Error state
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Error state

<p class="description">How the ChatBox behaves when the adapter throws an error during message sending.</p>

This example uses a failing adapter that always throws an error, demonstrating how errors propagate through `onError`.

{{"demo": "ErrorState.js", "bg": "inline"}}

## What it shows

- Adapter that throws an error on every `sendMessage` call
- `onError` callback capturing the error
- External error display below the ChatBox
- User message still appears in the thread (optimistic update)
- Composer is re-enabled after the error
