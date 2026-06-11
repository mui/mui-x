---
productId: x-chat
title: Vercel AI SDK adapter
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Vercel AI SDK adapter

<p class="description">Connect the Vercel AI SDK to the chat runtime by streaming <code>streamText</code> and <code>useChat</code> results into the chat UI.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The chunk types `createAiSdkAdapter` accepts match the AI SDK's [UI Message Stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) structurally, so no runtime dependency on the `ai` package is needed.
Install `ai` to get full type info on the values you pass in, or skip it and rely on the local mirror.

## Demo

The demo below talks to a live MUI documentation assistant served at `https://backend.mui.com/public/docs-assistant/chat`.
Ask it anything about Material UI or MUI X—it streams text and reasoning back through the adapter.

{{"demo": "MuiDocsAssistantDemo.js", "defaultCodeOpen": true, "bg": "inline"}}

:::warning
The MUI docs assistant endpoint is rate-limited to 20 requests per window for fair public usage.
If you hit the limit, the error surfaces in the chat's built-in error UI.
:::

## Pattern A—Streaming from a server route

The most common setup.
A server route uses `streamText(...).toUIMessageStreamResponse()`, and the client adapter pipes the response body straight into the chat:

```ts
// app/api/chat/route.ts
import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

```tsx
'use client';
import { ChatBox } from '@mui/x-chat';
import { createAiSdkAdapter } from '@mui/x-chat/headless';

const adapter = createAiSdkAdapter({
  stream: async ({ messages, signal }) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(({ id, role, parts }) => ({ id, role, parts })),
      }),
      signal,
    });
    if (!response.ok || !response.body) {
      throw new Error(`Chat API failed: ${response.status}`);
    }
    return response.body;
  },
});

export default function ChatPage() {
  return <ChatBox adapter={adapter} sx={{ height: 600 }} />;
}
```

Both NDJSON (`{json}\n`) and SSE (`data: {json}\n\n` with `[DONE]`) wire framings are decoded automatically—whichever shape your server emits, it works.

## Pattern B—Streaming in-process

Skip the server route when the model can be called in the same process (worker with proxied API keys, edge runtime, server actions returning a stream).
`.toUIMessageStream()` yields the same chunk shapes as a fetch response, just as JavaScript objects rather than bytes:

```tsx
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const adapter = createAiSdkAdapter({
  stream: ({ message }) =>
    streamText({
      model: openai('gpt-4o-mini'),
      prompt: message.parts
        .map((part) => (part.type === 'text' ? part.text : ''))
        .join(''),
    }).toUIMessageStream(),
});
```

:::warning
Don't call this from a browser component with raw API keys—those keys would ship to your bundle. Use Pattern A for client-side apps.
:::

## Pattern C—Sharing state with `useChat`

If you already drive state through `useChat` and want the chat to render alongside other UI bound to the same `chat` object (a streaming status badge, a sidebar with message counts), hand the `chat` instance to the adapter directly:

```tsx
'use client';
import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatBox } from '@mui/x-chat';
import { createAiSdkAdapter } from '@mui/x-chat/headless';

export default function ChatPage() {
  const chat = useChat({ api: '/api/chat' });

  const adapter = React.useMemo(
    () => createAiSdkAdapter({ chat }),
    [chat.sendMessage, chat.stop],
  );

  return (
    <React.Fragment>
      <StreamingBadge status={chat.status} />
      <ChatBox adapter={adapter} sx={{ height: 600 }} />
    </React.Fragment>
  );
}
```

This integration trades token-by-token streaming for a unified state object.
`useChat.sendMessage` only resolves after the full reply has streamed in, so the chat shows the assistant message whole.
If you need both real-time tokens **and** shared state, prefer Pattern A and call `chat.setMessages` from a `useChat` `onFinish` callback when you need a copy.

## Pattern D—Reusing a transport

When you've already configured a transport (custom headers, body transforms, auth interceptors), forward its `sendMessages` method to `{ stream }`:

```tsx
import { DefaultChatTransport } from 'ai';

const transport = new DefaultChatTransport({
  api: '/api/chat',
  headers: { Authorization: `Bearer ${token}` },
});

const adapter = createAiSdkAdapter({
  stream: ({ messages, signal }) =>
    transport.sendMessages({ chatId: 'main', messages, abortSignal: signal }),
});
```

`transport.sendMessages` returns a `ReadableStream` of UI message chunks that structurally satisfies the `stream` callback—no extra wiring needed.

## Options

| Option   | Type                                                         | Notes                                                                                        |
| :------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| `stream` | `(req) => ReadableStream<AiSdkUIMessageChunk \| Uint8Array>` | Token streaming. Bytes are decoded for both NDJSON and SSE framings.                         |
| `chat`   | `AiSdkChatInstance` (matches `useChat()`'s shape)            | Whole-reply integration with `@ai-sdk/react`—see Pattern C above for the streaming tradeoff. |

AI SDK `error` chunks (`{ type: 'error', errorText }`) are converted to `ChatStreamError` and surfaced through the chat's built-in error UI.
Unknown chunk types pass through unchanged so newer protocol additions don't require an adapter update.

## See also

- See [Echo adapter](/x/react-chat/backend/built-in-adapters/echo-adapter/) for an in-memory adapter for prototyping.
- See [Adapters](/x/react-chat/backend/adapters/) for the full adapter interface reference.
- See [Building an adapter](/x/react-chat/backend/building-an-adapter/) for writing your own from scratch.
- See [Streaming](/x/react-chat/behavior/streaming/) for the chunk protocol reference.
- See [Vercel AI SDK—Stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) for the UI Message Stream spec.
