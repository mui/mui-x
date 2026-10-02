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

The adapter below echoes whatever you type after the default 400 ms simulated network delay.
The reply arrives as a single text chunk once the delay elapses — the Echo adapter doesn't simulate token-by-token streaming. For real streamed output, swap in [`createAiSdkAdapter`](/x/react-chat/backend/built-in-adapters/ai-sdk-adapter/).

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

### Canned replies

Return different replies based on the input to script deterministic flows for demos and tests:

{{"demo": "EchoAdapterCannedReplies.js", "bg": "inline"}}

## Options

`createEchoAdapter()` returns a complete [`ChatAdapter`](/x/react-chat/backend/adapters/), so it plugs into the same `adapter` prop as any production adapter.

| Option    | Type                       | Default                                                                      | Description                                                                                                               |
| :-------- | :------------------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `respond` | `(text: string) => string` | `text => 'You said: "…". Replace this demo adapter with your own API call.'` | Builds the assistant reply from the user's text.                                                                          |
| `delayMs` | `number`                   | `400`                                                                        | Milliseconds to wait before emitting the reply. Simulates network/model latency so the UI doesn't feel jarringly instant. |

**Cancellation:** the adapter honors the abort signal passed to `sendMessage()`. Calling `stopStreaming()` from the `useChat` hook — or switching conversations — while the simulated delay is pending closes the stream without emitting a reply. See [Streaming](/x/react-chat/behavior/streaming/) for the cancellation lifecycle.

## When to use it

- **Prototyping**: get a chat surface running before any backend exists, so you can iterate on layout, theming, and message rendering.
- **Smoke tests**: drive `<ChatBox>` through full send/receive cycles in your test suite without a real LLM.
- **Demos and Storybook**: ship examples that run anywhere — no API keys, no network, identical output every run.

Swap to a real adapter (for example [`createAiSdkAdapter`](/x/react-chat/backend/built-in-adapters/ai-sdk-adapter/)) when you're ready to wire a backend.

## See also

- [`createAiSdkAdapter()`](/x/react-chat/backend/built-in-adapters/ai-sdk-adapter/) — bridge to Vercel's AI SDK
- [Adapters](/x/react-chat/backend/adapters/) — the full `ChatAdapter` interface reference
- [Building an adapter](/x/react-chat/backend/building-an-adapter/) — write your own from scratch
