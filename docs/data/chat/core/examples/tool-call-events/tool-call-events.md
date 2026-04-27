---
title: Chat - Tool call events
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Tool call events

<p class="description">Observe tool invocation state changes with onToolCall and drive side effects outside the message list.</p>

This demo focuses on the `onToolCall` callback and how to use it for side effects that live outside the message store:

- observing tool input and output state changes
- building a local audit log from tool invocations
- reacting to specific tool names with app-level logic

## Key concepts

### Observing tool invocations

Register `onToolCall` on `ChatProvider` to observe every tool invocation state change during streaming:

```tsx
<ChatProvider
  adapter={adapter}
  onToolCall={({ toolCall }) => {
    console.log(`Tool "${toolCall.toolName}" is now ${toolCall.state}`);

    if (toolCall.state === 'output-available') {
      // Drive side effects — update dashboards, trigger notifications, etc.
    }
  }}
>
  <MyChat />
</ChatProvider>
```

### Tool invocation states

The `toolCall.state` field tracks the tool lifecycle:

| State                | Description                        |
| :------------------- | :--------------------------------- |
| `input-streaming`    | Tool input is being streamed       |
| `input-available`    | Tool input is fully available      |
| `approval-requested` | User approval is needed            |
| `approval-responded` | User has responded to the approval |
| `output-available`   | Tool output is ready               |
| `output-error`       | Tool execution failed              |
| `output-denied`      | User denied the tool call          |

### Callback payload structure

```ts
interface ChatOnToolCallPayload {
  toolCall: ChatToolInvocation | ChatDynamicToolInvocation;
}
```

The `toolCall` object includes `toolCallId`, `toolName`, `state`, `input`, `output`, `errorText`, and `approval` fields—all typed based on your `ChatToolDefinitionMap` augmentation.

{{"demo": "ToolCallEventsHeadlessChat.js"}}

## Key takeaways

- `onToolCall` fires on every tool state change—not just when output is available
- Use it for side effects outside the store: logging, analytics, external API calls
- Tool invocation state progresses through a well-defined lifecycle from input to output
- For approval flows, see the [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) demo

## See also

- [Streaming](/x/react-chat/core/streaming/) for the tool chunk protocol reference
- [Type augmentation](/x/react-chat/core/types/) for typing tool input and output
- [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) for approval flows and custom part rendering
- [State and store](/x/react-chat/core/state/) for all callback signatures

## API

- [ChatRoot](/x/api/chat/chat-root/)
