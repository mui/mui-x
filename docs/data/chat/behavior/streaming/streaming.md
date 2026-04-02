---
productId: x-chat
title: Streaming
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Streaming

<p class="description">How the streaming protocol works end-to-end, from adapter response to live UI updates.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

The Chat component streams assistant responses token-by-token.
The adapter's `sendMessage()` method returns a `ReadableStream<ChatMessageChunk | ChatStreamEnvelope>`.
The runtime reads this stream, processes each chunk, and updates the normalized store so that UI components re-render incrementally.

{{"demo": "../../headless/examples/streaming-lifecycle/StreamingLifecycleHeadlessChat.js", "bg": "inline", "defaultCodeOpen": false, "hideToolbar": true}}

## Stream lifecycle

Every stream must follow this lifecycle:

1. **`start`** -- Begin a new assistant message. The runtime creates the message shell and sets its status to `'streaming'`.
2. **Content chunks** -- Text, reasoning, tool, source, file, or data chunks populate the message parts.
3. **`finish`** or **`abort`** -- Terminal chunk. `finish` marks the message as `'sent'`; `abort` marks it as `'cancelled'`.

If the stream closes without a terminal chunk, the runtime treats it as a disconnect (see [Error and disconnect handling](#error-and-disconnect-handling) below).

## Chunk types

### Lifecycle chunks

| Chunk type | Fields                       | Description                    |
| :--------- | :--------------------------- | :----------------------------- |
| `start`    | `messageId`                  | Begin a new assistant message  |
| `finish`   | `messageId`, `finishReason?` | Complete the assistant message |
| `abort`    | `messageId`                  | Cancel the assistant message   |

### Text chunks

| Chunk type   | Fields        | Description            |
| :----------- | :------------ | :--------------------- |
| `text-start` | `id`          | Begin a new text part  |
| `text-delta` | `id`, `delta` | Append text content    |
| `text-end`   | `id`          | Finalize the text part |

Text chunks create a `ChatTextMessagePart` in the message.
Multiple `text-delta` chunks are batched according to `streamFlushInterval` before being applied to the store.

### Reasoning chunks

| Chunk type        | Fields        | Description                 |
| :---------------- | :------------ | :-------------------------- |
| `reasoning-start` | `id`          | Begin a reasoning part      |
| `reasoning-delta` | `id`, `delta` | Append reasoning content    |
| `reasoning-end`   | `id`          | Finalize the reasoning part |

Reasoning chunks create a `ChatReasoningMessagePart`, useful for chain-of-thought or thinking trace displays.

### Tool chunks

| Chunk type              | Fields                                           | Description                   |
| :---------------------- | :----------------------------------------------- | :---------------------------- |
| `tool-input-start`      | `toolCallId`, `toolName`, `dynamic?`             | Begin a tool invocation       |
| `tool-input-delta`      | `toolCallId`, `inputTextDelta`                   | Stream tool input JSON        |
| `tool-input-available`  | `toolCallId`, `toolName`, `input`                | Tool input is fully available |
| `tool-input-error`      | `toolCallId`, `errorText`                        | Tool input parsing failed     |
| `tool-approval-request` | `toolCallId`, `toolName`, `input`, `approvalId?` | Request user approval         |
| `tool-output-available` | `toolCallId`, `output`, `preliminary?`           | Tool output is available      |
| `tool-output-error`     | `toolCallId`, `errorText`                        | Tool execution failed         |
| `tool-output-denied`    | `toolCallId`, `reason?`                          | User denied the tool call     |

The `toolInvocation.state` tracks the tool lifecycle: `'input-streaming'` -> `'input-available'` -> `'approval-requested'` -> `'output-available'` (or `'output-error'` / `'output-denied'`).

### Source, file, and data chunks

| Chunk type        | Fields                                 | Description           |
| :---------------- | :------------------------------------- | :-------------------- |
| `source-url`      | `sourceId`, `url`, `title?`            | URL-based source      |
| `source-document` | `sourceId`, `title?`, `text?`          | Document-based source |
| `file`            | `mediaType`, `url`, `filename?`, `id?` | Inline file           |
| `data-*`          | `type`, `data`, `id?`, `transient?`    | Custom data payload   |

Data chunks use a type that matches the `data-*` pattern (for example, `data-citations` or `data-summary`).
They create `ChatDataMessagePart` entries and also fire the `onData` callback.
If `transient` is `true`, the part is not persisted in the message.

### Step boundary chunks

| Chunk type    | Description                 |
| :------------ | :-------------------------- |
| `start-step`  | Begin a new processing step |
| `finish-step` | End the current step        |

Step chunks create `ChatStepStartMessagePart` entries, useful for showing multi-step agentic processing in the UI.

## Building a stream

When writing an adapter, construct a `ReadableStream` from an array of chunks:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'msg-1' });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({ type: 'text-delta', id: 'text-1', delta: 'Hello!' });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish', messageId: 'msg-1' });
        controller.close();
      },
    });
  },
};
```

Or convert a server-sent event stream into chunks:

```tsx
async function fromSSE(
  url: string,
  signal: AbortSignal,
): Promise<ReadableStream<ChatMessageChunk>> {
  const response = await fetch(url, { signal });
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      const chunk = JSON.parse(decoder.decode(value));
      controller.enqueue(chunk);
    },
  });
}
```

## Stream envelopes

For deduplication and ordering, wrap chunks in a `ChatStreamEnvelope`:

```ts
interface ChatStreamEnvelope {
  eventId?: string; // unique event identifier for deduplication
  sequence?: number; // monotonic ordering number
  chunk: ChatMessageChunk;
}
```

The runtime accepts both raw `ChatMessageChunk` objects and enveloped chunks in the same stream.
Envelopes are useful for SSE-based transports where chunks might arrive out of order or be replayed.

## Flush interval

Rapid text and reasoning deltas are batched before being applied to the store.
The `streamFlushInterval` prop on `ChatBox` (or `ChatProvider`) controls the batching window.
The default is **16 ms** (approximately one frame at 60 fps).

```tsx
<ChatBox adapter={adapter} streamFlushInterval={32} />
```

:::info
Lower values mean faster visual updates but more store mutations.
Higher values reduce mutation frequency at the cost of perceived latency.
:::

## Stopping and cancelling streams

The `sendMessage` input includes an `AbortSignal` that fires when the user clicks the stop button.
Pass it to your `fetch` call so the HTTP request is cancelled automatically:

```tsx
async sendMessage({ message, signal }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    signal, // browser cancels the request when the user stops
  });
  return res.body!;
},
```

If your backend requires explicit cancellation (for example, sending a separate cancel request), implement the optional `stop()` method on the adapter alongside the signal:

```tsx
stop() {
  fetch('/api/chat/cancel', { method: 'POST' });
},
```

You can also stop streaming programmatically using the `useChat` hook:

```tsx
const { stopStreaming } = useChat();

