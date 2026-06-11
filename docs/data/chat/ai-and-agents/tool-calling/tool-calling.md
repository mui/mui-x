---
productId: x-chat
title: Tool calling
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Tool calling

<p class="description">Stream, track, and render LLM tool calls through their full lifecycle of input, execution, and output.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Tool calling lets an AI assistant invoke external functions during a conversation.
The runtime tracks the full tool lifecycle through the streaming chunk protocol — streaming tool input, exposing the parsed input, and surfacing the tool's output and errors — so you can render each stage. Executing the tool itself is your backend's (or adapter's) responsibility.

The demo below streams a `get_weather` tool call through `input-streaming` → `input-available` → `output-available` and renders each stage with a custom tool card:

{{"demo": "ToolCallingLifecycle.js", "bg": "inline", "defaultCodeOpen": false}}

## Tool message part structure

When a tool is invoked during streaming, the runtime creates a `ChatToolMessagePart` on the assistant message:

```ts
interface ChatToolMessagePart<
  TToolName extends ChatKnownToolName = ChatKnownToolName,
> {
  type: 'tool';
  toolInvocation: ChatToolInvocation<TToolName>;
}
```

Each tool message part wraps a `ChatToolInvocation` that tracks the tool's lifecycle:

```ts
interface ChatToolInvocation<
  TToolName extends ChatKnownToolName = ChatKnownToolName,
> {
  toolCallId: string;
  toolName: TToolName;
  state: ChatToolInvocationState;
  input?: ChatToolInput<TToolName>;
  output?: ChatToolOutput<TToolName>;
  errorText?: string;
  approval?: ChatToolApproval;
  providerExecuted?: boolean;
  title?: string;
  callProviderMetadata?: Record<string, unknown>;
  preliminary?: boolean;
}
```

## Tool invocation states

The `toolInvocation.state` field tracks the tool lifecycle through well-defined states:

| State                | Description                                |
| :------------------- | :----------------------------------------- |
| `input-streaming`    | Tool input JSON is being streamed          |
| `input-available`    | Tool input is fully available              |
| `approval-requested` | User approval is needed before execution   |
| `approval-responded` | User has responded to the approval request |
| `output-available`   | Tool output is ready                       |
| `output-error`       | Tool execution failed                      |
| `output-denied`      | User denied the tool call                  |

The typical progression is: `input-streaming` -> `input-available` -> `output-available`.
When [human-in-the-loop approval](/x/react-chat/ai-and-agents/tool-approval/) is required, the flow includes `approval-requested` -> `approval-responded` between input and output.

## Stream chunk protocol

Tool chunks in the streaming protocol drive the state transitions:

| Chunk type              | Fields                                                       | Description                            |
| :---------------------- | :----------------------------------------------------------- | :------------------------------------- |
| `tool-input-start`      | `toolCallId`, `toolName`, `dynamic?`                         | Begin a tool invocation                |
| `tool-input-delta`      | `toolCallId`, `inputTextDelta`                               | Stream tool input JSON                 |
| `tool-input-available`  | `toolCallId`, `toolName`, `input`, `dynamic?`                | Tool input is fully available          |
| `tool-input-error`      | `toolCallId`, `errorText`                                    | Tool input parsing failed              |
| `tool-approval-request` | `approvalId?`, `toolCallId`, `toolName`, `input`, `dynamic?` | Request user approval before execution |
| `tool-output-available` | `toolCallId`, `output`, `preliminary?`                       | Tool output is available               |
| `tool-output-error`     | `toolCallId`, `errorText`                                    | Tool execution failed                  |
| `tool-output-denied`    | `toolCallId`, `reason?`                                      | User denied the tool call              |

For the approval request/response flow, see [Tool approval](/x/react-chat/ai-and-agents/tool-approval/).

### Tool input streaming

Tool input is streamed incrementally as JSON.
The `tool-input-start` chunk begins the invocation with the tool name, `tool-input-delta` chunks append partial JSON, and `tool-input-available` delivers the complete parsed input:

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

## Observing tool invocations

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

The callback fires on every state change — not just when output is available. Use it for side effects that live outside the chat state — logging, analytics, and external API calls.

### Callback payload structure

```ts
interface ChatOnToolCallPayload {
  toolCall: ChatToolInvocation | ChatDynamicToolInvocation;
}
```

The `toolCall` object includes `toolCallId`, `toolName`, `state`, `input`, `output`, `errorText`, and `approval` fields — all typed based on your `ChatToolDefinitionMap` augmentation.

## Tool type registry

Use TypeScript module augmentation to register typed tool definitions.
This gives you type-safe `input` and `output` on tool invocations:

```ts
declare module '@mui/x-chat/types' {
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
// ...stream the input deltas, then mark the input as available —
// the `dynamic: true` flag must be repeated here for the same call.
controller.enqueue({
  type: 'tool-input-available',
  toolCallId: 'call-2',
  toolName: 'user_defined_tool',
  input: { query: 'anything' },
  dynamic: true,
});
```

:::warning
The `dynamic: true` flag must be set on every chunk that identifies the tool — `tool-input-start`, `tool-input-available`, and `tool-approval-request` — for the same `toolCallId`, not just the first one. Omitting it on later chunks causes TypeScript to treat the chunk as a registered tool.
:::

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
  providerExecuted?: boolean;
  title?: string;
  callProviderMetadata?: Record<string, unknown>;
  preliminary?: boolean;
}
```

`ChatDynamicToolInvocation` has the same shape as `ChatToolInvocation` — the only difference is that `input` and `output` are typed as `unknown`.

## Rendering tool parts

Register custom renderers for tool parts through the `partRenderers` prop on `ChatProvider`:

```tsx
function ToolCard({ invocation }: { invocation: ChatToolInvocation }) {
  switch (invocation.state) {
    case 'input-streaming':
      return <Skeleton>Calling {invocation.toolName}…</Skeleton>;
    case 'output-available':
      return <pre>{JSON.stringify(invocation.output, null, 2)}</pre>;
    case 'output-error':
      return <Alert severity="error">{invocation.errorText}</Alert>;
    default:
      return <pre>{JSON.stringify(invocation.input, null, 2)}</pre>;
  }
}

const renderers: ChatPartRendererMap = {
  tool: ({ part }) => <ToolCard invocation={part.toolInvocation} />,
};

<ChatProvider adapter={adapter} partRenderers={renderers}>
  <MyChat />
</ChatProvider>;
```

See the demo at the top of this page for a complete `ToolCard` implementation.

Use `useChatPartRenderer('tool')` inside any component to look up the registered renderer:

```tsx
function MessagePart({ part, message, index }) {
  const renderer = useChatPartRenderer(part.type);

  if (renderer) {
    return renderer({ part, message, index });
  }

  // Render your own fallback here — parts without a registered renderer
  // are otherwise dropped. Built-in components like <ChatMessageContent />
  // only consult this hook first and fall back to their default part rendering.
  return null;
}
```

When building custom tool cards, announce state transitions to assistive technology — for example with a polite live region when output arrives — and keep interactive elements reachable through the message list's keyboard navigation. See the [message list accessibility model](/x/react-chat/material/message-list/#accessibility) for details.

## See also

- [Tool approval](/x/react-chat/ai-and-agents/tool-approval/) for details on human-in-the-loop approval of tool calls.
- [Streaming](/x/react-chat/behavior/streaming/) for details on the full stream chunk protocol reference.
- [Step tracking](/x/react-chat/ai-and-agents/step-tracking/) for details on multi-step agent progress.
