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

<ChatBox slots={{ message: { content: CustomMessageContent } }} />;
```

## Passing extra props with `slotProps`

Use `slotProps` to pass additional props to either the default or a custom slot component without replacing them:

```tsx
<ChatBox
  slotProps={{
    conversation: {
      list: { 'aria-label': 'Chat threads' },
    },
    composer: {
      input: { placeholder: 'Ask anything...' },
      send: { sx: { borderRadius: 6 } },
    },
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

### Conversation slots (`conversation.*`)

| Slot name                     | Default component               | Element    | Description                         |
| :---------------------------- | :------------------------------ | :--------- | :---------------------------------- |
| `conversation.root`           | `ChatConversation`              | `<div>`    | Thread wrapper element              |
| `conversation.list`           | `ChatConversationList`          | `<div>`    | Conversation list                   |
| `conversation.header`         | `ChatConversationHeader`        | `<header>` | Header bar above the message list   |
| `conversation.title`          | `ChatConversationTitle`         | `<div>`    | Conversation name                   |
| `conversation.subtitle`       | `ChatConversationSubtitle`      | `<div>`    | Secondary line (participants, etc.) |
| `conversation.headerActions`  | `ChatConversationHeaderActions` | `<div>`    | Action buttons in the header        |

### Messages list slots (`messagesList.*`)

| Slot name                   | Default component  | Element | Description                   |
| :-------------------------- | :----------------- | :------ | :---------------------------- |
| `messagesList.root`         | `ChatMessageList`  | `<div>` | Scrollable message container  |
| `messagesList.group`        | `ChatMessageGroup` | `<div>` | Same-author message group     |
| `messagesList.dateDivider`  | `ChatDateDivider`  | `<div>` | Date separator between groups |
| `messagesList.unreadMarker` | `ChatUnreadMarker` | `<div>` | "New messages" marker         |

### Per-message slots (`message.*`)

| Slot name              | Default component       | Element | Description                                  |
| :--------------------- | :---------------------- | :------ | :------------------------------------------- |
| `message.root`         | `ChatMessage`           | `<div>` | Individual message row                       |
| `message.avatar`       | `ChatMessageAvatar`     | `<div>` | Author avatar (pass `null` to hide)          |
| `message.content`      | `ChatMessageContent`    | `<div>` | Message bubble                               |
| `message.meta`         | `ChatMessageMeta`       | `<div>` | External timestamp (compact variant)         |
| `message.inlineMeta`   | `ChatMessageInlineMeta` | `<div>` | Inline timestamp (default variant)           |
| `message.error`        | `ChatMessageError`      | `<div>` | Error card shown when message status is error|
| `message.actions`      | `ChatMessageActions`    | `<div>` | Hover action menu (pass `null` to hide)      |
| `message.authorName`   | styled `div`            | `<div>` | Author name label (pass `null` to hide)      |

### Composer slots (`composer.*`)

| Slot name                | Default component            | Element      | Description             |
| :----------------------- | :--------------------------- | :----------- | :---------------------- |
| `composer.root`          | `ChatComposer`               | `<form>`     | Composer container      |
| `composer.input`         | `ChatComposerTextArea`       | `<textarea>` | Auto-resizing text area |
| `composer.send`          | `ChatComposerSendButton`     | `<button>`   | Submit button           |
| `composer.attach`        | `ChatComposerAttachButton`   | `<button>`   | File attach trigger     |
| `composer.attachmentList`| `ChatComposerAttachmentList` | `<div>`      | Selected file pills     |
| `composer.toolbar`       | `ChatComposerToolbar`        | `<div>`      | Button row              |
| `composer.helperText`    | `ChatComposerHelperText`     | `<div>`      | Disclaimer or hint      |

### Indicator slots (top-level)

| Slot name         | Default component              | Element    | Description                            |
| :---------------- | :----------------------------- | :--------- | :------------------------------------- |
| `typingIndicator` | `ChatTypingIndicator`          | `<div>`    | Animated dots while assistant responds |
| `scrollToBottom`  | `ChatScrollToBottomAffordance` | `<button>` | Floating scroll-to-bottom button       |
| `suggestions`     | `ChatSuggestions`              | `<div>`    | Prompt suggestion chips                |
| `emptyState`      | _none_                         | `<div>`    | Custom empty-thread view               |

:::info
The `typingIndicator` slot is defined in the type interface but is not yet consumed by `ChatBox`'s internal composition.
To customize it, use the standalone components in a custom layout with `ChatProvider`.
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
  slots={{ composer: { attach: MyCustomButton } }}  {/* ignored */}
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
| `conversation`         | `ChatBoxConversationSlotProps`               | Conversation family     |
| `messagesList`         | `ChatBoxMessagesListSlotProps`               | Messages list family    |
| `message`              | `ChatBoxMessageSlotProps`                    | Per-message family      |
| `composer`             | `ChatBoxComposerSlotProps`                   | Composer family         |
| `typingIndicator`      | `Partial<ChatTypingIndicatorProps>`          | Typing indicator        |
| `scrollToBottom`       | `Partial<ChatScrollToBottomAffordanceProps>` | Scroll to bottom button |
| `suggestions`          | `Partial<ChatSuggestionsProps>`              | Suggestions component   |
| `emptyState`           | `SlotComponentProps<'div'>`                  | Custom empty-thread div |

Each nested family object mirrors the same shape as the matching `slots.*` namespace — pass leaf props like `slotProps.message.avatar`, `slotProps.composer.input`, etc.

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
const MyMessageContent: NonNullable<NonNullable<ChatBoxSlots['message']>['content']> = (props) => {
  return <div className="custom-bubble" {...props} />;
};

// Type-safe slotProps
const mySlotProps: ChatBoxSlotProps = {
  composer: {
    input: { placeholder: 'Type here...' },
  },
  messagesList: {
    root: { sx: { p: 2 } },
  },
};
```

## Combining slots with theme overrides

Slots replace the component entirely, while theme `styleOverrides` adjust the default component's styles.
You can use both together—for example, swap the message content component via a slot while applying global border-radius tweaks through the theme.

## See also

- See [Styling](/x/react-chat/customization/styling/) for details on the `sx` prop, theme overrides, and dark mode.
