---
title: Chat - Type augmentation
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Type augmentation

<p class="description">Use TypeScript module augmentation to add app-specific metadata, typed tools, typed <code>data-*</code> parts, and custom message parts to the headless runtime.</p>

Headless chat does not use provider props for type overrides.
Instead, extend `@mui/x-chat-headless/types` with [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

This recipe keeps the example intentionally small while showing how one augmentation affects the whole stack:

- user, conversation, and message metadata
- one typed tool definition
- one typed `data-*` part
- one custom message part rendered through `partRenderers` and `useChatPartRenderer()`

For the runtime-specific approval flow, see [Tool approval and renderers](/x/react-chat/headless/examples/tool-approval-and-renderers/).

{{"demo": "TypeAugmentationHeadlessChat.js"}}
