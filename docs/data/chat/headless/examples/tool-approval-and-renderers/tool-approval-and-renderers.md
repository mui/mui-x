---
title: Chat - Tool approval and renderers
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Tool approval and renderers

<p class="description">Combine AI-native runtime features by approving a tool call and rendering a custom message part through the registry.</p>

## What this example shows

This recipe covers the main extension points for tool-assisted AI interactions:

- the tool approval lifecycle from `approval-requested` to response
- `addToolApprovalResponse()` for approving or denying tool calls
- follow-up assistant messages via `message-added` events after tool resolution
- `partRenderers` for registering custom part renderers on `ChatProvider`
- `useChatPartRenderer()` for looking up renderers in components
- custom part registration through type augmentation

## Key concepts

### Tool approval flow

When the stream sends a `tool-approval-request` chunk, the tool invocation moves to `state: 'approval-requested'`.
Your UI renders an approve/deny interface.
When the user responds, call `addToolApprovalResponse()`:

```tsx
const { addToolApprovalResponse } = useChat();

// Approve
await addToolApprovalResponse({
  id: toolCall.toolCallId,
  approved: true,
});

// Deny with reason
await addToolApprovalResponse({
  id: toolCall.toolCallId,
  approved: false,
  reason: 'User declined the operation',
});
```

After responding, the tool invocation moves to `state: 'approval-responded'`, and the stream continues.

### Registering custom renderers

Register renderers for specific part types on `ChatProvider`:

```tsx
const renderers: ChatPartRendererMap = {
  tool: ({ part, message, index }) => <ToolCard invocation={part.toolInvocation} />,
  'custom-widget': ({ part }) => <Widget data={part.data} />,
};

<ChatProvider adapter={adapter} partRenderers={renderers}>
  <MyChat />
</ChatProvider>;
```

### Looking up renderers

Use `useChatPartRenderer(partType)` inside any component to get the registered renderer:

```tsx
function MessagePart({ part, message, index }) {
  const renderer = useChatPartRenderer(part.type);

  if (renderer) {
    return renderer({ part, message, index });
  }

  // Fallback for unregistered types
  return <span>{part.type === 'text' ? part.text : null}</span>;
}
```

For a dedicated walkthrough of TypeScript module augmentation, see [Type augmentation](/x/react-chat/headless/examples/type-augmentation/).

{{"demo": "ToolApprovalAndRenderersHeadlessChat.js"}}

## Key takeaways

- Tool approval is a first-class runtime feature — the stream pauses at `approval-requested` until you respond
- `addToolApprovalResponse()` drives the approval/denial decision
- After tool resolution, the adapter can emit a `message-added` event to deliver the assistant's follow-up interpretation of the result
- `partRenderers` decouples rendering from the message loop — register once, look up anywhere
- Custom part types registered through module augmentation integrate seamlessly with the renderer registry

## Next steps

- [Type augmentation](/x/react-chat/headless/types/) for registering custom types
- [Streaming](/x/react-chat/headless/streaming/) for the tool chunk protocol
- [Tool call events](/x/react-chat/headless/examples/tool-call-events/) for the `onToolCall` callback pattern
- [Hooks](/x/react-chat/headless/hooks/) for the `useChatPartRenderer()` API reference
