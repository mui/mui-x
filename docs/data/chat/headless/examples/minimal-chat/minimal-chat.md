---
title: Chat - Minimal headless chat
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Minimal headless chat

<p class="description">Start with the smallest working <code>ChatProvider</code> and <code>useChat()</code> setup.</p>

This recipe keeps the UI intentionally small:

- `ChatProvider` owns the runtime
- `useChat()` reads messages and streaming state
- a plain input and button trigger `sendMessage()`
- the assistant response streams back through the adapter

{{"demo": "MinimalHeadlessChat.js"}}
