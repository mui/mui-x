---
productId: x-chat
title: Events and callbacks
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Events and callbacks

<p class="description">Respond to streaming lifecycle events, tool calls, data chunks, and errors using callback props on <code>ChatProvider</code> and <code>ChatBox</code>.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatProvider` (and by extension `ChatBox`) exposes four callback props that fire at key moments in the chat lifecycle.
Use them for logging, analytics, side effects, and error handling without modifying the adapter.

## Callback overview

| Prop         | When it fires                                  | Typical use case                       |
| :----------- | :--------------------------------------------- | :------------------------------------- |
| `onFinish`   | When a stream reaches a terminal state         | Analytics, persistence, follow-up UI   |
| `onToolCall` | When a tool invocation state changes           | Logging, triggering external workflows |
| `onData`     | When a `data-*` chunk arrives during streaming | Transient data, app-level side effects |
| `onError`    | When any runtime error surfaces                | Error reporting, toast notifications   |

`onFinish`, `onToolCall`, and `onData` may return a promise — the runtime awaits them, so keep long-running work out of the hot path. `onError` is fire-and-forget.

The following demo wires all four callbacks to an event log so you can observe their relative timing:

{{"demo": "CallbackEventLog.js"}}

## Observing stream completion

The `onFinish` callback fires when a stream finishes, aborts, disconnects, or errors.
This is the primary callback for post-stream side effects.

```ts
interface ChatOnFinishPayload {
  message: ChatMessage; // the assistant message
  messages: ChatMessage[]; // all messages after the stream
  isAbort: boolean; // user stopped the stream
  isDisconnect: boolean; // stream disconnected unexpectedly
  isError: boolean; // stream ended with an error
  finishReason?: string; // backend-provided reason
}
```

```tsx
<ChatBox
  adapter={adapter}
  onFinish={({ message, messages, isAbort }) => {
    if (!isAbort) {
      // Persist the completed conversation
      saveConversation(messages);
    }
    // Log completion analytics
    analytics.track('chat_response_complete', {
      messageId: message.id,
      partCount: message.parts.length,
    });
  }}
/>
```

### Terminal states

The `onFinish` callback fires in four scenarios:

| Scenario   | `isAbort` | `isDisconnect` | `isError` | Description                   |
| :--------- | :-------- | :------------- | :-------- | :---------------------------- |
| Success    | `false`   | `false`        | `false`   | Stream completed normally     |
| User abort | `true`    | `false`        | `false`   | User clicked the stop button  |
| Disconnect | `false`   | `true`         | `true`    | Connection dropped mid-stream |
| Error      | `false`   | `false`        | `true`    | Stream ended with an error    |

A disconnect is also reported as an error: the message is marked as errored and `onError` fires with `code: 'STREAM_ERROR'`.

## Observing tool invocations

The `onToolCall` callback fires when a tool invocation state changes during streaming.
Use it for side effects outside the message list: logging, analytics, or triggering external workflows.

```ts
interface ChatOnToolCallPayload {
  toolCall: ChatToolInvocation | ChatDynamicToolInvocation;
}
```

```tsx
<ChatBox
  adapter={adapter}
  onToolCall={({ toolCall }) => {
    console.log(`Tool ${toolCall.toolName}: ${toolCall.state}`);

    if (toolCall.state === 'output-available') {
      // Tool execution completed, trigger follow-up
      analytics.track('tool_executed', { tool: toolCall.toolName });
    }
  }}
/>
```

### Tool invocation states

| State                | Description                            |
| :------------------- | :------------------------------------- |
| `input-streaming`    | Tool input is being streamed           |
| `input-available`    | Tool input is fully available          |
| `approval-requested` | Waiting for human-in-the-loop approval |
| `approval-responded` | User has approved or denied            |
| `output-available`   | Tool execution completed with output   |
| `output-error`       | Tool execution failed                  |
| `output-denied`      | User denied the tool execution         |

## Receiving data chunks

The `onData` callback fires when a `data-*` chunk arrives during streaming.
Use it for transient data that should trigger app-level side effects without being persisted in the message.

```ts
type ChatOnData = (part: ChatDataMessagePart) => void | Promise<void>;
```

```tsx
<ChatBox
  adapter={adapter}
  onData={(part) => {
    if (part.type === 'data-progress') {
      setProgressPercent(part.data.percent);
    }
  }}
