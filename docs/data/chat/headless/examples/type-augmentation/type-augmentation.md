---
title: Chat - Type augmentation
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Type augmentation

<p class="description">Use TypeScript module augmentation to add app-specific metadata, typed tools, typed <code>data-*</code> parts, and custom message parts to the headless runtime.</p>

Headless chat does not use provider props for type overrides.
Instead, extend `@mui/x-chat/headless/types` with [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

This demo keeps the setup intentionally small while showing how one augmentation affects the whole stack:

- user, conversation, and message metadata
- one typed tool definition
- one typed `data-*` part
- one custom message part rendered through `partRenderers` and `useChatPartRenderer()`

## Key concepts

### Declaring custom types

Create a `declare module` block targeting `@mui/x-chat/headless/types`:

```ts
declare module '@mui/x-chat/headless/types' {
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

Once declared, the augmentation affects everything:

- `message.metadata?.model` is typed as `string | undefined`
- `ChatToolInvocation<'ticket.lookup'>` has typed `input` and `output`
- `data-ticket-status` chunks and parts carry `ticketId` and `status`
- `message.parts` includes `'ticket-summary'` in its union
- `useChatPartRenderer('ticket-summary')` returns a typed renderer

### Rendering custom parts

Register a renderer for your custom part type on `ChatProvider`:

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

For the runtime-specific approval flow, see [Tool approval and renderers](/x/react-chat/headless/examples/tool-approval-and-renderers/).

{{"demo": "TypeAugmentationHeadlessChat.js"}}

## Key takeaways

- Module augmentation is the headless package's type-extension model — no provider props needed
- Types propagate through messages, stream chunks, selectors, hooks, and renderers at compile time
- Six registry interfaces cover metadata, tools, data parts, and custom message parts
- Custom renderers pair naturally with custom part types through `partRenderers` and `useChatPartRenderer()`

## See also

- [Type augmentation](/x/react-chat/headless/types/) for the full reference covering all six registry interfaces and gotchas
- [Tool approval and renderers](/x/react-chat/headless/examples/tool-approval-and-renderers/) for the approval flow pattern
- [Streaming](/x/react-chat/headless/streaming/) for how typed chunks flow through the protocol

## API

- [ChatRoot](/x/api/chat/chat-root/)
