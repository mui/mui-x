---
productId: x-chat
title: Message actions
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageActions
---

# Chat - Message actions

<p class="description">Reveal per-message action buttons on hover or focus for copy, edit, delete, and custom operations.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatMessageActions` renders an action bar that appears when the user hovers over a `ChatMessage` row or focuses within it.
The actions area occupies the `actions` grid area of the message row and fades in via an opacity transition.

## Playground

Toggle action buttons, variant, and density to preview the hover-revealed toolbar:

{{"demo": "ChatMessageActionsPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Import

```tsx
import { ChatMessageActions } from '@mui/x-chat';
```

:::info
When using `ChatBox`, message actions are already included as a built-in part of the message composition.
You only need to import `ChatMessageActions` directly when building a custom layout.
:::

## Visibility behavior

The action bar is hidden by default (`opacity: 0`) and becomes visible when:

- The user hovers over the parent `ChatMessage` row
- Focus moves to an element inside the `ChatMessage` row (keyboard navigation)

The transition uses a short opacity animation.
When the user prefers reduced motion, the transition is disabled.

```css
/* Visibility is controlled by the parent message's hover/focus state */
.MuiChatMessage-root:hover .MuiChatMessage-actions,
.MuiChatMessage-root:focus-within .MuiChatMessage-actions {
  opacity: 1;
}
```

## Component anatomy

`ChatMessageActions` occupies the `actions` grid area in the message row layout:

```text
ChatMessage (grid)
  ├── ChatMessageAvatar    → grid-area: avatar
  ├── ChatMessageContent   → grid-area: content
  ├── ChatMessageMeta      → grid-area: meta
  └── ChatMessageActions   → grid-area: actions
```

## Adding custom actions

`ChatMessageActions` renders a `<div>` (or custom slot element) that you populate with action buttons.
Override the `actions` slot through `ChatBox`:

{{"demo": "BasicMessageActions.js", "defaultCodeOpen": false, "bg": "inline"}}

### Accessing message context

Inside a custom actions component, use the `ownerState` prop to access the current message data and show different actions for user and assistant messages:

{{"demo": "RoleBasedMessageActions.js", "defaultCodeOpen": false, "bg": "inline"}}

## Owner state

`ChatMessageActions` exposes the message context as owner state so slot components can style themselves conditionally:

| Property    | Type                | Description                       |
| :---------- | :------------------ | :-------------------------------- |
| `messageId` | `string`            | ID of the current message         |
| `role`      | `ChatRole`          | Role of the message author        |
| `status`    | `ChatMessageStatus` | Current status of the message     |
| `streaming` | `boolean`           | Whether the message is streaming  |
| `isGrouped` | `boolean`           | Whether the message is in a group |

## Slots

| Slot      | Default element | Description              |
| :-------- | :-------------- | :----------------------- |
| `actions` | `div`           | The action bar container |

## See also

- [Message appearance](/x/react-chat/display/message-appearance/) for the overall message layout and visual presentation
