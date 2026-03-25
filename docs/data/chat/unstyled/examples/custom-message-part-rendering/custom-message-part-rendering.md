---
title: Chat - Custom message part rendering
productId: x-chat
packageName: '@mui/x-chat/unstyled'
---

# Custom message part rendering

<p class="description">Customize selected message parts while preserving the default unstyled message structure.</p>

This recipe focuses on the common customization case where the message row layout is correct, but one or two part types need a different presentation.

That is often the most efficient customization point in AI chat products: preserve the shipped row structure and only replace the specific content shapes that need branded or domain-specific treatment.

{{"demo": "CustomMessagePartRendering.js"}}

## What it shows

- `Message.Content`
- `getDefaultMessagePartRenderer()`
- selective replacement of default part renderers
- retaining the default renderers for the remaining part types

## Key primitives

- `Message.Content` as the structural message-content surface
- `getDefaultMessagePartRenderer()` to preserve shipped rendering behavior
- targeted overrides for parts such as `reasoning`, `tool`, `file`, or `data-*`

## Implementation notes

- Keep the override narrow. The main lesson is how to replace one part type without forking the whole message surface.
- Use a message with multiple part types so the fallback path is visible.
- Keep the example inside the unstyled layer rather than rebuilding the whole message in headless primitives.

## When to use this pattern

Use this recipe when:

- a team likes the default message structure
- certain message parts need brand-specific rendering
- the goal is to preserve most of the shipped behavior while changing only a subset of content

This is especially useful for reasoning disclosures, tool outputs, citations, files, and `data-*` parts that need richer domain UI than the defaults provide.

## What to pay attention to

- `getDefaultMessagePartRenderer()` is the key tool for progressive customization.
- Overriding one part type does not require forking message rows, groups, or the entire message surface.

## Next steps

- Continue with [Messages](/x/react-chat/unstyled/messages/) for the default part renderer reference.
- Continue with [Slot customization](/x/react-chat/unstyled/examples/slot-customization/) when the customization needs to extend beyond message content and into row structure.
