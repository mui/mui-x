---
productId: x-chat
title: Chat - Slot overrides
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatRoot
---

# Chat - Slot overrides

<p class="description">Replace individual subcomponents inside <code>ChatBox</code> with custom implementations using the <code>slots</code> and <code>slotProps</code> APIs.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatBox` composes many themed subcomponents internally—message bubbles, the composer, the conversation list, date dividers, and more.
The `slots` prop lets you swap any of them with your own component, while `slotProps` passes extra props to those components without replacing them.

## Replacing a slot with a custom component

Pass a custom component to a named slot.
The custom component receives the same props as the default:

{{"demo": "SlotBasicReplacement.js", "defaultCodeOpen": false, "bg": "inline"}}

## Passing extra props with `slotProps`

Use `slotProps` to pass additional props to either the default or a custom slot component without replacing them:

{{"demo": "SlotPropsCustomization.js", "defaultCodeOpen": false, "bg": "inline"}}

## Slot reference

### Layout slots

| Slot name           | Default component | Element | Description                                |
| :------------------ | :---------------- | :------ | :----------------------------------------- |
| `root`              | `div`             | `<div>` | Outermost container                        |
| `layout`            | `div`             | `<div>` | Arranges conversation + thread panes       |
| `conversationsPane` | `div`             | `<div>` | Conversations sidebar container            |
| `threadPane`        | `div`             | `<div>` | Thread (message list + composer) container |

### Conversation slots

| Slot name                   | Default component               | Element    | Description                         |
| :-------------------------- | :------------------------------ | :--------- | :---------------------------------- |
| `conversationList`          | `ChatConversationList`          | `<div>`    | Conversation list                   |
| `conversationHeader`        | `ChatConversationHeader`        | `<header>` | Header bar above the message list   |
| `conversationTitle`         | `ChatConversationTitle`         | `<div>`    | Conversation name                   |
| `conversationSubtitle`      | `ChatConversationSubtitle`      | `<div>`    | Secondary line (participants, etc.) |
| `conversationHeaderActions` | `ChatConversationHeaderActions` | `<div>`    | Action buttons in the header        |

### Message list slots

| Slot name     | Default component    | Element | Description                   |
| :------------ | :------------------- | :------ | :---------------------------- |
| `messageList` | `ChatMessageList`    | `<div>` | Scrollable message container  |
| `message`     | `ChatMessage`        | `<div>` | Individual message row        |
| `avatar`      | `ChatMessageAvatar`  | `<div>` | Author avatar                 |
| `content`     | `ChatMessageContent` | `<div>` | Message bubble                |
| `meta`        | `ChatMessageMeta`    | `<div>` | Timestamp and delivery status |
| `actions`     | `ChatMessageActions` | `<div>` | Hover action menu             |
| `group`       | `ChatMessageGroup`   | `<div>` | Same-author message group     |
| `dateDivider` | `ChatDateDivider`    | `<div>` | Date separator between groups |

### Composer slots

| Slot name    | Default component          | Element      | Description             |
| :----------- | :------------------------- | :----------- | :---------------------- |
| `composer`   | `ChatComposer`             | `<form>`     | Composer container      |
| `input`      | `ChatComposerTextArea`     | `<textarea>` | Auto-resizing text area |
| `send`       | `ChatComposerSendButton`   | `<button>`   | Submit button           |
| `attach`     | `ChatComposerAttachButton` | `<button>`   | File attach trigger     |
| `toolbar`    | `ChatComposerToolbar`      | `<div>`      | Button row              |
| `helperText` | `ChatComposerHelperText`   | `<div>`      | Disclaimer or hint      |

### Indicator slots

| Slot name         | Default component              | Element    | Description                            |
| :---------------- | :----------------------------- | :--------- | :------------------------------------- |
| `typingIndicator` | `ChatTypingIndicator`          | `<div>`    | Animated dots while assistant responds |
| `unreadMarker`    | `ChatUnreadMarker`             | `<div>`    | "New messages" marker                  |
| `scrollToBottom`  | `ChatScrollToBottomAffordance` | `<button>` | Floating scroll-to-bottom button       |
| `suggestions`     | `ChatSuggestions`              | `<div>`    | Prompt suggestion chips                |

:::info
The `typingIndicator`, `unreadMarker`, and `actions` slots are defined in the type interface but are not currently consumed by the `ChatBox` internal composition. To customize these, use the standalone components directly in a custom layout with `ChatProvider`.
:::

## Hiding a slot

Return `null` from a slot to remove it entirely:

```tsx
<ChatBox
  adapter={adapter}
  slots={{
    conversationHeader: () => null,
    attach: () => null,
    suggestions: () => null,
  }}
/>
```

For common show/hide needs, use the `features` prop instead:

{{"demo": "FeatureFlags.js", "defaultCodeOpen": false, "bg": "inline"}}

The `autoScroll` feature flag controls scroll behavior rather than slot visibility:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    autoScroll: { buffer: 300 }, // Custom threshold (default: 150px)
    // autoScroll: false,        // Disable auto-scrolling entirely
  }}
/>
```

## Feature flags and slot rendering

When a feature flag is set to `false`, the corresponding slot is **not rendered at all**—even if you provide a custom component via `slots`. The feature flag takes precedence:

```tsx
{/* The custom button does not render because the feature is disabled */}
<ChatBox
  adapter={adapter}
  features={{ attachments: false }}
  slots={{ attach: MyCustomButton }}  {/* ignored */}
/>
```

To conditionally show a custom component, keep the feature flag enabled and handle visibility inside the slot component instead.

## CSS classes

The `chatBoxClasses` utility object provides class name constants for CSS targeting:

```tsx
import { chatBoxClasses } from '@mui/x-chat';

// Available: chatBoxClasses.root, chatBoxClasses.layout,
//            chatBoxClasses.conversationsPane, chatBoxClasses.threadPane
```

## TypeScript

Import the slot types for type-safe custom components:

```tsx
import type { ChatBoxSlots, ChatBoxSlotProps } from '@mui/x-chat';

// Your custom slot component receives the same props as the default
const MyMessageContent: ChatBoxSlots['content'] = (props) => {
  return <div className="custom-bubble" {...props} />;
};

// Type-safe slotProps
const mySlotProps: ChatBoxSlotProps = {
  input: { placeholder: 'Type here...' },
  messageList: { sx: { p: 2 } },
};
```

## Combining slots with theme overrides

Slots replace the component entirely, while theme `styleOverrides` adjust the default component's styles.
Use both together:

{{"demo": "ThemeAndSlotCombination.js", "defaultCodeOpen": false, "bg": "inline"}}

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
