---
productId: x-chat
title: Chat - Slot overrides
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Slot overrides

<p class="description">Replace individual sub-components inside ChatBox with your own implementations using the <code>slots</code> and <code>slotProps</code> API.</p>

`ChatBox` composes many themed sub-components internally — message bubbles, the composer, the conversation list, date dividers, and more.
The `slots` prop lets you swap any of them with your own component, while `slotProps` passes extra props to those components without replacing them.

## Basic replacement

Pass a custom component to a named slot:

```tsx
import { ChatBox } from '@mui/x-chat';

function CustomAvatar({ message }) {
  return (
    <img
      src={`/avatars/${message.author}.png`}
      alt={message.author}
      style={{ width: 36, height: 36, borderRadius: '50%' }}
    />
  );
}

<ChatBox
  adapter={adapter}
  slots={{ messageAvatar: CustomAvatar }}
/>
```

Your component receives the same props that the default component would receive.

## Passing extra props with `slotProps`

Use `slotProps` to pass additional props to either the default or a custom slot component:

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    composerInput: {
      placeholder: 'Ask me anything...',
      maxLength: 2000,
    },
    messageList: {
      sx: { backgroundColor: 'grey.50' },
    },
  }}
/>
```

## Complete slot reference

### Layout slots

| Slot name | Default component | Element | Description |
| :--- | :--- | :--- | :--- |
| `root` | `div` | `<div>` | Outermost container |
| `layout` | `div` | `<div>` | Arranges conversation + thread panes |
| `conversationsPane` | `div` | `<div>` | Conversations sidebar container |
| `threadPane` | `div` | `<div>` | Thread (message list + composer) container |

### Conversation slots

| Slot name | Default component | Element | Description |
| :--- | :--- | :--- | :--- |
| `conversationList` | `ChatConversationList` | `<div>` | Conversation list |
| `conversationHeader` | `ChatConversationHeader` | `<header>` | Header bar above the message list |
| `conversationTitle` | `ChatConversationTitle` | `<div>` | Conversation name |
| `conversationSubtitle` | `ChatConversationSubtitle` | `<div>` | Secondary line (participants, etc.) |
| `conversationHeaderActions` | `ChatConversationHeaderActions` | `<div>` | Action buttons in the header |

### Message list slots

| Slot name | Default component | Element | Description |
| :--- | :--- | :--- | :--- |
| `messageList` | `ChatMessageList` | `<div>` | Scrollable message container |
| `messageRoot` | `ChatMessage` | `<div>` | Individual message row |
| `messageAvatar` | `ChatMessageAvatar` | `<div>` | Author avatar |
| `messageContent` | `ChatMessageContent` | `<div>` | Message bubble |
| `messageMeta` | `ChatMessageMeta` | `<div>` | Timestamp and delivery status |
| `messageActions` | `ChatMessageActions` | `<div>` | Hover action menu |
| `messageGroup` | `ChatMessageGroup` | `<div>` | Same-author message group |
| `dateDivider` | `ChatDateDivider` | `<div>` | Date separator between groups |

### Composer slots

| Slot name | Default component | Element | Description |
| :--- | :--- | :--- | :--- |
| `composerRoot` | `ChatComposer` | `<form>` | Composer container |
| `composerInput` | `ChatComposerTextArea` | `<textarea>` | Auto-resizing text area |
| `composerSendButton` | `ChatComposerSendButton` | `<button>` | Submit button |
| `composerAttachButton` | `ChatComposerAttachButton` | `<button>` | File attach trigger |
| `composerToolbar` | `ChatComposerToolbar` | `<div>` | Button row |
| `composerHelperText` | `ChatComposerHelperText` | `<div>` | Disclaimer or hint |

### Indicator slots

| Slot name | Default component | Element | Description |
| :--- | :--- | :--- | :--- |
| `typingIndicator` | `ChatTypingIndicator` | `<div>` | Animated dots while assistant responds |
| `unreadMarker` | `ChatUnreadMarker` | `<div>` | "New messages" marker |
| `scrollToBottom` | `ChatScrollToBottomAffordance` | `<button>` | Floating scroll-to-bottom button |
| `suggestions` | `ChatSuggestions` | `<div>` | Prompt suggestion chips |

## Hiding a slot

Return `null` from a slot to remove it entirely:

```tsx
<ChatBox
  adapter={adapter}
  slots={{
    conversationHeader: () => null,
    composerAttachButton: () => null,
    suggestions: () => null,
  }}
/>
```

For common show/hide needs, prefer the `features` prop which handles the logic cleanly:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    conversationHeader: false,
    attachButton: false,
    helperText: false,
    scrollToBottom: false,
    suggestions: false,
  }}
/>
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
You can use both together:

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/x-chat/themeAugmentation';

const theme = createTheme({
  components: {
    // Theme override: tweak the default message bubble radius
    MuiChatMessage: {
      styleOverrides: {
        bubble: { borderRadius: 16 },
      },
    },
  },
});

// Slot override: replace the avatar entirely
function BotAvatar() {
  return <RobotIcon style={{ width: 36, height: 36 }} />;
}

<ThemeProvider theme={theme}>
  <ChatBox
    adapter={adapter}
    slots={{ messageAvatar: BotAvatar }}
  />
</ThemeProvider>
```
