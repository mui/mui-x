---
title: Chat - Streaming lifecycle
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Streaming lifecycle

<p class="description">Observe the full runtime lifecycle for send, stream, stop, error, retry, and callbacks.</p>

This recipe brings the runtime lifecycle together in one place:

- `sendMessage()`
- `stopStreaming()`
- `retry()`
- `onData`
- `onFinish`
- `onError`

The demo intentionally exposes success, failure, and long-running stream modes.

{{"demo": "StreamingLifecycleHeadlessChat.js"}}
