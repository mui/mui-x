---
productId: x-chat
title: Chat - Type augmentation
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Type augmentation

<p class="description">Extend the type system with app-specific metadata, typed tools, data parts, and custom message parts via module augmentation.</p>

The core package uses [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) instead of generic props for type-safe customization.
This means you declare your app-specific types once, and they flow through the entire stack—messages, stream chunks, selectors, hooks, and renderers.

The following demo shows type augmentation in practice:

{{"demo": "../examples/type-augmentation/TypeAugmentationHeadlessChat.js", "bg": "inline", "defaultCodeOpen": false, "hideToolbar": true}}

## The six registry interfaces

All augmentable interfaces live under `@mui/x-chat/types`:

| Interface                  | Affects                                  | Description                           |
| :------------------------- | :--------------------------------------- | :------------------------------------ |
| `ChatUserMetadata`         | `ChatUser.metadata`                      | Extra fields on user objects          |
| `ChatConversationMetadata` | `ChatConversation.metadata`              | Extra fields on conversation objects  |
| `ChatMessageMetadata`      | `ChatMessage.metadata`                   | Extra fields on message objects       |
| `ChatToolDefinitionMap`    | `ChatToolInvocation`, stream tool chunks | Typed tool input/output per tool name |
| `ChatDataPartMap`          | `ChatDataMessagePart`, data chunks       | Typed payloads per `data-*` type      |
| `ChatCustomMessagePartMap` | `ChatMessagePart`                        | Entirely new message part types       |

## How to augment

### Step 1: Declare the module

Create a type declaration file (for example, `chat-types.d.ts`) or use `declare module` in any `.ts` file:

```ts
declare module '@mui/x-chat/types' {
  interface ChatMessageMetadata {
    model?: 'gpt-4.1' | 'gpt-5';
    confidence?: 'low' | 'medium' | 'high';
  }
}
```

### Step 2: Register tool definitions

Add entries to `ChatToolDefinitionMap` to get typed `input` and `output` on tool invocations:

```ts
declare module '@mui/x-chat/types' {
  interface ChatToolDefinitionMap {
    'ticket.lookup': {
      input: { ticketId: string };
      output: { status: 'open' | 'blocked' | 'resolved'; assignee: string };
    };
    weather: {
      input: { location: string; units?: 'metric' | 'imperial' };
      output: { forecast: string; temperatureC: number };
    };
  }
}
```

Once registered, `ChatToolInvocation<'weather'>` has typed `input` and `output` fields, and stream chunks like `tool-input-available` and `tool-output-available` carry the corresponding types.

### Step 3: Register data part types

Add entries to `ChatDataPartMap` to type `data-*` stream chunks and message parts:

```ts
declare module '@mui/x-chat/types' {
  interface ChatDataPartMap {
    'data-citations': {
      citations: Array<{ url: string; title: string }>;
      count: number;
    };
  }
}
```

### Step 4: Register custom message parts

Add entries to `ChatCustomMessagePartMap` for entirely new part types:

```ts
declare module '@mui/x-chat/types' {
  interface ChatCustomMessagePartMap {
    'ticket-summary': {
      type: 'ticket-summary';
      ticketId: string;
      severity: 'low' | 'medium' | 'high';
    };
  }
}
```

Custom parts are included in the `ChatMessagePart` union, so they appear in `message.parts` and can be rendered through `partRenderers` and `useChatPartRenderer()`.

## End-to-end example

Here is a complete augmentation that combines metadata, a typed tool, a typed data part, and a custom message part:

```ts
// chat-types.d.ts
declare module '@mui/x-chat/types' {
  interface ChatUserMetadata {
    department?: string;
  }

  interface ChatMessageMetadata {
    model?: string;
    tokenCount?: number;
  }

  interface ChatToolDefinitionMap {
    'ticket.lookup': {
      input: { ticketId: string };
      output: { status: string; assignee: string };
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
      ticketId: string;
    };
  }
}
```

With this declaration in place:

- `message.metadata?.model` is typed as `string | undefined`
- `message.metadata?.tokenCount` is typed as `number | undefined`
- Tool invocations for `'ticket.lookup'` have typed `input` and `output`
- `data-ticket-status` chunks and parts carry the `ticketId` and `status` fields
- `message.parts` includes the `'ticket-summary'` variant
- `useChatPartRenderer('ticket-summary')` returns a typed renderer

## How augmentation propagates

When you add entries to the registry interfaces, TypeScript merges them into the existing types at compile time.
The effect flows through:

1. **Entity types**: `ChatMessage.metadata`, `ChatUser.metadata`, `ChatConversation.metadata` gain the declared fields.
2. **Stream chunks**: Tool and data chunks carry the registered input, output, and payload types.
3. **Message parts**: `ChatMessagePart` union expands to include custom parts.
4. **Hooks**: `useChat().messages` and `useMessage(id)` return messages with augmented types.
5. **Renderers**: `useChatPartRenderer('ticket-summary')` returns a renderer typed for the custom part.

No runtime code changes are needed. The augmentation is purely compile-time.

## Gotchas

### Module resolution

Make sure your `.d.ts` file is included in your `tsconfig.json`.
If the declaration is in a `types/` directory, add it to the `include` array:

```json
{
  "include": ["src", "types"]
}
```

### Avoid circular references

Do not import from `@mui/x-chat/headless` inside a `declare module` block.
Use inline types or import types outside the declaration:

```ts
// Good
declare module '@mui/x-chat/types' {
  interface ChatMessageMetadata {
    model?: string;
  }
}

// Bad — may cause circular resolution
declare module '@mui/x-chat/types' {
  import { ChatUser } from '@mui/x-chat/headless'; // avoid this
  interface ChatMessageMetadata {
    reviewer?: ChatUser;
  }
}
```

### Multiple augmentation files

You can split augmentations across multiple files.
TypeScript merges all declarations for the same module.
Just make sure each file is included in your `tsconfig`.

## See also

- [Hooks](/x/react-chat/core/hooks/) for `useChatPartRenderer()` and typed hook return values.
- [State and store](/x/react-chat/core/state/) for `partRenderers` registration on `ChatProvider`.
- [Streaming](/x/react-chat/core/streaming/) for how typed chunks flow through the stream.
- [Type augmentation](/x/react-chat/core/examples/type-augmentation/) for a runnable demo combining all registry interfaces.
- [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) for custom part rendering with the registry.

## API

- [ChatRoot](/x/api/chat/chat-root/)
