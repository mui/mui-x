---
productId: x-chat
title: Streaming
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox, ChatStreamingIndicator
---

# Chat - Streaming

<p class="description">Stream assistant responses chunk-by-chunk from the adapter into the Chat UI for live, token-by-token updates.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Streaming makes responses feel immediate: instead of waiting for the full completion, the user sees text appear as the model produces it.
This page is for adapter authors — it specifies the chunk protocol the runtime consumes and how each chunk becomes UI state.

The Chat component streams assistant responses token-by-token.
The adapter's `sendMessage()` method returns a `ReadableStream<ChatMessageChunk | ChatStreamEnvelope>`.
The runtime reads this stream, processes each chunk, and updates the normalized store so that UI components re-render incrementally.
The demo below streams a canned response token-by-token so you can watch chunks land and tune the flush interval.

## Stream lifecycle

Every stream must follow this lifecycle:

1. **`start`** — Begin a new assistant message. The runtime creates the message shell and sets its status to `'streaming'`.
2. **Content chunks** — Text, reasoning, tool, source, file, data, or metadata chunks populate the message.
3. **`finish`** or **`abort`** — Terminal chunk. `finish` marks the message as `'sent'`; `abort` marks it as `'cancelled'`.

If the stream closes without a terminal chunk, the runtime treats it as a disconnect (see [Handling errors and disconnects](#handling-errors-and-disconnects) below).

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
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data && data !== '[DONE]') {
            controller.enqueue(JSON.parse(data));
          }
        }
      }
    },
  });
}
```

## Deduplicating and ordering chunks

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

## Controlling the flush interval

The runtime batches rapid text and reasoning deltas before applying them to the store.
The `streamFlushInterval` prop on [`ChatBox`](/x/api/chat/chat-box/) (or `ChatProvider`) controls the batching window.
The default is **16 ms** (approximately one frame at 60 fps).

Override the default by passing a custom interval to the `streamFlushInterval` prop:

```tsx
<ChatBox adapter={adapter} streamFlushInterval={32} />
```

:::info
Lower values mean faster visual updates but more store mutations.
Higher values reduce mutation frequency at the cost of perceived latency.
:::

{{"demo": "ChatStreamingPlayground.js"}}

## Streaming indicator

While a response is in flight, the Chat component shows animated dots so the user knows the assistant is working.
The indicator covers two phases:

1. **Waiting** — after the user sends a message and before the `start` chunk arrives, the dots render as a trailing row below the last message.
2. **Streaming** — once the assistant message exists with `status: 'streaming'`, the dots move inside the assistant bubble, below the streamed content, and disappear when the stream finishes.

{{"demo": "ChatStreamingIndicatorDemo.js", "bg": "inline", "defaultCodeOpen": false}}

### Enabling and disabling

The indicator is controlled by the `streamingIndicator` feature flag, which defaults to `'auto'`:

- `'auto'` (default) — shown only in assistant-backed conversations. A conversation counts as assistant-backed when an assistant member or participant is configured (a `ChatUser` with `role: 'assistant'` in `members` or the conversation's `participants`), or when the conversation already contains an assistant message. Human-to-human chats never show it.
- `true` — always shown while a response is in flight, regardless of detection.
- `false` — never shown.

```tsx
<ChatBox adapter={adapter} features={{ streamingIndicator: false }} />
```

:::info
In `'auto'` mode, the very first send in a brand-new conversation with no assistant member or participant shows nothing during the waiting phase — there is no assistant signal yet.
The indicator still appears as soon as the `start` chunk creates the assistant message.
To show it from the first send, configure an assistant member/participant or set `streamingIndicator: true`.
:::

### Customization

Use the `streamingIndicator` slot to replace the rendered component, or pass `null` to remove it while keeping the feature semantics for a custom replacement elsewhere:

```tsx
<ChatBox
  adapter={adapter}
  slots={{ streamingIndicator: MyIndicator }}
  slotProps={{ streamingIndicator: { className: 'my-indicator' } }}
/>
```

A custom slot component receives the surrounding `message` when rendered inside a streaming assistant bubble, and the resolved `mode` plus the row contract (`messageId`, `index`, `items`) when rendered as the trailing row.
Reuse the built-in gating with the `useStreamingIndicatorVisibility()` hook from `@mui/x-chat/headless`:

```tsx
import { useStreamingIndicatorVisibility } from '@mui/x-chat/headless';

function MyIndicator({ mode = 'auto', message }) {
  const { waiting } = useStreamingIndicatorVisibility(mode);
  const streaming = message?.role === 'assistant' && message?.status === 'streaming';
  if (!waiting && !streaming) {
    return null;
  }
  return <LinearProgress sx={{ maxWidth: 120 }} />;
}
```

:::info
The dots are decorative (`aria-hidden`): the message list's status live region already announces when a response starts and completes, so screen reader users get the same signal without duplicate announcements.
:::

The streaming indicator reflects the assistant's response generation.
For showing when _human_ participants are composing a message, see [Typing indicators](/x/react-chat/behavior/typing-indicators/).

## Stopping and cancelling streams

The `sendMessage` input includes an `AbortSignal` that fires when the user clicks the stop button.
Pass it to the `fetch` call so the runtime cancels the HTTP request automatically:

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

If your backend requires explicit cancellation (for example, sending a separate cancel request), implement the optional [`stop()`](/x/react-chat/backend/adapters/#stopping-in-flight-requests) method on the adapter alongside the signal:

```tsx
stop() {
  fetch('/api/chat/cancel', { method: 'POST' });
},
```

You can also stop streaming programmatically using the [`useChat()`](/x/react-chat/resources/hooks/#usechat) hook:

```tsx
const { stopStreaming } = useChat();

