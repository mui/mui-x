---
productId: x-chat
title: Chat - Headless streaming
packageName: '@mui/x-chat-headless'
---

# Headless streaming

Understand the stream chunk protocol that turns adapter responses into normalized message state, including text, reasoning, tool, source, file, and data chunks.

The adapter's `sendMessage()` method returns a `ReadableStream<ChatMessageChunk | ChatStreamEnvelope>`.
The runtime reads this stream, processes each chunk, and updates the normalized store.
Your UI components see the updates through hooks and selectors.

## Chunk categories

### Lifecycle chunks

These chunks mark the boundaries of a response:

| Chunk type | Fields                       | Description                    |
| :--------- | :--------------------------- | :----------------------------- |
| `start`    | `messageId`                  | Begin a new assistant message  |
| `finish`   | `messageId`, `finishReason?` | Complete the assistant message |
| `abort`    | `messageId`                  | Cancel the assistant message   |

Every stream must begin with `start` and end with either `finish` or `abort`.

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

Reasoning chunks create a `ChatReasoningMessagePart` — useful for chain-of-thought or thinking trace displays.

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

Tool chunks create `ChatToolMessagePart` or `ChatDynamicToolMessagePart` entries.
The `toolInvocation.state` tracks the tool lifecycle: `'input-streaming'` → `'input-available'` → `'approval-requested'` → `'output-available'` (or `'output-error'` / `'output-denied'`).

### Source chunks

| Chunk type        | Fields                        | Description           |
| :---------------- | :---------------------------- | :-------------------- |
| `source-url`      | `sourceId`, `url`, `title?`   | URL-based source      |
| `source-document` | `sourceId`, `title?`, `text?` | Document-based source |

These create `ChatSourceUrlMessagePart` or `ChatSourceDocumentMessagePart` entries.

### File chunks

| Chunk type | Fields                                 | Description |
| :--------- | :------------------------------------- | :---------- |
| `file`     | `mediaType`, `url`, `filename?`, `id?` | Inline file |

Creates a `ChatFileMessagePart`.

### Data chunks

| Chunk type | Fields                              | Description         |
| :--------- | :---------------------------------- | :------------------ |
| `data-*`   | `type`, `data`, `id?`, `transient?` | Custom data payload |

Data chunks use a type that matches the `data-*` pattern (for example, `data-citations` or `data-summary`).
They create `ChatDataMessagePart` entries and also fire the `onData` callback.
If `transient` is `true`, the part is not persisted in the message.

### Step boundary chunks

| Chunk type    | Description                 |
| :------------ | :-------------------------- |
| `start-step`  | Begin a new processing step |
| `finish-step` | End the current step        |

Step chunks create `ChatStepStartMessagePart` entries, useful for showing multi-step processing in the UI.

### Metadata chunks

| Chunk type         | Fields     | Description                                       |
| :----------------- | :--------- | :------------------------------------------------ |
| `message-metadata` | `metadata` | Merge partial metadata into the assistant message |

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

## `streamFlushInterval`

Rapid text and reasoning deltas are batched before being applied to the store.
The `streamFlushInterval` prop on `ChatProvider` controls the batching window (default: 16ms).

Lower values mean faster visual updates but more store mutations.
Higher values reduce mutation frequency at the cost of perceived latency.

```tsx
<ChatProvider adapter={adapter} streamFlushInterval={32}>
  <MyChat />
</ChatProvider>
```

## How chunks become parts

The stream processor maps chunks to `ChatMessagePart` entries:

1. `text-start` creates a new `ChatTextMessagePart` with `state: 'streaming'`.
2. `text-delta` appends to the existing text part.
3. `text-end` sets `state: 'done'`.
4. Tool chunks follow a similar lifecycle, updating `toolInvocation.state` through each phase.
5. Source, file, and data chunks each create their corresponding part type immediately.
6. `start-step` creates a `ChatStepStartMessagePart` separator.

The message's `status` field also updates through the stream:

- `'sending'` → set when the user message is optimistically added
- `'streaming'` → set when `start` arrives
- `'sent'` → set when `finish` arrives
- `'cancelled'` → set when `abort` arrives
- `'error'` → set when the stream fails

## Error and disconnect handling

If the stream closes without a terminal chunk (`finish` or `abort`), the runtime:

1. Records a recoverable stream error.
2. Sets the message status to `'error'`.
3. Calls `onError` and `onFinish` with `isDisconnect: true`.
4. If `reconnectToStream()` is implemented, attempts to resume.

If the adapter's `sendMessage()` throws, the runtime records a send error and surfaces it through the error model.

## Building a stream

When writing an adapter, you can construct a `ReadableStream` from an array of chunks:

```tsx
function createStream(
  chunks: ChatMessageChunk[],
  delayMs = 0,
): ReadableStream<ChatMessageChunk> {
  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        if (delayMs > 0) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}
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

## Adjacent pages

- [Adapters](/x/react-chat/headless/adapters/) for the adapter interface that produces streams.
- [State and store](/x/react-chat/headless/state/) for `streamFlushInterval` and error model.
- [Streaming lifecycle](/x/react-chat/headless/examples/streaming-lifecycle/) for send, stop, retry, and callbacks in action.
- [Message parts](/x/react-chat/headless/examples/message-parts/) for rendering the parts that chunks produce.
