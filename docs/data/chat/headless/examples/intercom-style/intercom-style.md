---
title: Chat - Intercom-style widget
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Intercom-style widget

<p class="description">Replicate the look and feel of an Intercom-style chat widget using headless slot customization.</p>

Customize the headless primitives to produce a compact Intercom-style support widget—rounded corners, branded header, bubble-style messages, and a `Powered by` footer.

- Widget-like container with a fixed size and rounded corners.
- Custom header with agent info, back, and close buttons.
- Bubble-shaped messages with user and assistant alignment.
- Assistant metadata line with agent role label.
- Composer with attachment icons and a round send button.
- Footer branding.

The demo below shows the full Intercom-style widget assembled from the headless primitives:

{{"demo": "IntercomStyleChat.js"}}

## Implementing the widget shell

- Use `forwardRef` for every slot and spread `ownerState` plus the remaining props.
- Drive user-versus-assistant alignment from the `role` field on `ownerState`.
- Keep brand tokens in a single object and apply them through inline styles.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