// Cancel the active stream
stopStreaming();
```

## Reconnecting to streams

Implement the adapter's `reconnectToStream()` method to resume an interrupted stream -- for example, when an SSE connection drops mid-response:

```tsx
async reconnectToStream({ conversationId, messageId, signal }) {
  const res = await fetch('/api/chat/reconnect', {
    method: 'POST',
    body: JSON.stringify({ conversationId, messageId }),
    signal,
  });
  if (res.status === 404) return null; // message no longer resumable
  return res.body!;
},
```

Return `null` if the interrupted message cannot be resumed.
The runtime calls `reconnectToStream()` automatically after detecting a disconnected stream.

## Error and disconnect handling

If the stream closes without a terminal chunk (`finish` or `abort`), the runtime:

1. Records a recoverable stream error.
2. Sets the message status to `'error'`.
3. Calls `onError` and `onFinish` with `isDisconnect: true`.
4. If `reconnectToStream()` is implemented, attempts to resume.

If the adapter's `sendMessage()` throws, the runtime records a send error and surfaces it through the error model.
See [Error handling](/x/react-chat/behavior/error-handling/) for more details.

## How chunks become message parts

The stream processor maps chunks to `ChatMessagePart` entries:

1. `text-start` creates a new `ChatTextMessagePart` with `state: 'streaming'`.
2. `text-delta` appends to the existing text part.
3. `text-end` sets `state: 'done'`.
4. Tool chunks follow a similar lifecycle, updating `toolInvocation.state` through each phase.
5. Source, file, and data chunks each create their corresponding part type immediately.
6. `start-step` creates a `ChatStepStartMessagePart` separator.

The message's `status` field also updates through the stream:

- `'sending'` -- set when the user message is optimistically added
- `'streaming'` -- set when `start` arrives
- `'sent'` -- set when `finish` arrives
- `'cancelled'` -- set when `abort` arrives
- `'error'` -- set when the stream fails

## API

- [`ChatBox`](/x/api/chat/chat-box/)

## See also

- [Adapter](/x/react-chat/backend/adapters/) for the adapter interface that produces streams.
- [Error handling](/x/react-chat/behavior/error-handling/) for error model and recovery.
- [Scrolling](/x/react-chat/behavior/scrolling/) for how auto-scroll follows streaming content.
