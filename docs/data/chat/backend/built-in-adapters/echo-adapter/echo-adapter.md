---
productId: x-chat
title: Echo adapter
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Echo adapter

<p class="description">Echo user messages back through the chat runtime to prototype UI without a backend.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Echoing user messages

The adapter below echoes whatever you type after a 400 ms simulated network delay.

{{"demo": "EchoAdapterDemo.js", "defaultCodeOpen": true, "bg": "inline"}}

## Usage

Use `respond` to set the reply text and `delayMs` to control the response delay:

```ts
import { createEchoAdapter } from '@mui/x-chat/headless';

const adapter = createEchoAdapter({
  respond: (text) => `Mock reply for: ${text}`,
  delayMs: 200,
});
```

## Options

| Option    | Type                       | Default                                                                      |
| :-------- | :------------------------- | :--------------------------------------------------------------------------- |
| `respond` | `(text: string) => string` | `text => 'You said: "…". Replace this demo adapter with your own API call.'` |
| `delayMs` | `number`                   | `400`                                                                        |

## When to use it

- **Prototyping**: get a chat surface running before any backend exists, so you can iterate on layout, theming, and message rendering.
- **Smoke tests**: drive `<ChatBox>` in isolation in your test suite without spinning up a real LLM.
- **Demos and storybook**: deterministic replies that don't depend on network or API keys.

Swap to a real adapter (for example [`createAiSdkAdapter`](/x/react-chat/backend/built-in-adapters/ai-sdk-adapter/)) when you're ready to wire a backend.

## See also

- [`createAiSdkAdapter()`](/x/react-chat/backend/built-in-adapters/ai-sdk-adapter/)—bridge to Vercel's AI SDK
- [Adapters](/x/react-chat/backend/adapters/)—the full `ChatAdapter` interface reference
- [Building an adapter](/x/react-chat/backend/building-an-adapter/)—write your own from scratch
