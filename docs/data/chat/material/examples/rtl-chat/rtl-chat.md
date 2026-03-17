---
productId: x-chat
title: Chat - RTL layout
packageName: '@mui/x-chat'
---

# RTL chat

<p class="description">A right-to-left chat layout with Arabic text, showing how all chat components adapt to <code>direction: 'rtl'</code>.</p>

{{"demo": "RtlChat.js"}}

## What this example demonstrates

- RTL layout via `createTheme({ direction: 'rtl' })` and `dir="rtl"` on the container
- Message bubbles flip: user messages appear on the left, assistant on the right
- Conversations sidebar, composer, and all indicators mirror automatically
- Logical CSS properties used throughout (`margin-inline-start`, etc.)
- Custom Arabic `localeText` for the composer placeholder
