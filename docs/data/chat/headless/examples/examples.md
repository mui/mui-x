---
title: Chat — Headless examples
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat — Headless examples

<p class="description">Build chat interfaces from end-to-end composition patterns using <code>@mui/x-chat/headless</code> primitives.</p>

Each demo composes the `@mui/x-chat/headless` runtime with its structural component model to show how a pattern fits in a real chat surface and why to choose it over a lower-level approach.

## When to use these demos

Use these demos to answer practical composition questions such as:

- What the smallest complete headless shell looks like
- How the default split-pane inbox is assembled
- Where grouping, date dividers, and indicators belong in the render tree
- How far slot replacement can go before a surface should drop down to headless primitives

Start with the smallest shell, then move deeper into the areas you need to customize.

## Real-world applicability

These demos map well to common product surfaces such as:

- Support and operations inboxes
- Embedded copilots in dashboards and admin tools
- Customer-facing assistants with custom branding
- Collaboration panels with long-running conversation history
- Internal tools that need structure and accessibility without a full styled component set

## Start here

- [Minimal headless shell](/x/react-chat/headless/examples/minimal-shell/) — the smallest complete chat surface.
- [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) — the default split-pane application layout.

## Message and thread patterns

- [Grouped message timeline](/x/react-chat/headless/examples/grouped-message-timeline/) — author grouping and custom timeline presentation.
- [Indicators in context](/x/react-chat/headless/examples/indicators-in-context/) — typing, unread, and scroll affordances in a realistic thread.
- [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) — selective replacement of default part rendering.

## Composer and customization patterns

- [Composer with attachments](/x/react-chat/headless/examples/composer-with-attachments/) — the full draft toolbar pattern.
- [Slot customization](/x/react-chat/headless/examples/slot-customization/) — owner-state-driven slot replacement across multiple primitive groups.

## Suggested learning order

1. Start with [Minimal headless shell](/x/react-chat/headless/examples/minimal-shell/) to learn the canonical component stack.
2. Move to [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) to understand the most common application layout.
3. Choose a specialization:
   - [Grouped message timeline](/x/react-chat/headless/examples/grouped-message-timeline/) for message presentation
   - [Composer with attachments](/x/react-chat/headless/examples/composer-with-attachments/) for draft interactions
   - [Indicators in context](/x/react-chat/headless/examples/indicators-in-context/) for unread and typing affordances
4. Finish with [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) and [Slot customization](/x/react-chat/headless/examples/slot-customization/) when the default structure is no longer enough.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
