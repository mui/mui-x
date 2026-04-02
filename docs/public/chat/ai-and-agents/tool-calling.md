---
productId: x-chat
title: Tool Calling
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Tool Calling

Stream tool invocations from the LLM, track their lifecycle through well-defined states, and render custom tool UIs using the part renderer registry.



:::info
Tool Calling is part of the MUI X Premium plan.
:::

Tool calling lets an AI assistant invoke external functions during a conversation. The runtime handles the full tool lifecycle: streaming tool input, making the input available, executing the tool, and displaying the output — all through the streaming chunk protocol.

## `ChatToolMessagePart` [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

When a tool is invoked during streaming, the runtime creates a `ChatToolMessagePart` on the assistant message:

```ts
interface ChatToolMessagePart<TToolName extends ChatKnownToolName = ChatKnownToolName> {
  type: 'tool';
  toolInvocation: ChatToolInvocation<TToolName>;
}
```

Each tool message part wraps a `ChatToolInvocation` that tracks the tool's lifecycle:

```ts
interface ChatToolInvocation<TToolName extends ChatKnownToolName = ChatKnownToolName> {
  toolCallId: string;
  toolName: TToolName;
  state: ChatToolInvocationState;
  input?: ChatToolInput<TToolName>;
  output?: ChatToolOutput<TToolName>;
  errorText?: string;
  approval?: ChatToolApproval;
  providerExecuted?: boolean;
  title?: string;
  preliminary?: boolean;
}
```

## Tool invocation states

The `toolInvocation.state` field tracks the tool lifecycle through well-defined states:

| State                | Description                                  |
| :------------------- | :------------------------------------------- |
| `input-streaming`    | Tool input JSON is being streamed            |
| `input-available`    | Tool input is fully available                |
| `approval-requested` | User approval is needed before execution     |
| `approval-responded` | User has responded to the approval request   |
| `output-available`   | Tool output is ready                         |
| `output-error`       | Tool execution failed                        |
| `output-denied`      | User denied the tool call                    |

The typical progression is: `input-streaming` -> `input-available` -> `output-available`. When human-in-the-loop approval is required, the flow includes `approval-requested` -> `approval-responded` between input and output.

## Stream chunk protocol

Tool chunks in the streaming protocol drive the state transitions:

| Chunk type              | Fields                                           | Description                   |
| :---------------------- | :----------------------------------------------- | :---------------------------- |
| `tool-input-start`      | `toolCallId`, `toolName`, `dynamic?`             | Begin a tool invocation       |
| `tool-input-delta`      | `toolCallId`, `inputTextDelta`                   | Stream tool input JSON        |
| `tool-input-available`  | `toolCallId`, `toolName`, `input`                | Tool input is fully available |
| `tool-input-error`      | `toolCallId`, `errorText`                        | Tool input parsing failed     |
| `tool-output-available` | `toolCallId`, `output`, `preliminary?`           | Tool output is available      |
| `tool-output-error`     | `toolCallId`, `errorText`                        | Tool execution failed         |
| `tool-output-denied`    | `toolCallId`, `reason?`                          | User denied the tool call     |

### Tool input streaming

Tool input is streamed incrementally as JSON. The `tool-input-start` chunk begins the invocation with the tool name, `tool-input-delta` chunks append partial JSON, and `tool-input-available` delivers the complete parsed input:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'msg-1' });

        // Tool input streaming
        controller.enqueue({
          type: 'tool-input-start',
          toolCallId: 'call-1',
          toolName: 'get_weather',
        });
        controller.enqueue({
          type: 'tool-input-delta',
          toolCallId: 'call-1',
          inputTextDelta: '{"city":',
        });
        controller.enqueue({
          type: 'tool-input-delta',
          toolCallId: 'call-1',
          inputTextDelta: '"Paris"}',
        });
        controller.enqueue({
          type: 'tool-input-available',
          toolCallId: 'call-1',
          toolName: 'get_weather',
          input: { city: 'Paris' },
        });

        // Tool output
        controller.enqueue({
          type: 'tool-output-available',
          toolCallId: 'call-1',
          output: { temperature: 22, condition: 'sunny' },
        });

        controller.enqueue({ type: 'finish', messageId: 'msg-1' });
        controller.close();
      },
    });
  },
};
```

## The `onToolCall` callback

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

The callback fires on every state change — not just when output is available. Use it for side effects outside the store: logging, analytics, and external API calls.

### The `ChatOnToolCallPayload`

```ts
interface ChatOnToolCallPayload {
  toolCall: ChatToolInvocation | ChatDynamicToolInvocation;
}
```

The `toolCall` object includes `toolCallId`, `toolName`, `state`, `input`, `output`, `errorText`, and `approval` fields — all typed based on your `ChatToolDefinitionMap` augmentation.

## Tool type registry

Use TypeScript module augmentation to register typed tool definitions. This gives you type-safe `input` and `output` on tool invocations:

```ts
declare module '@mui/x-chat/headless' {
  interface ChatToolDefinitionMap {
    get_weather: {
      input: { city: string };
      output: { temperature: number; condition: string };
    };
    search_docs: {
      input: { query: string; limit?: number };
      output: { results: Array<{ title: string; url: string }> };
    };
  }
}
```

Once registered, `ChatToolInvocation<'get_weather'>` correctly types `input` as `{ city: string }` and `output` as `{ temperature: number; condition: string }`.

## Dynamic tools

For tools that are not known at compile time, use `ChatDynamicToolMessagePart` with the `dynamic: true` flag on the `tool-input-start` chunk:

```ts
controller.enqueue({
  type: 'tool-input-start',
  toolCallId: 'call-2',
  toolName: 'user_defined_tool',
  dynamic: true,
});
```

Dynamic tool invocations use `ChatDynamicToolInvocation` with untyped `input` and `output` (`unknown`):

```ts
interface ChatDynamicToolInvocation<TToolName extends string = string> {
  toolCallId: string;
  toolName: TToolName;
  state: ChatToolInvocationState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  approval?: ChatToolApproval;
}
```

## Rendering tool parts

Register custom renderers for tool parts through the `partRenderers` prop on `ChatProvider`:

```tsx
const renderers: ChatPartRendererMap = {
  tool: ({ part, message, index }) => (
    <ToolCard invocation={part.toolInvocation} />
  ),
};

<ChatProvider adapter={adapter} partRenderers={renderers}>
  <MyChat />
</ChatProvider>;
```

Use `useChatPartRenderer('tool')` inside any component to look up the registered renderer:

```tsx
function MessagePart({ part, message, index }) {
  const renderer = useChatPartRenderer(part.type);

  if (renderer) {
    return renderer({ part, message, index });
  }

  return null;
}
```

## API

- [`ChatMessageContent`](/x/api/chat-message-content/)

## See also

- [Tool Approval](/x/react-chat/ai-and-agents/tool-approval/) for human-in-the-loop approval of tool calls.
- [Streaming](/x/react-chat/behavior/streaming/) for the full stream chunk protocol reference.
- [Step Tracking](/x/react-chat/ai-and-agents/step-tracking/) for multi-step agent progress tracking.
- [State and store](/x/react-chat/customization/headless/) for the `onToolCall` callback signature.
