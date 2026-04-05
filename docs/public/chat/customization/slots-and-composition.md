---
productId: x-chat
title: Slots & Composition
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Slots & Composition

<p class="description">Replace individual sub-components inside ChatBox with your own implementations using the <code>slots</code> and <code>slotProps</code> API.</p>



`ChatBox` composes many themed sub-components internally — message bubbles, the composer, the conversation list, date dividers, and more.
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
    composerInput: { placeholder: 'Ask anything...' },
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
| `messageRoot`    | `ChatMessage`        | `<div>` | Individual message row        |
| `messageAvatar`  | `ChatMessageAvatar`  | `<div>` | Author avatar                 |
| `messageContent` | `ChatMessageContent` | `<div>` | Message bubble                |
| `messageMeta`    | `ChatMessageMeta`    | `<div>` | Timestamp and delivery status |
| `messageActions` | `ChatMessageActions` | `<div>` | Hover action menu             |
| `messageGroup`   | `ChatMessageGroup`   | `<div>` | Same-author message group     |
| `dateDivider`    | `ChatDateDivider`    | `<div>` | Date separator between groups |

### Composer slots

| Slot name              | Default component          | Element      | Description             |
| :--------------------- | :------------------------- | :----------- | :---------------------- |
| `composerRoot`         | `ChatComposer`             | `<form>`     | Composer container      |
| `composerInput`        | `ChatComposerTextArea`     | `<textarea>` | Auto-resizing text area |
| `composerSendButton`   | `ChatComposerSendButton`   | `<button>`   | Submit button           |
| `composerAttachButton` | `ChatComposerAttachButton` | `<button>`   | File attach trigger     |
| `composerToolbar`      | `ChatComposerToolbar`      | `<div>`      | Button row              |
| `composerHelperText`   | `ChatComposerHelperText`   | `<div>`      | Disclaimer or hint      |

### Indicator slots

| Slot name         | Default component              | Element    | Description                            |
| :---------------- | :----------------------------- | :--------- | :------------------------------------- |
| `typingIndicator` | `ChatTypingIndicator`          | `<div>`    | Animated dots while assistant responds |
| `unreadMarker`    | `ChatUnreadMarker`             | `<div>`    | "New messages" marker                  |
| `scrollToBottom`  | `ChatScrollToBottomAffordance` | `<button>` | Floating scroll-to-bottom button       |
| `suggestions`     | `ChatSuggestions`              | `<div>`    | Prompt suggestion chips                |

:::info
The `typingIndicator`, `unreadMarker`, and `messageActions` slots are defined in the type interface but are not currently consumed by `ChatBox`'s internal composition. To customize these, use the standalone components directly in a custom layout with `ChatProvider`.
:::

## Hiding a slot

Return `null` from a slot to remove it entirely, or use the `features` prop for common show/hide needs:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function FeatureFlags() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      features={{
        conversations: false,
        attachments: false,
      }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

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
| `messageRoot`          | `Partial<ChatMessageProps>`                  | Each message container  |
| `messageAvatar`        | `Partial<ChatMessageAvatarProps>`            | Message avatar          |
| `messageContent`       | `Partial<ChatMessageContentProps>`           | Message content/bubble  |
| `messageMeta`          | `Partial<ChatMessageMetaProps>`              | Message timestamp       |
| `messageActions`       | `Partial<ChatMessageActionsProps>`           | Message action menu     |
| `messageGroup`         | `Partial<ChatMessageGroupProps>`             | Message group container |
| `dateDivider`          | `Partial<ChatDateDividerProps>`              | Date separator          |
| `composerRoot`         | `Partial<ChatComposerProps>`                 | Composer form root      |
| `composerInput`        | `Partial<ChatComposerTextAreaProps>`         | Composer textarea       |
| `composerSendButton`   | `Partial<ChatComposerSendButtonProps>`       | Send button             |
| `composerAttachButton` | `Partial<ChatComposerAttachButtonProps>`     | Attach button           |
| `composerToolbar`      | `Partial<ChatComposerToolbarProps>`          | Toolbar container       |
| `composerHelperText`   | `Partial<ChatComposerHelperTextProps>`       | Helper text below input |
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
const MyMessageContent: ChatBoxSlots['messageContent'] = (props) => {
  return <div className="custom-bubble" {...props} />;
};

// Type-safe slotProps
const mySlotProps: ChatBoxSlotProps = {
  composerInput: { placeholder: 'Type here...' },
  messageList: { sx: { p: 2 } },
};
```

## Combining slots with theme overrides

Slots replace the component entirely, while theme `styleOverrides` adjust the default component's styles.
You can use both together — for example, swap the message content component via a slot while applying global border-radius tweaks through the theme.

## See also

- [Styling](/x/react-chat/customization/styling/) for `sx` prop, theme overrides, and dark mode.

## API
