---
productId: x-chat
title: Slots and composition
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Slots and composition

<p class="description">Swap individual <code>ChatBox</code> subcomponents using the <code>slots</code> and <code>slotProps</code> APIs.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatBox` composes many themed subcomponents internally—message bubbles, the composer, the conversation list, date dividers, and more.
The `slots` prop lets you swap any of them with your own component, while `slotProps` passes extra props to those components without replacing them.

## Replacing a slot

Pass a custom component to a named slot.
The custom component receives the same props as the default:

```tsx
const CustomMessageContent = React.forwardRef(
  function CustomMessageContent(props, ref) {
    return (
      <ChatMessageContent
        ref={ref}
        {...props}
        slots={{ ...props.slots, bubble: MyBubble }}
      />
    );
  },
);

<ChatBox slots={{ content: CustomMessageContent }} />;
```

## Passing extra props with `slotProps`

Use `slotProps` to pass additional props to either the default or a custom slot component without replacing them:

```tsx
<ChatBox
  slotProps={{
    conversationList: { 'aria-label': 'Chat threads' },
    input: { placeholder: 'Ask anything...' },
    send: { sx: { borderRadius: 6 } },
  }}
/>
```

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

| Slot name        | Default component    | Element | Description                   |
| :--------------- | :------------------- | :------ | :---------------------------- |
| `messageList`    | `ChatMessageList`    | `<div>` | Scrollable message container  |
| `message`    | `ChatMessage`        | `<div>` | Individual message row        |
| `avatar`  | `ChatMessageAvatar`  | `<div>` | Author avatar                 |
| `content` | `ChatMessageContent` | `<div>` | Message bubble                |
| `meta`    | `ChatMessageMeta`    | `<div>` | Timestamp and delivery status |
| `actions` | `ChatMessageActions` | `<div>` | Hover action menu             |
| `group`   | `ChatMessageGroup`   | `<div>` | Same-author message group     |
| `dateDivider`    | `ChatDateDivider`    | `<div>` | Date separator between groups |

### Composer slots

| Slot name              | Default component          | Element      | Description             |
| :--------------------- | :------------------------- | :----------- | :---------------------- |
| `composer`         | `ChatComposer`             | `<form>`     | Composer container      |
| `input`        | `ChatComposerTextArea`     | `<textarea>` | Auto-resizing text area |
| `send`   | `ChatComposerSendButton`   | `<button>`   | Submit button           |
| `attach` | `ChatComposerAttachButton` | `<button>`   | File attach trigger     |
| `toolbar`      | `ChatComposerToolbar`      | `<div>`      | Button row              |
| `helperText`   | `ChatComposerHelperText`   | `<div>`      | Disclaimer or hint      |

### Indicator slots

| Slot name         | Default component              | Element    | Description                            |
| :---------------- | :----------------------------- | :--------- | :------------------------------------- |
| `typingIndicator` | `ChatTypingIndicator`          | `<div>`    | Animated dots while assistant responds |
| `unreadMarker`    | `ChatUnreadMarker`             | `<div>`    | "New messages" marker                  |
| `scrollToBottom`  | `ChatScrollToBottomAffordance` | `<button>` | Floating scroll-to-bottom button       |
| `suggestions`     | `ChatSuggestions`              | `<div>`    | Prompt suggestion chips                |

:::info
The `typingIndicator`, `unreadMarker`, and `actions` slots are defined in the type interface but are not yet consumed by `ChatBox`'s internal composition.
To customize them, use the standalone components in a custom layout with `ChatProvider`.
:::

## Hiding a slot

Return `null` from a slot to remove it entirely, or use the `features` prop for common show/hide needs:

{{"demo": "FeatureFlags.js", "defaultCodeOpen": false, "bg": "inline"}}

## Interaction with the `features` prop

When a feature flag is set to `false`, the corresponding slot is **not rendered at all**—even if you provide a custom component via `slots`.
The feature flag takes precedence:

```tsx
{/* The custom button does not render because the feature is disabled */}
<ChatBox
  adapter={adapter}
  features={{ attachments: false }}
  slots={{ attach: MyCustomButton }}  {/* ignored */}
/>
```

The `autoScroll` feature flag controls scroll behavior rather than slot visibility:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    conversationList: true, // opt into the built-in sidebar / drawer
    autoScroll: { buffer: 300 }, // Custom threshold (default: 150px)
    // autoScroll: false,        // Disable auto-scrolling entirely
  }}
/>
```

To conditionally show a custom component, keep the feature flag enabled and handle visibility in your slot component instead.

## `slotProps` reference

| Key                    | Type                                         | Description             |
| :--------------------- | :------------------------------------------- | :---------------------- |
| `root`                 | `SlotComponentProps<'div'>`                  | Outermost div           |
| `layout`               | `SlotComponentProps<'div'>`                  | Layout div              |
| `conversationsPane`    | `SlotComponentProps<'div'>`                  | Conversations pane div  |
| `threadPane`           | `SlotComponentProps<'div'>`                  | Thread pane div         |
| `conversationList`     | `Partial<ChatConversationListProps>`         | Conversation list       |
| `conversationHeader`   | `Partial<ChatConversationHeaderProps>`       | Thread header           |
| `conversationTitle`    | `Partial<ChatConversationTitleProps>`        | Thread title            |
| `conversationSubtitle` | `Partial<ChatConversationSubtitleProps>`     | Thread subtitle         |
| `messageList`          | `Partial<ChatMessageListProps>`              | Message list            |
| `message`          | `Partial<ChatMessageProps>`                  | Each message container  |
| `avatar`        | `Partial<ChatMessageAvatarProps>`            | Message avatar          |
| `content`       | `Partial<ChatMessageContentProps>`           | Message content/bubble  |
| `meta`          | `Partial<ChatMessageMetaProps>`              | Message timestamp       |
| `actions`       | `Partial<ChatMessageActionsProps>`           | Message action menu     |
| `group`         | `Partial<ChatMessageGroupProps>`             | Message group container |
| `dateDivider`          | `Partial<ChatDateDividerProps>`              | Date separator          |
| `composer`         | `Partial<ChatComposerProps>`                 | Composer form root      |
| `input`        | `Partial<ChatComposerTextAreaProps>`         | Composer textarea       |
| `send`   | `Partial<ChatComposerSendButtonProps>`       | Send button             |
| `attach` | `Partial<ChatComposerAttachButtonProps>`     | Attach button           |
| `toolbar`      | `Partial<ChatComposerToolbarProps>`          | Toolbar container       |
| `helperText`   | `Partial<ChatComposerHelperTextProps>`       | Helper text below input |
| `typingIndicator`      | `Partial<ChatTypingIndicatorProps>`          | Typing indicator        |
| `unreadMarker`         | `Partial<ChatUnreadMarkerProps>`             | Unread marker           |
| `scrollToBottom`       | `Partial<ChatScrollToBottomAffordanceProps>` | Scroll to bottom button |

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
You can use both together—for example, swap the message content component via a slot while applying global border-radius tweaks through the theme.

## See also

- See [Styling](/x/react-chat/customization/styling/) for details on the `sx` prop, theme overrides, and dark mode.
