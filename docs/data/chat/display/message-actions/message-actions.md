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

`ChatMessageActions` renders an action bar that appears on hover, on keyboard drill-in (<kbd>Enter</kbd> on the focused message), or while focus is inside the bar.
The actions area occupies the `actions` grid area of the message row; the reveal uses a short opacity transition.

## Playground

Toggle action buttons, variant, and density to preview the hover-revealed toolbar:

{{"demo": "ChatMessageActionsPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Import

```tsx
import { ChatMessageActions } from '@mui/x-chat';
```

:::info
`ChatBox` reserves the `actions` grid area and wraps your `messageActions` slot (or declarative `extraActions`) in the styled bar — no actions render until you provide one.
You only need to import `ChatMessageActions` directly when building a custom layout.
:::

## Visibility behavior

The action bar is hidden by default and becomes visible when:

- The user hovers over the parent `ChatMessage` row
- The user drills into the focused message with <kbd>Enter</kbd> (the message list sets `data-actionable="true"` on the row — see [keyboard navigation](/x/react-chat/material/message-list/#keyboard-navigation))
- Focus is inside the action bar itself (`:focus-within`)

While hidden, the bar uses `visibility: hidden` in addition to `opacity: 0`, so the action buttons are removed from the tab order and from hit-testing — tabbing through the chat never stops on an invisible control.
The reveal uses a short opacity transition; when the user prefers reduced motion, the transition is disabled.

```css
/* Selectors used by the built-in styles */
.MuiChatMessage-root:hover .MuiChatMessage-actions,
.MuiChatMessage-root[data-actionable='true'] .MuiChatMessage-actions,
.MuiChatMessage-actions:focus-within {
  opacity: 1;
  visibility: visible;
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

The built-in styles render the bar as a small elevated chip (paper background, rounded corners, shadow) anchored under the bubble.
For the current user's own messages it aligns to the end of the row (`justify-self: end`), matching the right-aligned bubble.
Override either through the `.MuiChatMessage-actions` class.

## Adding custom actions

`ChatMessageActions` renders a `<div>` (or custom slot element) that you populate with action buttons.
When using `ChatBox`, provide the `messageActions` slot to render an action row — `ChatBox` renders no actions until you do. Your component receives `{ messageId }` and is wrapped in the styled hover-revealed bar:

:::info
There are three ways to customize message actions:

- [`extraActions`](#adding-actions-declaratively) appends declarative buttons without writing a component (the function form of `slotProps.messageActions` receives the message context).
- The `messageActions` slot on `ChatBox` renders your own action row component. It receives `{ messageId }` — read message data with the `useMessage()` hook. Passing `null` hides actions entirely, even when `extraActions` are provided.
- The standalone `ChatMessageActions` component (custom layouts) exposes an `actions` slot whose slot props callback receives the message [owner state](#owner-state).
  :::

{{"demo": "BasicMessageActions.js", "defaultCodeOpen": false, "bg": "inline"}}

### Accessing message context

The component you pass to the `messageActions` slot receives a `messageId` prop. Pass it to the `useMessage()` hook (exported from `@mui/x-chat/headless`) to read the current message and show different actions for user and assistant messages.
Reach the runtime actions with [`useChatActions()`](/x/react-chat/core/hooks/)—it returns `sendMessage`, `retry`, `regenerate`, and the rest without subscribing to message state, so the toolbar does not re-render while a response streams:

{{"demo": "RoleBasedMessageActions.js", "defaultCodeOpen": false, "bg": "inline"}}

## Adding actions declaratively

Instead of replacing the `messageActions` slot component, pass a function to `slotProps.messageActions` and return `extraActions`.
The function receives the message context, so you can target specific rows—for example, a working "Regenerate" button on assistant replies.
Each action's `onClick` receives `(event, { message, chat })`; call `chat.regenerate(message.id)` to request a fresh reply through the runtime:

{{"demo": "ExtraActionsMessageActions.js", "defaultCodeOpen": false, "bg": "inline"}}

## Owner state

The standalone `ChatMessageActions` component forwards the message context as owner state to its `actions` slot, so slot components can style themselves conditionally (when using the ChatBox `messageActions` slot, read the same data with `useMessage(messageId)` instead):

| Property         | Type                             | Description                                                                     |
| :--------------- | :------------------------------- | :------------------------------------------------------------------------------ |
| `messageId`      | `string`                         | ID of the current message                                                       |
| `message`        | `ChatMessage \| null`            | The full message object, or `null` if not found                                 |
| `role`           | `ChatRole \| undefined`          | Role of the message author (`undefined` until resolved)                         |
| `status`         | `ChatMessageStatus \| undefined` | Current status of the message (`undefined` until resolved)                      |
| `streaming`      | `boolean`                        | Whether the message is streaming                                                |
| `error`          | `boolean`                        | Whether the message is in an error state                                        |
| `isGrouped`      | `boolean`                        | Whether the message is in a group                                               |
| `variant`        | `ChatVariant`                    | Current chrome variant                                                          |
| `density`        | `ChatDensity`                    | Current chrome density                                                          |
| `resolvedAuthor` | `ResolvedMessageAuthor \| null`  | Resolved author display data                                                    |
| `showAvatar`     | `boolean`                        | Whether an avatar column is rendered                                            |
| `isOwnMessage`   | `boolean`                        | Whether the message belongs to the current user (controls right-side alignment) |

## Slots

| Slot      | Default element | Description              |
| :-------- | :-------------- | :----------------------- |
| `actions` | `div`           | The action bar container |

## See also

- [Message appearance](/x/react-chat/display/message-appearance/) for the overall message layout and visual presentation
- [Message list—Accessibility](/x/react-chat/material/message-list/#accessibility) for the keyboard navigation model that reveals the action bar (<kbd>Enter</kbd> to drill in, <kbd>Escape</kbd> to leave)
