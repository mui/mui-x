---
productId: x-chat
title: Structure
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Structure

<p class="description">Replace subcomponents, rearrange the layout, add custom renderers, and localize every string.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## How do I…

Jump to a task. Each recipe is the shortest path that works — copy, adapt, ship.

### …hide the attach button?

```tsx
<ChatBox adapter={adapter} features={{ attachments: false }} />
```

### …change the composer placeholder?

```tsx
<ChatBox
  adapter={adapter}
  localeText={{ composerInputPlaceholder: 'Ask anything…' }}
/>
```

### …replace the send button with my own icon?

```tsx
import SendRoundedIcon from '@mui/icons-material/SendRounded';

function MySendButton(props) {
  return (
    <IconButton {...props}>
      <SendRoundedIcon />
    </IconButton>
  );
}

<ChatBox adapter={adapter} slots={{ composerSendButton: MySendButton }} />;
```

### …hide avatars entirely?

```tsx
<ChatBox adapter={adapter} slots={{ messageAvatar: () => null }} />
```

### …render tool calls as cards instead of JSON?

```tsx
<ChatBox
  adapter={adapter}
  partRenderers={{
    'tool-call': ({ part }) => (
      <ToolCard name={part.toolName} args={part.args} result={part.result} />
    ),
  }}
/>
```

### …add a "Regenerate" action on assistant messages?

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    messageActions: ({ message }) =>
      message.role === 'assistant'
        ? { extraActions: [{ id: 'regenerate', label: 'Regenerate', onClick: () => adapter.regenerate(message.id) }] }
        : {},
  }}
/>
```

### …show a custom empty state?

```tsx
<ChatBox
  adapter={adapter}
  slots={{
    emptyState: () => (
      <Stack alignItems="center" spacing={1} sx={{ p: 4 }}>
        <SparkleIcon />
        <Typography variant="h6">Ask me anything</Typography>
      </Stack>
    ),
  }}
/>
```

### …hide the scroll-to-bottom button?

```tsx
<ChatBox adapter={adapter} features={{ scrollToBottom: false }} />
```

### …translate the whole UI?

```tsx
import { chatEnUS } from '@mui/x-chat/locales';

<ChatBox
  adapter={adapter}
  localeText={{ ...chatEnUS, composerSendButtonLabel: 'Enviar' }}
/>;
```

Full locale key reference is [below](#localization).

### …wrap an existing slot instead of replacing it?

Your custom component receives the same props as the default — render the original inside it:

```tsx
import { ChatMessageContent } from '@mui/x-chat';

function HighlightedMessage(props) {
  return (
    <Box sx={{ outline: props.message.flagged ? '2px solid red' : 'none' }}>
      <ChatMessageContent {...props} />
    </Box>
  );
}

<ChatBox adapter={adapter} slots={{ messageContent: HighlightedMessage }} />;
```

## Slots — swap any part

`ChatBox` is composed of named subcomponents (slots). Replace any of them with your own:

```tsx
<ChatBox
  adapter={adapter}
  slots={{ messageContent: MyCustomMessageContent }}
/>
```

Your component receives the same props as the default. This lets you wrap, extend, or fully replace any piece of the UI.

## `slotProps` — pass extra props

Pass additional props to any slot without replacing the component:

```tsx
<ChatBox
  slotProps={{
    conversationList: { 'aria-label': 'Chat threads' },
    composerInput: { placeholder: 'Ask anything...' },
    composerSendButton: { sx: { borderRadius: 6 } },
  }}
/>
```

## Available slots

### Layout

| Slot | Default | Description |
| :--- | :--- | :--- |
| `root` | `div` | Outermost container |
| `layout` | `div` | Arranges conversation + thread panes |
| `conversationsPane` | `div` | Conversations sidebar container |
| `threadPane` | `div` | Thread (message list + composer) container |

### Conversation

| Slot | Default | Description |
| :--- | :--- | :--- |
| `conversationList` | `ChatConversationList` | Conversation list |
| `conversationHeader` | `ChatConversationHeader` | Header bar above message list |
| `conversationTitle` | `ChatConversationTitle` | Conversation name |
| `conversationSubtitle` | `ChatConversationSubtitle` | Secondary line |
| `conversationHeaderActions` | `ChatConversationHeaderActions` | Action buttons in header |

### Messages

| Slot | Default | Description |
| :--- | :--- | :--- |
| `messageList` | `ChatMessageList` | Scrollable message container |
| `messageRoot` | `ChatMessage` | Individual message row |
| `messageAvatar` | `ChatMessageAvatar` | Author avatar |
| `messageContent` | `ChatMessageContent` | Message bubble |
| `messageMeta` | `ChatMessageMeta` | Timestamp and delivery status |
| `messageActions` | `ChatMessageActions` | Hover action menu |
| `messageGroup` | `ChatMessageGroup` | Same-author message group |
| `dateDivider` | `ChatDateDivider` | Date separator between groups |

### Composer

| Slot | Default | Description |
| :--- | :--- | :--- |
| `composerRoot` | `ChatComposer` | Composer container |
| `composerInput` | `ChatComposerTextArea` | Auto-resizing text area |
| `composerSendButton` | `ChatComposerSendButton` | Submit button |
| `composerAttachButton` | `ChatComposerAttachButton` | File attach trigger |
| `composerToolbar` | `ChatComposerToolbar` | Button row |
| `composerHelperText` | `ChatComposerHelperText` | Disclaimer or hint |

### Indicators

| Slot | Default | Description |
| :--- | :--- | :--- |
| `typingIndicator` | `ChatTypingIndicator` | Typing dots |
| `unreadMarker` | `ChatUnreadMarker` | "New messages" marker |
| `scrollToBottom` | `ChatScrollToBottomAffordance` | Floating scroll button |
| `suggestions` | `ChatSuggestions` | Prompt suggestion chips |

## Feature flags

Toggle built-in features on or off. When disabled, the corresponding slot is **not rendered** — even if you provide a custom component:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    attachments: false,     // hide attach button
    helperText: false,      // hide helper text
    scrollToBottom: false,  // hide scroll-to-bottom button
    suggestions: false,     // hide suggestion chips
    autoScroll: { buffer: 300 },  // custom auto-scroll threshold
  }}
/>
```

