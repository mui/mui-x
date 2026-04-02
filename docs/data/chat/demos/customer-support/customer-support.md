---
productId: x-chat
title: Customer Support demo
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Customer Support demo

<p class="description">A compact, embedded chat widget suited for customer support overlays and space-constrained layouts.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Compact chat widget

Set `variant="compact"` on `ChatBox` to switch the entire surface to a messenger-style layout with no bubbles, left-aligned messages, and author names as group headers. This variant is ideal for embedded support widgets, floating chat panels, and any context where vertical space is limited.

{{"demo": "../../material/examples/compact-variant/CompactVariant.js", "defaultCodeOpen": false, "bg": "inline"}}

## What this demo shows

- **Compact variant** — a single prop (`variant="compact"`) transforms the chat from a bubble-based layout to a dense, messenger-style design
- **Minimal footprint** — no colored bubbles, no right-aligned user messages; all content flows left-aligned for maximum density
- **Group headers** — author names and timestamps appear in message group headers rather than below each individual message
- **Embedded widget style** — the compact layout fits naturally inside a floating panel, sidebar drawer, or bottom-right overlay without overwhelming the host page
- **Full feature parity** — despite the visual changes, all ChatBox features (streaming, adapters, conversation switching) remain fully functional

### Default vs. compact comparison

| Default                                  | Compact                                         |
| :--------------------------------------- | :---------------------------------------------- |
| Colored message bubbles                  | Plain text, no background                       |
| User messages right-aligned              | All messages left-aligned                        |
| Timestamp below each message             | Timestamp in the group header, next to author   |
| Conversation list shows avatar + preview | Conversation list shows compact title + actions |

## API

- [`ChatBox`](/x/api/chat/chat-box/)
