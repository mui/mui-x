---
productId: x-chat
title: Events & Callbacks
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Events & Callbacks

<p class="description">Respond to streaming lifecycle events, tool calls, data chunks, and errors using callback props on <code>ChatProvider</code> and <code>ChatBox</code>.</p>



`ChatProvider` (and by extension `ChatBox`) exposes four callback props that fire at key moments in the chat lifecycle.
Use them for logging, analytics, side effects, and error handling without modifying the adapter.

## Callback overview

| Prop         | When it fires                                  | Typical use case                       |
| :----------- | :--------------------------------------------- | :------------------------------------- |
| `onFinish`   | When a stream reaches a terminal state         | Analytics, persistence, follow-up UI   |
| `onToolCall` | When a tool invocation state changes           | Logging, triggering external workflows |
| `onData`     | When a `data-*` chunk arrives during streaming | Transient data, app-level side effects |
| `onError`    | When any runtime error surfaces                | Error reporting, toast notifications   |

## `onFinish`

Fires when a stream finishes, aborts, disconnects, or errors.
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
| Disconnect | `false`   | `true`         | `false`   | Connection dropped mid-stream |
| Error      | `false`   | `false`        | `true`    | Stream ended with an error    |

## `onToolCall`

Fires when a tool invocation state changes during streaming.
Use it for side effects outside the message list — logging, analytics, or triggering external workflows.

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
      // Tool execution completed — trigger follow-up
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

## `onData`

Fires when a `data-*` chunk arrives during streaming.
Use it for transient data that should trigger app-level side effects without being persisted in the message.

```ts
type ChatOnData = (part: ChatDataMessagePart) => void;
```

```tsx
<ChatBox
  adapter={adapter}
  onData={(part) => {
    if (part.type === 'progress') {
      setProgressPercent(part.data.percent);
    }
  }}
/>
```

This callback is useful for backend-driven UI updates that are transient — progress bars, status indicators, or notifications that should not be stored as message parts.

## `onError`

Fires when any runtime error surfaces — from adapter methods, stream processing, or rendering.

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
      tags: { source: error.source },
    });
  }}
/>
```

### The `ChatError` type

```ts
type ChatErrorCode = 'HISTORY_ERROR' | 'SEND_ERROR' | 'STREAM_ERROR' | 'REALTIME_ERROR';

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

Errors also surface through hooks, so you can display them in custom UI:

```tsx
// Via useChat()
const { error } = useChat();

// Via useChatStatus() — lighter weight, no message subscriptions
const { error } = useChatStatus();
```

## Registration

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

## See also

- [Adapters](/x/react-chat/backend/adapters/) for the adapter interface that produces these events.
- [Controlled State](/x/react-chat/backend/controlled-state/) for the full `ChatProvider` props reference.
- [Hooks Reference](/x/react-chat/resources/hooks/) for `useChatStatus()` and reading error state in components.

## API
