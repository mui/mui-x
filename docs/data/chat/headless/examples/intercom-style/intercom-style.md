---
title: Chat - Intercom-Style Widget
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Intercom-Style Widget

<p class="description">Replicate the look and feel of an Intercom-style chat widget using headless slot customization.</p>

This demo shows how slot replacement can transform the default chat layout into a compact support-widget appearance: rounded corners, branded header, bubble-style messages, and a "Powered by" footer.

- widget-like container with a fixed size and rounded corners
- custom header with agent info, back, and close buttons
- bubble-shaped messages with user/assistant alignment
- assistant metadata line with agent role label
- composer with attachment icons and a round send button
- footer branding

{{"demo": "IntercomStyleChat.js"}}

## Key techniques

- Every slot is a `forwardRef` component that reads `ownerState` and spreads remaining props
- The `role` field from owner state drives alignment (user vs. assistant)
- Brand tokens are kept in a single object and applied through inline styles

## API

- [ChatRoot](/x/api/chat/chat-root/)
