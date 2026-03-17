---
title: Chat - Advanced store access
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Advanced store access

<p class="description">Use the store escape hatch to subscribe to exactly the runtime slices you want.</p>

This recipe is intentionally advanced.
It shows how to combine:

- `useChatStore()`
- `chatSelectors`
- low-level selector subscriptions

Use this pattern when you need custom dashboards, metrics, or highly specialized derived views on top of the headless runtime.

{{"demo": "AdvancedStoreAccessHeadlessChat.js"}}
