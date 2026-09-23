---
title: Chat - Slow streaming
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Slow streaming

<p class="description">Observe incremental text rendering in real time with an artificially throttled streaming adapter.</p>

The `ChatBox` adapter emits one chunk every 500 ms so the streaming behavior is visible in real time:

- Visible incremental text rendering during streaming
- Bubble grows as chunks arrive
- Composer behavior during active streaming
- Auto-scroll following the growing response
- State transitions from idle to streaming to complete

The demo below illustrates each of these behaviors:

{{"demo": "SlowStreaming.js", "bg": "inline"}}

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
