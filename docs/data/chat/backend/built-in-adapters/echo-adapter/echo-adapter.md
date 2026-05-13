---
productId: x-chat
title: Echo adapter
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Echo adapter

<p class="description">An in-memory adapter that echoes the user's last message back after a small delay. Useful for prototyping UI and smoke tests with zero infrastructure.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Demo

The adapter below echoes whatever you type after a 300 ms simulated network delay.

{{"demo": "EchoAdapterDemo.js", "defaultCodeOpen": true, "bg": "inline"}}

## Usage

Pass a `respond` function to control what the assistant replies, and a `delayMs` to tune how long the reply takes to arrive:

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

- [createAiSdkAdapter](/x/react-chat/backend/built-in-adapters/ai-sdk-adapter/) — bridge to Vercel's AI SDK
- [Adapters](/x/react-chat/backend/adapters/) — the full `ChatAdapter` interface reference
- [Building an Adapter](/x/react-chat/backend/building-an-adapter/) — write your own from scratch
