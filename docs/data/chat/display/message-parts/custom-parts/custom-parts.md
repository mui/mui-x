---
productId: x-chat
title: Custom Parts
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Custom Parts

<p class="description">Extend the message part system with app-specific content types using <code>ChatDataMessagePart</code>, the type registry, and custom renderers.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The built-in part types (text, file, source-url, source-document, tool) cover common chat patterns. When your application needs domain-specific content — ticket cards, approval forms, charts, or product previews — use the extensibility points described on this page.

## Data parts

`ChatDataMessagePart` is the built-in extensibility point for custom payloads. Data parts use a `type` string prefixed with `data-` and carry an arbitrary `data` payload:

```ts
interface ChatDataMessagePart {
  type: `data-${string}`;
  id?: string;
  data: unknown;
  transient?: boolean;
}
```

The default renderer displays data parts as formatted JSON. Replace it with a custom renderer for richer UI.

## Type registry pattern

Use TypeScript module augmentation to get compile-time safety for your custom parts. Two registry interfaces are available for this purpose:

### Typed data parts

Add entries to `ChatDataPartMap` to type the `data` payload of `data-*` parts:

```ts
declare module '@mui/x-chat/types' {
  interface ChatDataPartMap {
    'data-ticket-status': {
      ticketId: string;
      status: 'open' | 'blocked' | 'resolved';
    };
  }
}
```

Once registered, `data-ticket-status` parts carry typed `data` instead of `unknown`.

### Entirely new part types

Add entries to `ChatCustomMessagePartMap` to create part types that are not prefixed with `data-`:

```ts
declare module '@mui/x-chat/types' {
  interface ChatCustomMessagePartMap {
    'ticket-summary': {
      type: 'ticket-summary';
      summary: string;
      ticketId: string;
    };
  }
}
```

Custom parts are included in the `ChatMessagePart` union, so they appear in `message.parts` and can be rendered through the custom renderer system.

## Registering custom renderers

### With ChatProvider

Register renderers on `ChatProvider` using the `partRenderers` prop:

```tsx
<ChatProvider
  adapter={adapter}
  partRenderers={{
    'ticket-summary': ({ part }) => (
      <div className="ticket-card">
        <h4>Ticket: {part.ticketId}</h4>
        <p>{part.summary}</p>
      </div>
    ),
    'data-ticket-status': ({ part }) => (
      <span className={`status-badge status-${part.data.status}`}>
        {part.data.status}
      </span>
    ),
  }}
>
  <MyChat />
</ChatProvider>
```

### Looking up renderers

Use `useChatPartRenderer()` to retrieve a registered renderer in any component:

```tsx
import { useChatPartRenderer } from '@mui/x-chat';

function MyMessagePart({ part }) {
  const renderer = useChatPartRenderer(part.type);
  if (renderer) {
    return renderer({ part, message, index: 0 });
  }
  return <DefaultFallback part={part} />;
}
```

## Selective override with getDefaultMessagePartRenderer

When you only need to customize one or two part types and keep defaults for the rest, use `getDefaultMessagePartRenderer()`:

```tsx
import { getDefaultMessagePartRenderer } from '@mui/x-chat';

function renderPart(part, message, index) {
  // Custom rendering for one part type
  if (part.type === 'data-ticket-status') {
    return <TicketStatusBadge data={part.data} />;
  }

  // Default rendering for everything else
  const renderer = getDefaultMessagePartRenderer(part);
  return renderer ? renderer({ part, message, index }) : null;
}
```

This pattern keeps the override narrow — replace one part type without forking the whole message surface.

## How types flow through the stack

Once declared, the augmentation affects everything at compile time:

1. **Message parts** — `message.parts` includes custom parts in its union
2. **Stream chunks** — data chunks carry the registered payload types
3. **Hooks** — `useChat().messages` returns messages with augmented part types
4. **Renderers** — `useChatPartRenderer('ticket-summary')` returns a typed renderer

No runtime code changes are needed. The augmentation is purely compile-time.

## See also

- [Custom Parts](/x/react-chat/display/message-parts/custom-parts/) for building custom part renderers
