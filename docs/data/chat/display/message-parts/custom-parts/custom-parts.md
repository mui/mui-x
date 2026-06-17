---
productId: x-chat
title: Custom parts
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Custom parts

<p class="description">Extend the message part system with app-specific content types, custom renderers, and a typed registry.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The built-in part types (`text`, `reasoning`, `file`, `source-url`, `source-document`, `tool`, `dynamic-tool`, `step-start`, and `data-*`) cover common chat patterns.
When the application needs domain-specific content, such as ticket cards, approval forms, charts, or product previews, use the extensibility points described on this page.

:::info

- Plain `data-*` part — one-off custom payloads; no type setup, `data` is `unknown`.
- `data-*` + `ChatDataPartMap` — same wire shape, typed `data` payload.
- `ChatCustomMessagePartMap` — a genuinely new part `type` (not `data-`-prefixed) participating in the `ChatMessagePart` union.

:::

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

This is the simplified, un-augmented shape. Once you register an entry in `ChatDataPartMap` (see [Typed data parts](#typed-data-parts)), the `data` field of that part type is narrowed to the registered payload instead of `unknown`.

Parts with `transient: true` are delivered during streaming but not persisted in the final message—see [Streaming](/x/react-chat/behavior/streaming/) for how transient data chunks arrive over the wire.

The default renderer displays data parts as formatted JSON.
Replace it with a custom renderer to control the presentation.

## Type registry pattern

Use TypeScript module augmentation to get compile-time safety for custom parts. Two registry interfaces are available for this purpose:

### Typed data parts

Add entries to `ChatDataPartMap` to type the `data` payload of `data-*` parts:

```ts
declare module '@mui/x-chat/types' {
  interface ChatDataPartMap {
    'data-ticket-status': {
      ticketId: string;
      status: 'open' | 'blocked' | 'resolved';
      lastUpdated: string;
    };
  }
}
```

Once registered, `data-ticket-status` parts carry typed `data` instead of `unknown`.

### Adding new part types

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

A renderer is a function that receives the part and returns the JSX to display in its place. The following demo registers a `data-ticket-status` renderer that turns the raw payload into a colored status badge—send a message to see new badges stream in instead of the default JSON fallback.

{{"demo": "CustomDataPartChat.js", "bg": "inline", "defaultCodeOpen": false}}

### With `ChatProvider`

Register renderers on `ChatProvider` using the `partRenderers` prop:

```tsx
import { ChatProvider } from '@mui/x-chat/headless';

// `adapter` is any ChatAdapter — see /x/react-chat/backend/adapters/

<ChatProvider
  adapter={adapter}
  partRenderers={{
    'ticket-summary': ({ part }) => (
      <div className="ticket-card">
        <h4>Ticket: {part.ticketId}</h4>
        <p>{part.summary}</p>
      </div>
    ),
    // part.data is typed thanks to the ChatDataPartMap entry above
    'data-ticket-status': ({ part }) => (
      <span className={`status-badge status-${part.data.status}`}>
        {part.data.status}
      </span>
    ),
  }}
>
  <MyChat />
</ChatProvider>;
```

When using the Material `<ChatBox />`, pass the same map through its `partRenderers` prop—no explicit provider needed.

### Looking up renderers

Use `useChatPartRenderer()` to retrieve a registered renderer in any component:

```tsx
import { useChatPartRenderer } from '@mui/x-chat/headless';

function MyMessagePart({ part, message }) {
  const renderer = useChatPartRenderer(part.type);
  if (renderer) {
    return renderer({ part, message, index: 0 });
  }
  return <DefaultFallback part={part} />;
}
```

:::info
Custom renderers replace the built-in markup, so the semantics the defaults provide become your responsibility. Provide a text alternative for purely visual output (the demo's badge carries an `aria-label`), keep interactive elements as real `<button>` or `<a>` elements, and avoid stripping the structural roles the default renderers rely on. See the [Accessibility](/x/react-chat/accessibility/) page for the model your custom parts sit inside.
:::

## Overriding a single part type

When you only need to customize one or two part types and keep defaults for the rest, use `getDefaultMessagePartRenderer()`:

```tsx
import { getDefaultMessagePartRenderer } from '@mui/x-chat/headless';

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

This pattern keeps the override narrow—replace one part type without forking the whole message surface.

## How types flow through the stack

Once declared, the augmentation affects everything at compile time:

1. **Message parts** — `message.parts` includes custom parts in its union
2. **Stream chunks** — data chunks carry the registered payload types
3. **Hooks** — `useChat().messages` returns messages with augmented part types
4. **Renderers** — `useChatPartRenderer('ticket-summary')` returns a typed renderer

No runtime code changes are needed.
The augmentation is purely compile-time.

## See also

- [Text and Markdown](/x/react-chat/display/message-parts/text-and-markdown/) for the most common built-in part type.
- [Streaming](/x/react-chat/behavior/streaming/) for details on how parts arrive over the wire.