## Hiding a slot

Return `null` from a custom slot to remove it entirely:

```tsx
<ChatBox slots={{ messageAvatar: () => null }} />
```

## TypeScript

Import the slot types for type-safe custom components:

```tsx
import type { ChatBoxSlots, ChatBoxSlotProps } from '@mui/x-chat';

const MyMessageContent: ChatBoxSlots['messageContent'] = (props) => {
  return <div className="custom-bubble" {...props} />;
};
```

## Localization

Every user-facing string is customizable via the `localeText` prop:

```tsx
<ChatBox
  adapter={adapter}
  localeText={{
    composerInputPlaceholder: 'Escribe un mensaje',
    composerSendButtonLabel: 'Enviar',
    composerAttachButtonLabel: 'Adjuntar archivo',
    scrollToBottomLabel: 'Ir al final',
    threadNoMessagesLabel: 'Sin mensajes aún',
  }}
/>
```

### Full locale example (French)

```tsx
<ChatBox
  adapter={adapter}
  localeText={{
    composerInputPlaceholder: 'Tapez un message',
    composerSendButtonLabel: 'Envoyer',
    composerAttachButtonLabel: 'Joindre un fichier',
    scrollToBottomLabel: 'Aller en bas',
    threadNoMessagesLabel: 'Aucun message',
    genericErrorLabel: 'Une erreur est survenue',
    loadingLabel: 'Chargement...',
    retryButtonLabel: 'Réessayer',
    unreadMarkerLabel: 'Nouveaux messages',
    typingIndicatorLabel: (users) => {
      const names = users.map((u) => u.displayName ?? u.id).join(', ');
      return users.length === 1 ? `${names} écrit...` : `${names} écrivent...`;
    },
  }}
/>
```

### All locale keys

| Key | Default | Description |
| :--- | :--- | :--- |
| `composerInputPlaceholder` | `"Type a message"` | Composer placeholder |
| `composerSendButtonLabel` | `"Send message"` | Send button aria-label |
| `composerAttachButtonLabel` | `"Add attachment"` | Attach button aria-label |
| `messageCopyButtonLabel` | `"Copy"` | Copy message button |
| `messageCopyCodeButtonLabel` | `"Copy code"` | Copy code block button |
| `messageCopiedCodeButtonLabel` | `"Copied"` | Copied confirmation |
| `messageReasoningLabel` | `"Reasoning"` | Reasoning part label |
| `messageReasoningStreamingLabel` | `"Thinking..."` | Reasoning streaming label |
| `messageToolApproveButtonLabel` | `"Approve"` | Tool approval button |
| `messageToolDenyButtonLabel` | `"Deny"` | Tool denial button |
| `conversationListNoConversationsLabel` | `"No conversations"` | Empty conversation list |
| `unreadMarkerLabel` | `"New messages"` | Unread marker |
| `retryButtonLabel` | `"Retry"` | Retry button |
| `scrollToBottomLabel` | `"Scroll to bottom"` | Scroll affordance |
| `threadNoMessagesLabel` | `"No messages yet"` | Empty thread |
| `genericErrorLabel` | `"Something went wrong"` | Generic error |
| `loadingLabel` | `"Loading..."` | Loading state |
| `suggestionsLabel` | `"Suggested prompts"` | Suggestions section |

Function keys accept parameters:

| Key | Signature | Default |
| :--- | :--- | :--- |
| `messageStatusLabel` | `(status) => string` | Maps status to label |
| `toolStateLabel` | `(state) => string` | Maps tool state to label |
| `messageTimestampLabel` | `(dateTime) => string` | Formats to `HH:MM` |
| `typingIndicatorLabel` | `(users) => string` | `"Alice is typing"` |
| `scrollToBottomWithCountLabel` | `(count) => string` | `"N new messages"` |
