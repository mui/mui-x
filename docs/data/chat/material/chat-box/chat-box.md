---
productId: x-chat
title: Chat - ChatBox
packageName: '@mui/x-chat'
components: ChatBox
---

# ChatBox

<p class="description">The <code>ChatBox</code> component is a one-liner entry point that composes a complete, theme-aware chat UI from conversations, thread, and composer.</p>

## Basic usage

`ChatBox` wraps the headless runtime and the styled components into a single surface.
Pass an `adapter` and optional default data to get a working chat UI.

{{"demo": "ChatBoxBasic.js"}}

## Thread-only layout

When no conversation source exists (`conversations`, `defaultConversations`, or `adapter.listConversations`), `ChatBox` renders a single-pane thread layout without the conversations sidebar.

{{"demo": "ChatBoxThreadOnly.js"}}

## Controlled state

`ChatBox` accepts the same controlled and uncontrolled state props as `ChatRoot`.
Use `messages` and `onMessagesChange` to own the message array, or `activeConversationId` and `onActiveConversationChange` to control conversation selection.

{{"demo": "ChatBoxControlled.js"}}

## Default props

For prototyping, use `defaultMessages` and `defaultConversations` to seed the UI without wiring up state handlers.
The component manages internal state until you lift it.

```tsx
<ChatBox
  adapter={adapter}
  defaultActiveConversationId="c1"
  defaultConversations={conversations}
  defaultMessages={messages}
/>
```

## Adapter integration

`ChatBox` forwards the adapter to the underlying provider.
When the adapter implements `listConversations` and `listMessages`, `ChatBox` bootstraps entirely from the adapter without requiring default data.

See the [Material UI overview](/x/react-chat/material/) for a custom adapter example.

## Adjacent pages

- See [Composition](/x/react-chat/material/composition/) to build from modular styled components instead of the one-liner.
- See [Slots](/x/react-chat/material/slots/) for the complete ChatBox slot reference.
- See [Theming](/x/react-chat/material/theming/) to customize colors, dark mode, and RTL.