// Cancel the active stream
stopStreaming();
```

## Reconnecting to streams

Implement the adapter's [`reconnectToStream()`](/x/react-chat/backend/adapters/#resuming-an-interrupted-stream) method to resume an interrupted stream — for example, when an SSE connection drops mid-response:

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
It makes one reconnect attempt for the interrupted assistant `messageId`; if you return `null`, the message stays in `'error'` status and the runtime calls `onError` with the recoverable stream error.

## Handling errors and disconnects

If the stream closes without a terminal chunk (`finish` or `abort`), the runtime:

1. Records a recoverable stream error.
2. Sets the message status to `'error'`.
3. Calls `onFinish` with `isDisconnect: true`.
4. If `reconnectToStream()` is implemented, makes one attempt to resume.
5. Calls `onError` only when the disconnect remains unrecovered.

If the adapter's `sendMessage()` throws, the runtime records a send error and surfaces it through the error model.
See [Error handling](/x/react-chat/behavior/error-handling/) for more details.

## Chunk type reference

Full reference of every chunk type the runtime accepts, grouped by family.
Skip to the table you need: [lifecycle](#lifecycle-chunks), [text](#text-chunks), [reasoning](#reasoning-chunks), [tool](#tool-chunks), [source, file, and data](#source-file-and-data-chunks), [step boundaries](#step-boundary-chunks), [metadata](#metadata-chunks).

### Lifecycle chunks

| Chunk type | Fields                       | Description                                                               |
| :--------- | :--------------------------- | :------------------------------------------------------------------------ |
| `start`    | `messageId`, `author?`       | Begin a new assistant message; `author` sets the assistant message author |
| `finish`   | `messageId`, `finishReason?` | Complete the assistant message                                            |
| `abort`    | `messageId`                  | Cancel the assistant message                                              |

The optional `finishReason` is an adapter-defined string (for example `'stop'` or `'length'`).
The runtime doesn't interpret or display it — it forwards the value verbatim to the
`onFinish` callback so your application can react to how the response ended.

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

| Chunk type              | Fields                                                       | Description                   |
| :---------------------- | :----------------------------------------------------------- | :---------------------------- |
| `tool-input-start`      | `toolCallId`, `toolName`, `dynamic?`                         | Begin a tool invocation       |
| `tool-input-delta`      | `toolCallId`, `inputTextDelta`                               | Stream tool input JSON        |
| `tool-input-available`  | `toolCallId`, `toolName`, `input`, `dynamic?`                | Tool input is fully available |
| `tool-input-error`      | `toolCallId`, `errorText`                                    | Tool input parsing failed     |
| `tool-approval-request` | `toolCallId`, `toolName`, `input`, `approvalId?`, `dynamic?` | Request user approval         |
| `tool-output-available` | `toolCallId`, `output`, `preliminary?`                       | Tool output is available      |
| `tool-output-error`     | `toolCallId`, `errorText`                                    | Tool execution failed         |
| `tool-output-denied`    | `toolCallId`, `reason?`                                      | User denied the tool call     |

The `toolInvocation.state` tracks the tool lifecycle: `'input-streaming'` → `'input-available'` → `'approval-requested'` → `'output-available'` (or `'output-error'` / `'output-denied'`).

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

### Metadata chunks

| Chunk type         | Fields     | Description                                       |
| :----------------- | :--------- | :------------------------------------------------ |
| `message-metadata` | `metadata` | Merge partial metadata into the assistant message |

Metadata chunks do not create a message part — the partial `metadata` object is shallow-merged into `ChatMessage.metadata`.
Type the payload by augmenting the `ChatMessageMetadata` registry interface (see [Type augmentation](/x/react-chat/core/types/)).

## Mapping chunks to message parts

The stream processor maps chunks to `ChatMessagePart` entries:

1. `text-start` creates a new `ChatTextMessagePart` with `state: 'streaming'`.
2. `text-delta` appends to the existing text part.
3. `text-end` sets `state: 'done'`.
4. Tool chunks update `toolInvocation.state` through each phase. While input streams, `tool-input-delta` keeps the invocation in `'input-streaming'` — the runtime doesn't assemble a partial `input` from the deltas; the complete, parsed `input` arrives with `tool-input-available`.
5. Source, file, and data chunks each create their corresponding part type immediately.
6. `start-step` creates a `ChatStepStartMessagePart` separator.
7. `message-metadata` merges into the message's `metadata` field without creating a part.

The message's `status` field also updates through the stream:

- `'sending'` — set when the user message is optimistically added
- `'streaming'` — set when `start` arrives
- `'sent'` — set when `finish` arrives
- `'cancelled'` — set when `abort` arrives
- `'error'` — set when the stream fails

## See also

- [Building an adapter](/x/react-chat/backend/building-an-adapter/) for a step-by-step guide to producing these streams.
- [Adapter](/x/react-chat/backend/adapters/) for details on the interface that produces streams.
- [Error handling](/x/react-chat/behavior/error-handling/) for details on the error model and recovery.
- [Scrolling](/x/react-chat/behavior/scrolling/) for details on how auto-scroll follows streaming content.
