---
productId: x-chat
title: Slots & Composition
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Slots & Composition

<p class="description">Replace individual subcomponents inside ChatBox with your own implementations using the <code>slots</code> and <code>slotProps</code> API.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatBox` composes many themed subcomponents internally — message bubbles, the composer, the conversation list, date dividers, and more.
The `slots` prop lets you swap any of them with your own component, while `slotProps` passes extra props to those components without replacing them.

## Basic replacement

Pass a custom component to a named slot.
Your component receives the same props that the default component would receive:

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

<ChatBox slots={{ messageContent: CustomMessageContent }} />;
```

## Passing extra props with `slotProps`

Use `slotProps` to pass additional props to either the default or a custom slot component without replacing them:

```tsx
<ChatBox
  slotProps={{
    conversationList: { 'aria-label': 'Chat threads' },
    composerInput: { placeholder: 'Ask anything…' },
    composerSendButton: { sx: { borderRadius: 6 } },
  }}
/>
```

## Complete slot reference

### Layout slots

| Slot name           | Default component | Element | Description                                |
| :------------------ | :---------------- | :------ | :----------------------------------------- |
| `root`              | `div`             | `<div>` | Outermost container                        |
| `layout`            | `div`             | `<div>` | Arranges conversation + thread panes       |
| `conversationsPane` | `div`             | `<div>` | Conversations sidebar container            |
| `threadPane`        | `div`             | `<div>` | Thread (message list + composer) container |

### Conversation slots

| Slot name                   | Default component               | Element    | Description                          |
| :-------------------------- | :------------------------------ | :--------- | :----------------------------------- |
| `conversationRoot`          | `ChatConversation`              | `<div>`    | Thread shell (wrapper-only)          |
| `conversationList`          | `ChatConversationList`          | `<div>`    | Conversation list                    |
| `conversationHeader`        | `ChatConversationHeader`        | `<header>` | Header bar above the message list    |
| `conversationHeaderInfo`    | `ChatConversationHeaderInfo`    | `<div>`    | Title + subtitle group in the header |
| `conversationTitle`         | `ChatConversationTitle`         | `<div>`    | Conversation name                    |
| `conversationSubtitle`      | `ChatConversationSubtitle`      | `<div>`    | Secondary line (participants, etc.)  |
| `conversationHeaderActions` | `ChatConversationHeaderActions` | `<div>`    | Action buttons in the header         |

### Message list slots

| Slot name           | Default component       | Element  | Description                           |
| :------------------ | :---------------------- | :------- | :------------------------------------ |
| `messageList`       | `ChatMessageList`       | `<div>`  | Scrollable message container          |
| `messageGroup`      | `ChatMessageGroup`      | `<div>`  | Same-author message group             |
| `messageRoot`       | `ChatMessage`           | `<div>`  | Individual message row (wrapper-only) |
| `messageAvatar`     | `ChatMessageAvatar`     | `<div>`  | Author avatar                         |
| `messageContent`    | `ChatMessageContent`    | `<div>`  | Message bubble                        |
| `messageMeta`       | `ChatMessageMeta`       | `<div>`  | Timestamp (compact variant)           |
| `messageInlineMeta` | `ChatMessageInlineMeta` | `<span>` | Inline timestamp inside the bubble    |
| `messageError`      | `ChatMessageError`      | `<div>`  | Error card under a failed message     |
| `messageActions`    | `ChatMessageActions`    | `<div>`  | Hover action menu                     |
| `messageAuthorName` | —                       | `<div>`  | Author name label above the group     |
| `dateDivider`       | `ChatDateDivider`       | `<div>`  | Date separator between groups (requires `features.dateDivider`) |

### Composer slots

| Slot name                | Default component            | Element      | Description                       |
| :----------------------- | :--------------------------- | :----------- | :-------------------------------- |
| `composerRoot`           | `ChatComposer`               | `<form>`     | Composer container (wrapper-only) |
| `composerInput`          | `ChatComposerTextArea`       | `<textarea>` | Auto-resizing text area           |
| `composerSendButton`     | `ChatComposerSendButton`     | `<button>`   | Submit button                     |
| `composerAttachButton`   | `ChatComposerAttachButton`   | `<button>`   | File attach trigger               |
| `composerAttachmentList` | `ChatComposerAttachmentList` | `<div>`      | Pending-attachment preview row    |
| `composerToolbar`        | `ChatComposerToolbar`        | `<div>`      | Button row                        |
| `composerHelperText`     | `ChatComposerHelperText`     | `<div>`      | Disclaimer or hint                |

### Indicator slots

| Slot name         | Default component              | Element    | Description                            |
| :---------------- | :----------------------------- | :--------- | :------------------------------------- |
| `typingIndicator` | `ChatTypingIndicator`          | `<div>`    | Animated dots while assistant responds |
| `unreadMarker`    | `ChatUnreadMarker`             | `<div>`    | "New messages" marker (requires `features.unreadMarker`) |
| `scrollToBottom`  | `ChatScrollToBottomAffordance` | `<button>` | Floating scroll-to-bottom button       |
| `suggestions`     | `ChatSuggestions`              | `<div>`    | Prompt suggestion chips                |

:::warning
**Two things to know about the slot names:**

- **Standalone components use short keys.** The flat, prefixed names above (for example, `messageAvatar`, `composerSendButton`) apply to `ChatBox`. When you render a leaf component directly, it uses its own short keys — `<ChatMessage slots={{ avatar: MyAvatar }} />`, not `messageAvatar`.
- **`*Root` slots are wrapper-only.** `conversationRoot`, `messageRoot`, and `composerRoot` swap the styled root element while the default children still render inside. To replace a region entirely, compose it yourself with the headless hooks.

