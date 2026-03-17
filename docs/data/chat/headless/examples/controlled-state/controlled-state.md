---
title: Chat - Controlled state
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Controlled state

<p class="description">Drive the public chat models from React state while the runtime keeps normalized internals.</p>

This recipe demonstrates the major public design choice of the headless package:

- `messages`
- `conversations`
- `activeConversationId`
- `composerValue`

All stay externally controlled, but the runtime still streams, derives selectors, and updates through the normalized store.

{{"demo": "ControlledStateHeadlessChat.js"}}
