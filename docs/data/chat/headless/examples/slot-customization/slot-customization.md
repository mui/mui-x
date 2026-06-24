---
title: Chat - Slot customization
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Slot customization

<p class="description">Replace slots across the headless primitives to adapt the Chat surface to a custom design system.</p>

Slot replacement keeps the headless behavior and accessibility model while letting the markup match a product-specific design system.

Large applications that already standardize avatars, typography, and surfaces can adopt this pattern to reuse Chat's interaction and accessibility behavior without rewriting it.

- Slot replacement across multiple primitive groups
- `slotProps` for passing local configuration
- Owner-state-driven styling hooks
- Choosing slot replacement instead of rebuilding from headless primitives

The demo below replaces the conversation list, message, and composer slots with custom components driven by owner state:

{{"demo": "SlotCustomization.js"}}

## Key primitives

- Slot replacement on roots, rows, and leaf subparts
- Owner-state values such as `selected`, `unread`, `focused`, `hasValue`, `isStreaming`, and `isGrouped`
- `slotProps` for passing local configuration into custom components

## Choosing slot replacement

- Replace slots in more than one primitive group, because the slot model behaves consistently across the package.
- Keep the example grounded in a realistic design-system adaptation rather than a trivial tag swap.
- Use slot replacement when the shipped behavior is correct; drop down to headless primitives when the structure itself needs to change.

## When to use this pattern

Use this pattern when:

- The Chat's interaction and accessibility behavior is correct as shipped
- the product markup needs to align with an existing component system
- styling requires owner-state-aware custom wrappers

This is common in design-system-heavy products where avatars, typography, buttons, surfaces, and layout containers are already standardized across the application.

## Key behaviors of the slot model

- The slot model is consistent across conversation list, message surfaces, composer, and indicators.
- Owner state is the bridge between shipped behavior and product-specific rendering.
- Slot replacement is still a structural customization path, not a full runtime rewrite.

## See also

- See [Customization](/x/react-chat/headless/customization/) for details on the cross-cutting reference.
- See [Minimal headless shell](/x/react-chat/headless/examples/minimal-shell/) for details on the default structure.

## API

- [ChatRoot](/x/api/chat/chat-root/)