The `dateDivider` and `unreadMarker` slots are opt-in: `ChatBox` only renders them when the matching `features.dateDivider` / `features.unreadMarker` flag is enabled. The `typingIndicator` slot is surfaced for standalone composition but is not rendered by `ChatBox`'s default layout—render the standalone component in a custom layout with `ChatProvider`.
:::

## Hiding a slot

Return `null` from a slot to remove it entirely, or use the `features` prop for common show/hide needs:

{{"demo": "FeatureFlags.js", "defaultCodeOpen": false, "bg": "inline"}}

## Feature flags and slot rendering

When a feature flag is set to `false`, the corresponding slot is **not rendered at all** — even if you provide a custom component via `slots`. The feature flag takes precedence:

```tsx
{/* The custom button does not render because the feature is disabled */}
<ChatBox
  adapter={adapter}
  features={{ attachments: false }}
  slots={{ composerAttachButton: MyCustomButton }}  {/* ignored */}
/>
```

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

To conditionally show a custom component, keep the feature flag enabled and handle visibility in your slot component instead.

Most feature flags default to `true`. The opt-in flags — `conversationList`, `dateDivider`, and `unreadMarker` — default to `false`, so their slots render only after you enable them.

## `slotProps` reference

| Key                         | Type                                          | Description                    |
| :-------------------------- | :-------------------------------------------- | :----------------------------- |
| `root`                      | `SlotComponentProps<'div'>`                   | Outermost div                  |
| `layout`                    | `SlotComponentProps<'div'>`                   | Layout div                     |
| `conversationsPane`         | `SlotComponentProps<'div'>`                   | Conversations pane div         |
| `threadPane`                | `SlotComponentProps<'div'>`                   | Thread pane div                |
| `conversationRoot`          | `Partial<ChatConversationProps>`              | Thread shell (wrapper-only)    |
| `conversationList`          | `Partial<ChatConversationListProps>`          | Conversation list              |
| `conversationHeader`        | `Partial<ChatConversationHeaderProps>`        | Thread header                  |
| `conversationHeaderInfo`    | `Partial<ChatConversationHeaderInfoProps>`    | Title + subtitle group         |
| `conversationTitle`         | `Partial<ChatConversationTitleProps>`         | Thread title                   |
| `conversationSubtitle`      | `Partial<ChatConversationSubtitleProps>`      | Thread subtitle                |
| `conversationHeaderActions` | `Partial<ChatConversationHeaderActionsProps>` | Header action area             |
| `messageList`               | `Partial<ChatMessageListProps>`               | Message list                   |
| `messageGroup`              | `Partial<ChatMessageGroupProps>`              | Message group container        |
| `messageRoot`               | `Partial<ChatMessageProps>`                   | Each message container         |
| `messageAvatar`             | `Partial<ChatMessageAvatarProps>`             | Message avatar                 |
| `messageContent`            | `Partial<ChatMessageContentProps>`            | Message content/bubble         |
| `messageMeta`               | `Partial<ChatMessageMetaProps>`               | Message timestamp (compact)    |
| `messageInlineMeta`         | `Record<string, unknown>`                     | Inline timestamp in the bubble |
| `messageError`              | `Partial<ChatMessageErrorProps>`              | Error card                     |
| `messageActions`            | `Partial<ChatMessageActionsProps>`            | Message action menu            |
| `messageAuthorName`         | `Record<string, unknown>`                     | Author name label              |
| `dateDivider`               | `Partial<ChatDateDividerProps>`               | Date separator                 |
| `composerRoot`              | `Partial<ChatComposerProps>`                  | Composer form root             |
| `composerInput`             | `Partial<ChatComposerTextAreaProps>`          | Composer textarea              |
| `composerSendButton`        | `Partial<ChatComposerSendButtonProps>`        | Send button                    |
| `composerAttachButton`      | `Partial<ChatComposerAttachButtonProps>`      | Attach button                  |
| `composerAttachmentList`    | `Partial<ChatComposerAttachmentListProps>`    | Attachment preview row         |
| `composerToolbar`           | `Partial<ChatComposerToolbarProps>`           | Toolbar container              |
| `composerHelperText`        | `Partial<ChatComposerHelperTextProps>`        | Helper text below input        |
| `typingIndicator`           | `Partial<ChatTypingIndicatorProps>`           | Typing indicator               |
| `unreadMarker`              | `Partial<ChatUnreadMarkerProps>`              | Unread marker                  |
| `scrollToBottom`            | `Partial<ChatScrollToBottomAffordanceProps>`  | Scroll to bottom button        |
| `suggestions`               | `Partial<ChatSuggestionsProps>`               | Prompt suggestions             |
| `emptyState`                | `SlotComponentProps<'div'>`                   | Custom empty state             |

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
const MyMessageContent: ChatBoxSlots['messageContent'] = (props) => {
  return <div className="custom-bubble" {...props} />;
};

// Type-safe slotProps
const mySlotProps: ChatBoxSlotProps = {
  composerInput: { placeholder: 'Type here…' },
  messageList: { sx: { p: 2 } },
};
```

## Combining slots with theme overrides

Slots replace the component entirely, while theme `styleOverrides` adjust the default component's styles.
You can use both together — for example, swap the message content component via a slot while applying global border-radius tweaks through the theme.

## See also

- [Styling](/x/react-chat/customization/styling/) for `sx` prop, theme overrides, and dark mode.
