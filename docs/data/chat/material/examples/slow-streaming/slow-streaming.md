---
title: Chat - Slow streaming
productId: x-chat
packageName: '@mui/x-chat'
---

# Slow streaming

<p class="description">A ChatBox with a deliberately slow streaming adapter to observe the real-time text rendering behavior.</p>

This example uses a slow adapter (500ms per chunk) to make the streaming behavior clearly visible.

{{"demo": "SlowStreaming.js"}}

## What it shows

- Visible incremental text rendering during streaming
- Bubble grows as chunks arrive
- Composer behavior during active streaming
- Auto-scroll following the growing response
- State transitions: idle -> streaming -> complete
