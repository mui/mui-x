---
title: Chat - Tool approval and renderers
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Tool approval and renderers

<p class="description">Approve agent tool calls and render custom message parts through the part renderer registry.</p>

This page covers the main extension points for tool-assisted AI interactions:

- the tool approval lifecycle from `approval-requested` to response
- `addToolApprovalResponse()` for approving or denying tool calls
- follow-up assistant messages via `message-added` events after tool resolution
- `partRenderers` for registering custom part renderers on `ChatProvider`
- `useChatPartRenderer()` for looking up renderers in components
- custom part registration through type augmentation

## Key concepts

### Tool approval flow

When the stream sends a `tool-approval-request` chunk, the tool invocation moves to `state: 'approval-requested'`.
The UI renders an approve/deny interface.
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

See [Type augmentation](/x/react-chat/core/examples/type-augmentation/) for details on TypeScript module augmentation.

The demo below combines the approval flow and a custom part renderer:

{{"demo": "ToolApprovalAndRenderersHeadlessChat.js"}}

## Key takeaways

- Tool approval is a first-class runtime feature—the stream pauses at `approval-requested` until you respond.
- `addToolApprovalResponse()` drives the approval/denial decision
- After tool resolution, the adapter can emit a `message-added` event to deliver the assistant's follow-up interpretation of the result
- `partRenderers` decouples rendering from the message loop—register once, look up anywhere.
- Custom part types registered through module augmentation work with the renderer registry the same as built-in types.

## See also

- See [Type augmentation](/x/react-chat/core/types/) for details on registering custom types.
- See [Streaming](/x/react-chat/core/streaming/) for details on the tool chunk protocol.
- See [Tool call events](/x/react-chat/core/examples/tool-call-events/) for details on the `onToolCall()` callback pattern.
- See [Hooks](/x/react-chat/core/hooks/) for the `useChatPartRenderer()` API reference.

## API

- [ChatRoot](/x/api/chat/chat-root/)