/>
```

Register the `data-progress` payload in `ChatDataPartMap` so `part.data` is typed — see [Type augmentation](/x/react-chat/core/types/):

```ts
declare module '@mui/x-chat/types' {
  interface ChatDataPartMap {
    'data-progress': { percent: number };
  }
}
```

Use `onData` for backend-driven UI updates that are transient: progress bars, status indicators, or notifications that shouldn't be stored as message parts.

## Handling errors

The `onError` callback fires when any runtime error surfaces, whether from adapter methods, stream processing, or rendering.

```ts
type ChatOnError = (error: ChatError) => void;
```

```tsx
<ChatBox
  adapter={adapter}
  onError={(error) => {
    console.error('[Chat error]', error.source, error.message);

    // Show a toast notification
    toast.error(error.message);

    // Report to error tracking
    Sentry.captureException(new Error(error.message), {
      tags: { code: error.code, source: error.source },
      extra: {
        recoverable: error.recoverable,
        retryable: error.retryable,
        ...error.details,
      },
    });
  }}
/>
```

### Error object structure

```ts
type ChatErrorCode =
  | 'HISTORY_ERROR'
  | 'SEND_ERROR'
  | 'STREAM_ERROR'
  | 'REALTIME_ERROR'
  | 'REGENERATE_ERROR';

interface ChatError {
  code: ChatErrorCode; // machine-readable error code
  message: string; // human-readable description
  source: ChatErrorSource; // where the error originated
  recoverable: boolean; // whether the runtime can continue
  retryable?: boolean; // whether the failed operation can be retried
  details?: Record<string, unknown>; // additional context
}

type ChatErrorSource = 'send' | 'stream' | 'history' | 'render' | 'adapter';
```

### Error sources

| Source    | When it fires                                      |
| :-------- | :------------------------------------------------- |
| `send`    | `sendMessage()` rejected                           |
| `stream`  | Stream processing encountered an error             |
| `history` | `listMessages()` or `listConversations()` rejected |
| `render`  | A rendering error occurred in the message list     |
| `adapter` | A generic adapter method threw                     |

## Reading errors in components

Prefer the hooks below over `onError` when you want to render error state in the UI rather than fire a side effect. Errors also surface through hooks, so you can display them in custom UI:

```tsx
// Via useChat()
const { error } = useChat();

// Via useChatStatus(), lighter weight, no message subscriptions
const { error } = useChatStatus();
```

## Registering callbacks

All callbacks are registered as props on `ChatBox` or `ChatProvider`:

```tsx
// On ChatBox (all-in-one)
<ChatBox
  adapter={adapter}
  onFinish={handleFinish}
  onToolCall={handleToolCall}
  onData={handleData}
  onError={handleError}
/>

// On ChatProvider (custom layout)
<ChatProvider
  adapter={adapter}
  onFinish={handleFinish}
  onToolCall={handleToolCall}
  onData={handleData}
  onError={handleError}
>
  <MyCustomLayout />
</ChatProvider>
```

Callback identity matters: `ChatProvider` memoizes its runtime context on these props, so inline arrow functions invalidate it on every render and re-render all chat components. Declare handlers outside the component or wrap them in `useCallback`.

:::warning
Exceptions thrown from `onFinish`, `onToolCall`, or `onData` (including rejected promises) are not swallowed: they fail the in-flight send — the message is marked as errored and `onError` receives a runtime error. Wrap risky side effects in `try`/`catch` if they shouldn't abort the stream.
:::

## See also

- [Adapters](/x/react-chat/backend/adapters/) for the adapter interface that produces these events.
- [Controlled state](/x/react-chat/backend/controlled-state/) for the full `ChatProvider` props reference.
- [Hooks reference: `useChatStatus`](/x/react-chat/resources/hooks/#usechatstatus) for reading error state in components.
