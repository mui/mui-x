---
title: Chat - Slot customization
productId: x-chat
packageName: '@mui/x-chat/unstyled'
githubLabel: 'scope: chat'
---

# Chat - Slot customization

<p class="description">Replace root, row, and leaf slots across the unstyled primitives to adapt them to a custom design system</p>

This is the advanced demo for teams that want to keep the unstyled behavior model while reshaping the markup to match a product-specific design system.

It is especially relevant in large applications where chat should adopt an existing design language without rewriting the underlying interaction and accessibility behavior.

- slot replacement across multiple primitive groups
- `slotProps`
- owner-state-driven styling hooks
- choosing slot replacement instead of rebuilding the structure from headless primitives

{{"demo": "SlotCustomization.js"}}

## Key primitives

- slot replacement on roots, rows, and leaf subparts
- owner-state values such as `selected`, `unread`, `focused`, `hasValue`, `isStreaming`, and `isGrouped`
- `slotProps` for passing local configuration into custom components

## Implementation notes

- Use more than one primitive group so the reader understands that the slot model is consistent across the package.
- Keep the example grounded in a realistic design-system adaptation rather than a trivial tag swap.
- Call out where slot replacement remains the right tool and where the surface should instead drop down to headless primitives.

## When to use this pattern

Use this pattern when:

- the shipped interaction and accessibility behavior is correct
- the product markup needs to align with an existing component system
- styling requires owner-state-aware custom wrappers

This is common in design-system-heavy products where avatars, typography, buttons, surfaces, and layout containers are already standardized across the application.

## What to pay attention to

- The slot model is consistent across conversation list, message surfaces, composer, and indicators.
- Owner state is the bridge between shipped behavior and product-specific rendering.
- Slot replacement is still a structural customization path, not a full runtime rewrite.

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- Continue with [Customization](/x/react-chat/unstyled/customization/) for the cross-cutting reference page.
- Return to [Minimal unstyled shell](/x/react-chat/unstyled/examples/minimal-shell/) if the slot model feels abstract and you want to re-anchor on the default structure.
