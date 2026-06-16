---
title: Chat - Custom message part rendering
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Custom message part rendering

<p class="description">Customize selected message parts while preserving the default headless message structure.</p>

Override one or two message part types while keeping the default row layout intact.

Replace only the part types that need branded or domain-specific rendering, and keep the default renderers for everything else.

The demo below uses `Message.Content` with `getDefaultMessagePartRenderer()` to override the `reasoning` part while preserving the default renderers for everything else:

{{"demo": "CustomMessagePartRendering.js"}}

## Overriding a part renderer

- `Message.Content` as the structural message-content surface
- `getDefaultMessagePartRenderer()` to preserve shipped rendering behavior
- targeted overrides for parts such as `reasoning`, `tool`, `file`, or `data-*`

## Implementation notes

- Keep the override narrow—replace one part type without rebuilding the whole message surface.
- Use a message with multiple part types so the fallback path is visible.
- Keep customization inside `Message.Content` rather than rebuilding the message from headless primitives.

## When to use this pattern

Use this pattern when:

- You like the default message structure.
- Certain message parts need brand-specific rendering.
- You want to preserve most of the default behavior and change only a subset of content.

This pattern fits reasoning disclosures, tool outputs, citations, files, and `data-*` parts that need richer domain UI than the defaults provide.

## Things to watch for

- Use `getDefaultMessagePartRenderer()` to keep the default renderers for parts you don't override.
- Overriding one part type does not require forking message rows, groups, or the entire message surface.

## See also

- See [Messages](/x/react-chat/headless/messages/) for the default part renderer reference.
- See [Slot customization](/x/react-chat/headless/examples/slot-customization/) to extend customization beyond message content into row structure.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
