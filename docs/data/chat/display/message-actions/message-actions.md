---
productId: x-chat
title: Message Actions
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageActions
---

# Chat - Message Actions

<p class="description">Add hover-triggered action buttons to messages for copy, edit, delete, and custom operations.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

`ChatMessageActions` renders an action bar that appears when the user hovers over a message or focuses within it. The actions area is positioned in the message grid and transitions from hidden to visible using an opacity animation.

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

The transition uses a short opacity animation. When the user prefers reduced motion, the transition is disabled.

```css
/* Visibility is controlled by the parent message's hover/focus state */
.MuiChatMessage-root:hover .MuiChatMessage-actions,
.MuiChatMessage-root:focus-within .MuiChatMessage-actions {
  opacity: 1;
}
```

## Component anatomy

`ChatMessageActions` is a styled wrapper around the unstyled `MessageActions` primitive. It occupies the `actions` grid area in the message row layout:

```text
ChatMessage (grid)
  ├── ChatMessageAvatar    → grid-area: avatar
  ├── ChatMessageContent   → grid-area: content
  ├── ChatMessageMeta      → grid-area: meta
  └── ChatMessageActions   → grid-area: actions
```

## Adding custom actions

The `MessageActions` primitive renders a `<div>` (or custom slot element) that you populate with your own action buttons. Override the actions slot through `ChatBox`:

```tsx
function MyMessageActions(props) {
  return (
    <div {...props}>
      <button onClick={handleCopy}>Copy</button>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

<ChatBox
  adapter={adapter}
  slots={{
    messageActions: MyMessageActions,
  }}
/>
```

### Accessing message context

Inside a custom actions component, use the message context to access the current message data:

```tsx
import { useMessageContext } from '@mui/x-chat/unstyled';

function MyMessageActions(props) {
  const { message, role } = useMessageContext();

  return (
    <div {...props}>
      <CopyButton text={message?.parts.map(p => p.type === 'text' ? p.text : '').join('')} />
      {role === 'user' && <EditButton messageId={message?.id} />}
    </div>
  );
}
```

### Conditional visibility by role

Show different actions for user and assistant messages:

```tsx
function MyMessageActions(props) {
  const { role } = useMessageContext();

  return (
    <div {...props}>
      <CopyButton />
      {role === 'assistant' && <RegenerateButton />}
      {role === 'user' && <EditButton />}
    </div>
  );
}
```

## Owner state

The `MessageActions` component receives the message context as owner state, which slot components can use for conditional styling:

| Property    | Type            | Description                            |
| :---------- | :-------------- | :------------------------------------- |
| `messageId` | `string`        | ID of the current message              |
| `role`      | `ChatRole`      | Role of the message author             |
| `status`    | `ChatMessageStatus` | Current status of the message      |
| `streaming` | `boolean`       | Whether the message is streaming       |
| `isGrouped` | `boolean`       | Whether the message is in a group      |

## Slots

| Slot      | Default element | Description              |
| :-------- | :-------------- | :----------------------- |
| `actions` | `div`           | The action bar container |

## API

- [`ChatMessageActions`](/x/api/chat/chat-message-actions/)

## See also

- [Message Appearance](/x/react-chat/display/message-appearance/) for the overall message layout and visual presentation
- [Unstyled messages](/x/react-chat/customization/unstyled/) for the full primitive set and composition patterns
