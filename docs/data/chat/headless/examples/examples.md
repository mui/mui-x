---
title: Chat - Headless examples
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Headless examples

<p class="description">Demo-first patterns for building chat interfaces with <code>@mui/x-chat/headless</code> structural primitives.</p>

These demos focus on end-to-end composition patterns rather than isolated component references.
Each demo stays inside the headless layer: the runtime comes from `@mui/x-chat/headless`, but the learning surface is the structural component model exposed by `@mui/x-chat/headless`.

The section is meant to answer real product questions, not just API questions.
Each page shows where a pattern fits in an actual chat surface and why a team would choose it over a simpler or lower-level approach.

## How to use this section

Use these demos when you want to answer practical composition questions such as:

- what the smallest complete headless shell looks like
- how the default split-pane inbox is assembled
- where grouping, date dividers, and indicators belong in the render tree
- how far slot replacement can go before a surface should drop down to headless primitives

Start with the smallest shell, then move deeper into the areas you need to customize.

## Real-world applicability

These demos map well to common product surfaces such as:

- support and operations inboxes
- embedded copilots inside dashboards and admin tools
- customer-facing assistants with custom branding
- collaboration panels with long-running conversation history
- internal tools that need strong structure and accessibility without adopting a full styled component set

## Start here

- [Minimal headless shell](/x/react-chat/headless/examples/minimal-shell/) for the smallest complete chat surface
- [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) for the default split-pane application layout

## Message and thread patterns

- [Grouped message timeline](/x/react-chat/headless/examples/grouped-message-timeline/) for author grouping and custom timeline presentation
- [Indicators in context](/x/react-chat/headless/examples/indicators-in-context/) for typing, unread, and scroll affordances in a realistic thread
- [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) for selective replacement of default part rendering

## Composer and customization patterns

- [Composer with attachments](/x/react-chat/headless/examples/composer-with-attachments/) for the full draft toolbar pattern
- [Slot customization](/x/react-chat/headless/examples/slot-customization/) for owner-state-driven slot replacement across multiple primitive groups

## Recommended progression

1. Start with [Minimal headless shell](/x/react-chat/headless/examples/minimal-shell/) to learn the canonical component stack.
2. Move to [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) to understand the most common application layout.
3. Choose a specialization:
   - [Grouped message timeline](/x/react-chat/headless/examples/grouped-message-timeline/) for message presentation
   - [Composer with attachments](/x/react-chat/headless/examples/composer-with-attachments/) for draft interactions
   - [Indicators in context](/x/react-chat/headless/examples/indicators-in-context/) for unread and typing affordances
4. Finish with [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) and [Slot customization](/x/react-chat/headless/examples/slot-customization/) when the default structure is no longer enough.

## API

- [ChatRoot](/x/api/chat/chat-root/)
