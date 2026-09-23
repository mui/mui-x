---
title: Chat - Type augmentation
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Type augmentation

<p class="description">Extend the chat runtime with app-specific metadata, typed tools, typed `data-*` parts, and custom message parts through TypeScript module augmentation.</p>

The core layer does not use provider props for type overrides.
Instead, extend `@mui/x-chat/types` with [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

The demo below augments the runtime in four ways:

- User, conversation, and message metadata.
- One typed tool definition.
- One typed `data-*` part.
- One custom message part rendered through `partRenderers` and `useChatPartRenderer()`.

## Augmenting the core types

### Declaring custom types

Create a `declare module` block targeting `@mui/x-chat/types`:

```ts
declare module '@mui/x-chat/types' {
  interface ChatMessageMetadata {
    model?: 'gpt-4.1' | 'gpt-5';
    confidence?: 'medium' | 'high';
  }

  interface ChatToolDefinitionMap {
    'ticket.lookup': {
      input: { ticketId: string };
      output: { status: 'open' | 'blocked' | 'resolved' };
    };
  }

  interface ChatDataPartMap {
    'data-ticket-status': {
      ticketId: string;
      status: 'open' | 'blocked' | 'resolved';
    };
  }

  interface ChatCustomMessagePartMap {
    'ticket-summary': {
      type: 'ticket-summary';
      summary: string;
    };
  }
}
```

### How types flow through the stack

Once declared, the augmentation propagates through the runtime:

- `message.metadata?.model` is typed as `string | undefined`.
- `ChatToolInvocation<'ticket.lookup'>` has typed `input` and `output`.
- `data-ticket-status` chunks and parts carry `ticketId` and `status`.
- `message.parts` includes `'ticket-summary'` in its union.
- `useChatPartRenderer('ticket-summary')` returns a typed renderer.

### Rendering custom parts

Register a renderer for the custom part type on `ChatProvider`:

```tsx
<ChatProvider
  adapter={adapter}
  partRenderers={{
    'ticket-summary': ({ part }) => <div>Ticket summary: {part.summary}</div>,
  }}
>
  <MyChat />
</ChatProvider>
```

Then look it up in any component:

```tsx
const renderer = useChatPartRenderer('ticket-summary');
```

The demo below shows how a single augmentation flows through metadata, a typed tool, a typed `data-*` part, and a custom message part:

{{"demo": "TypeAugmentationHeadlessChat.js"}}

## Key takeaways

- Module augmentation is the core package's type-extension model—no provider props needed.
- Types propagate through messages, stream chunks, selectors, hooks, and renderers at compile time.
- Six registry interfaces cover metadata, tools, data parts, and custom message parts.
- Custom renderers pair with custom part types through `partRenderers` and `useChatPartRenderer()`.

## See also

- [Type augmentation](/x/react-chat/core/types/) for the full reference covering all six registry interfaces.
- [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) for details on the approval flow.
- [Streaming](/x/react-chat/core/streaming/) for details on how typed chunks flow through the protocol.

## API

- [ChatRoot](/x/api/chat/chat-root/)
