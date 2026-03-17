---
productId: x-chat
title: Chat - Slots
packageName: '@mui/x-chat'
---

# Slots

<p class="description">Every region of the chat surface can be replaced or customized through <code>slots</code> and <code>slotProps</code>.</p>

## How slots work

All styled chat components expose `slots` and `slotProps` props.
A slot replaces the rendered element for a specific region, while `slotProps` passes additional props to slots without replacing them.

```tsx
<ChatBox
  slots={{ messageContent: CustomBubble }}
  slotProps={{ composerInput: { rows: 1 } }}
/>
```

## ChatBox mirrored slots

`ChatBox` mirrors slots from its child components so you can customize deeply without breaking down to manual composition.

{{"demo": "SlotCustomization.js"}}

### Conversations region

| Slot                        | Description                 |
| :-------------------------- | :-------------------------- |
| `conversationsRoot`         | Conversation list container |
| `conversationItem`          | Individual conversation row |
| `conversationItemAvatar`    | Avatar in conversation item |
| `conversationTitle`         | Title text                  |
| `conversationPreview`       | Subtitle/preview text       |
| `conversationTimestamp`     | Relative time               |
| `conversationUnreadBadge`   | Unread count badge          |
| `conversationsLoadingState` | Loading placeholder         |
| `conversationsEmptyState`   | Empty state                 |
| `conversationsErrorState`   | Error state                 |

### Thread region

| Slot                 | Description                 |
| :------------------- | :-------------------------- |
| `threadRoot`         | Thread container            |
| `threadHeader`       | Thread header bar           |
| `threadTitle`        | Thread title text           |
| `threadSubtitle`     | Thread subtitle             |
| `threadActions`      | Thread header actions       |
| `threadLoadingState` | Thread loading state        |
| `threadEmptyState`   | Thread empty state          |
| `threadErrorState`   | Thread error state          |
| `historyLoading`     | History load-more indicator |
| `messageList`        | Message list container      |

### Message region

| Slot                       | Description                  |
| :------------------------- | :--------------------------- |
| `messageGroup`             | Message group wrapper        |
| `messageRoot`              | Individual message container |
| `messageAvatar`            | Message author avatar        |
| `messageContent`           | Message bubble content       |
| `messageBubble`            | Bubble element               |
| `messageMeta`              | Timestamp and status         |
| `messageTimestamp`         | Timestamp text               |
| `messageStatus`            | Status indicator             |
| `messageActions`           | Action buttons               |
| `dateDivider`              | Date separator               |
| `unreadMarker`             | Unread boundary              |
| `typingIndicator`          | Typing dots                  |
| `scrollToBottomAffordance` | Scroll FAB                   |

### Composer region

| Slot                   | Description       |
| :--------------------- | :---------------- |
| `composerRoot`         | Composer form     |
| `composerInput`        | Input textarea    |
| `composerSendButton`   | Send button       |
| `composerAttachButton` | Attach trigger    |
| `composerToolbar`      | Toolbar row       |
| `composerHelperText`   | Status/error text |

## Owner state

Custom slot components receive `ownerState` with runtime values for conditional styling:

{{"demo": "OwnerStateDemo.js"}}

Common owner state values:

- `role` — `'user'` | `'assistant'` | `'system'`
- `status` — `'pending'` | `'sending'` | `'streaming'` | `'sent'` | `'error'`
- `isGrouped` — whether the message is in a visual group
- `hasValue` — whether the composer has draft text
- `isSubmitting` — whether a send is in progress
- `selected` — whether a conversation is active
- `unread` — whether a conversation has unread messages

## Adjacent pages

- See [Unstyled customization](/x/react-chat/unstyled/customization/) for the structural slot model.
- See [Theming](/x/react-chat/material/theming/) for theme-level visual customization.
