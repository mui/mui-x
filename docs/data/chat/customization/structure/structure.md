---
productId: x-chat
title: Structure
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Structure

<p class="description">Customize every part of the Chat UI by swapping slots, rearranging the layout, and translating user-facing strings.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Common customizations

The recipes below cover common customizations.

{{"demo": "StructureRecipes.js"}}

Several of the recipes below applied at once.

Snippets assume an `adapter` is already created — see [Adapters](/x/react-chat/backend/adapters/).

**Layout and features**

### Hiding the attach button

```tsx
<ChatBox adapter={adapter} features={{ attachments: false }} />
```

### Showing the conversation list

```tsx
<ChatBox adapter={adapter} features={{ conversationList: true }} />
```

### Hiding the scroll-to-bottom button

```tsx
<ChatBox adapter={adapter} features={{ scrollToBottom: false }} />
```

**Composer**

### Changing the composer placeholder

```tsx
<ChatBox
  adapter={adapter}
  localeText={{ composerInputPlaceholder: 'Ask anything...' }}
/>
```

### Replacing the send button with a custom icon

```tsx
import IconButton from '@mui/material/IconButton';
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

**Messages**

### Hiding avatars entirely

```tsx
<ChatBox adapter={adapter} slots={{ messageAvatar: () => null }} />
```

### Rendering tool calls as cards instead of JSON

```tsx
// ToolCard is your own component.
<ChatBox
  adapter={adapter}
  partRenderers={{
    'tool-call': ({ part }) => (
      <ToolCard name={part.toolName} args={part.args} result={part.result} />
    ),
  }}
/>
```

### Adding a "Regenerate" action on assistant messages

The function form of `slotProps.messageActions` receives the message context, so you can append declarative `extraActions` to specific rows — here, a "Regenerate" button on assistant replies. Each action's `onClick` receives `(event, { message, chat })`; call `chat.regenerate(message.id)` to drop the existing reply and request a fresh one through the runtime.

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    messageActions: ({ message }) =>
      message?.role === 'assistant'
        ? {
            extraActions: [
              {
                id: 'regenerate',
                label: 'Regenerate',
                onClick: (event, { chat }) => chat.regenerate(message.id),
              },
            ],
          }
        : {},
  }}
/>
```

Regeneration is allowed mid-thread: regenerating an earlier assistant message replaces only that reply and leaves later turns untouched. It works against any adapter — when the adapter does not implement `regenerate`, the runtime re-sends the anchoring user message instead.

### Showing a custom empty state

```tsx
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

<ChatBox
  adapter={adapter}
  slots={{
    emptyState: () => (
      <Stack alignItems="center" spacing={1} sx={{ p: 4 }}>
        <AutoAwesomeIcon />
        <Typography variant="h6">Ask me anything</Typography>
      </Stack>
    ),
  }}
/>;
```

### Wrapping an existing slot instead of replacing it

The custom component receives the same props as the default. Render the original inside it:

```tsx
import Box from '@mui/material/Box';
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

**Localization**

### Translating the whole UI

```tsx
import { chatEnUS } from '@mui/x-chat/locales';

<ChatBox
  adapter={adapter}
  localeText={{ ...chatEnUS, composerSendButtonLabel: 'Enviar' }}
/>;
```

See [Localization](#localization) for details.

## Layout and structural props

A handful of `ChatBox` props shape the overall structure independently of slots:

| Prop                    | Values                                         | Purpose                                                        |
| :---------------------- | :--------------------------------------------- | :------------------------------------------------------------- |
| `variant`               | `'default'` \| `'compact'`                     | Visual layout: full spacing with avatars, or Messenger-style   |
| `density`               | `'compact'` \| `'standard'` \| `'comfortable'` | Vertical spacing between messages                              |
| `layoutMode`            | `'standard'` \| `'overlay'` \| `'split'`       | Forces the responsive layout instead of deriving it from width |
| `layoutModeBreakpoints` | `Partial<ChatBoxLayoutModeBreakpoints>`        | Container-width breakpoints used when `layoutMode` is omitted  |

```tsx
<ChatBox variant="compact" density="comfortable" layoutMode="split" />
```

See [Variants and density](/x/react-chat/basics/variants-and-density/) and [Layout](/x/react-chat/basics/layout/) for the live demos.

## Swapping slots

`ChatBox` is composed of named subcomponents (slots). Replace any of them with your own:

```tsx
<ChatBox adapter={adapter} slots={{ messageContent: MyCustomMessageContent }} />
```

The component receives the same props as the default. This lets you wrap, extend, or fully replace any piece of the UI.

## Passing extra props to slots

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

| Slot                | Default | Description                                |
| :------------------ | :------ | :----------------------------------------- |
| `root`              | `div`   | Outermost container                        |
| `layout`            | `div`   | Arranges conversation + thread panes       |
| `conversationsPane` | `div`   | Conversations sidebar container            |
| `threadPane`        | `div`   | Thread (message list + composer) container |

### Conversation

| Slot                        | Default                         | Description                          |
| :-------------------------- | :------------------------------ | :----------------------------------- |
| `conversationRoot`          | `ChatConversation`              | Thread wrapper element               |
| `conversationList`          | `ChatConversationList`          | Conversation sidebar list            |
| `conversationHeader`        | `ChatConversationHeader`        | Header bar above message list        |
| `conversationHeaderInfo`    | `ChatConversationHeaderInfo`    | Title + subtitle group in the header |
| `conversationTitle`         | `ChatConversationTitle`         | Conversation name                    |
| `conversationSubtitle`      | `ChatConversationSubtitle`      | Secondary line                       |
| `conversationHeaderActions` | `ChatConversationHeaderActions` | Action buttons in header             |

### Messages list

| Slot           | Default            | Description                                                     |
| :------------- | :----------------- | :-------------------------------------------------------------- |
| `messageList`  | `ChatMessageList`  | Scrollable message container                                    |
| `messageGroup` | `ChatMessageGroup` | Same-author message group                                       |
| `dateDivider`  | `ChatDateDivider`  | Date separator between groups (requires `features.dateDivider`) |
| `unreadMarker` | `ChatUnreadMarker` | "New messages" marker (requires `features.unreadMarker`)        |

### Per message

| Slot                | Default                 | Description                                                                                                                                        |
| :------------------ | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messageRoot`       | `ChatMessage`           | Individual message row                                                                                                                             |
| `messageAvatar`     | `ChatMessageAvatar`     | Author avatar (`null` to hide)                                                                                                                     |
| `messageContent`    | `ChatMessageContent`    | Message bubble                                                                                                                                     |
| `messageMeta`       | `ChatMessageMeta`       | External timestamp (compact variant)                                                                                                               |
| `messageInlineMeta` | `ChatMessageInlineMeta` | Inline timestamp (default variant)                                                                                                                 |
| `messageError`      | `ChatMessageError`      | Error card shown when status is error                                                                                                              |
| `messageActions`    | `ChatMessageActions`    | Hover action bar (`null` to hide). The `slotProps` function form receives the message context; return `extraActions` to append declarative buttons |
| `messageAuthorName` | styled `div`            | Author name label (`null` to hide)                                                                                                                 |

### Composer

| Slot                     | Default                      | Description             |
| :----------------------- | :--------------------------- | :---------------------- |
| `composerRoot`           | `ChatComposer`               | Composer container      |
| `composerInput`          | `ChatComposerTextArea`       | Auto-resizing text area |
| `composerSendButton`     | `ChatComposerSendButton`     | Submit button           |
| `composerAttachButton`   | `ChatComposerAttachButton`   | File attach trigger     |
| `composerAttachmentList` | `ChatComposerAttachmentList` | Selected file pills     |
| `composerToolbar`        | `ChatComposerToolbar`        | Button row              |
| `composerHelperText`     | `ChatComposerHelperText`     | Disclaimer or hint      |

### Indicators (top-level)

| Slot              | Default                        | Description              |
| :---------------- | :----------------------------- | :----------------------- |
| `typingIndicator` | `ChatTypingIndicator`          | Typing dots              |
| `scrollToBottom`  | `ChatScrollToBottomAffordance` | Floating scroll button   |
| `suggestions`     | `ChatSuggestions`              | Prompt suggestion chips  |
| `emptyState`      | _none_                         | Custom empty-thread view |

## Feature flags

Toggle built-in features on or off. When disabled, the corresponding slot is **not rendered**, even if you provide a custom component:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    conversationList: true, // show the conversation sidebar
    conversationHeader: true, // show the header bar above the message list
    dateDivider: true, // show date separators between calendar days
    unreadMarker: true, // show the "new messages" marker
    attachments: false, // hide attach button
    helperText: false, // hide helper text
    scrollToBottom: false, // hide scroll-to-bottom button
    suggestions: false, // hide suggestion chips
    autoScroll: { buffer: 300 }, // custom auto-scroll threshold
  }}
/>
```

`conversationList`, `dateDivider`, and `unreadMarker` are opt-in and default to `false`; the other flags default to `true`.

Note: the feature flag is `helperText`, while the corresponding slot is named `composerHelperText`.

## Hiding a slot

Return `null` from a custom slot to remove it entirely:

```tsx
<ChatBox slots={{ messageAvatar: () => null }} />
```

## TypeScript types

Import the slot types for type-safe custom components:

```tsx
import type { ChatBoxSlots, ChatBoxSlotProps } from '@mui/x-chat';
import { ChatMessageContent } from '@mui/x-chat';

const MyMessageContent: ChatBoxSlots['messageContent'] = (props) => (
  <Box className="custom-bubble">
    <ChatMessageContent {...props} />
  </Box>
);
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

**Composer**

| Key                               | Default            | Description                          |
| :-------------------------------- | :----------------- | :----------------------------------- |
| `composerInputPlaceholder`        | `"Type a message"` | Composer placeholder                 |
| `composerInputAriaLabel`          | `"Message"`        | Composer input accessible name       |
| `composerSendButtonLabel`         | `"Send message"`   | Send button aria-label               |
| `composerAttachButtonLabel`       | `"Add attachment"` | Attach button aria-label             |
| `composerAttachInputLabel`        | `"Upload file"`    | Hidden file input accessible name    |
| `composerAttachmentFallbackLabel` | `"Attachment"`     | Fallback name for unnamed attachment |

**Messages**

| Key                              | Default         | Description                 |
| :------------------------------- | :-------------- | :-------------------------- |
| `messageCopyButtonLabel`         | `"Copy"`        | Copy message button         |
| `messageCopyCodeButtonLabel`     | `"Copy code"`   | Copy code block button      |
| `messageCopiedCodeButtonLabel`   | `"Copied"`      | Copied confirmation         |
| `messageEditedLabel`             | `"Edited"`      | Edited message badge        |
| `messageDeletedLabel`            | `"Deleted"`     | Deleted message placeholder |
| `messageReasoningLabel`          | `"Reasoning"`   | Reasoning part label        |
| `messageReasoningStreamingLabel` | `"Thinking…"`   | Reasoning streaming label   |
| `messageToolInputLabel`          | `"Tool called"` | Tool input section label    |
| `messageToolOutputLabel`         | `"Tool result"` | Tool output section label   |
| `messageToolApproveButtonLabel`  | `"Approve"`     | Tool approval button        |
| `messageToolDenyButtonLabel`     | `"Deny"`        | Tool denial button          |

**Conversations**

| Key                                    | Default                   | Description                     |
| :------------------------------------- | :------------------------ | :------------------------------ |
| `conversationListNoConversationsLabel` | `"No conversations"`      | Empty conversation list         |
| `conversationListSearchPlaceholder`    | `"Search conversations"`  | Conversation search placeholder |
| `conversationHeaderMenuLabel`          | `"Open conversations"`    | Header menu button              |
| `conversationHeaderBackLabel`          | `"Back to conversations"` | Header back button              |
| `conversationHeaderCloseLabel`         | `"Close conversations"`   | Header close button             |
| `conversationHeaderNewChatLabel`       | `"New chat"`              | Header new-chat button          |
| `conversationHeaderSettingsLabel`      | `"Settings"`              | Header settings button          |

**Status and indicators**

| Key                          | Default                           | Description              |
| :--------------------------- | :-------------------------------- | :----------------------- |
| `unreadMarkerLabel`          | `"New messages"`                  | Unread marker            |
| `retryButtonLabel`           | `"Retry"`                         | Retry button             |
| `reconnectButtonLabel`       | `"Reconnect"`                     | Reconnect button         |
| `scrollToBottomLabel`        | `"Scroll to bottom"`              | Scroll affordance        |
| `threadNoMessagesLabel`      | `"No messages yet"`               | Empty thread             |
| `threadNoMessagesHelperText` | `"Type a message to get started"` | Empty-thread helper text |
| `genericErrorLabel`          | `"Something went wrong"`          | Generic error            |
| `loadingLabel`               | `"Loading…"`                      | Loading state            |
| `suggestionsLabel`           | `"Suggested prompts"`             | Suggestions section      |

**Accessibility and announcements**

| Key                                      | Default                     | Description                               |
| :--------------------------------------- | :-------------------------- | :---------------------------------------- |
| `messageListLabel`                       | `"Message log"`             | Message list accessible name              |
| `messageLabel`                           | `"Message"`                 | Single message accessible name            |
| `messageActionsLabel`                    | `"Message actions"`         | Message actions container accessible name |
| `messageAuthorUserLabel`                 | `"User"`                    | Default author label for user role        |
| `messageAuthorAssistantLabel`            | `"Assistant"`               | Default author label for assistant role   |
| `messageAuthorSystemLabel`               | `"System"`                  | Default author label for system role      |
| `conversationListLandmarkLabel`          | `"Conversations"`           | Conversations sidebar landmark name       |
| `threadLandmarkLabel`                    | `"Conversation"`            | Active thread landmark name               |
| `composerLandmarkLabel`                  | `"Message composer"`        | Composer form landmark name               |
| `responseStreamingStartedAnnouncement`   | `"Assistant is responding"` | Announced when streaming starts           |
| `responseStreamingCompletedAnnouncement` | `"Response complete"`       | Announced when streaming completes        |

Function keys accept parameters:

| Key                             | Signature              | Default                              |
| :------------------------------ | :--------------------- | :----------------------------------- |
| `messageStatusLabel`            | `(status) => string`   | Maps status to label                 |
| `toolStateLabel`                | `(state) => string`    | Maps tool state to label             |
| `messageTimestampLabel`         | `(dateTime) => string` | Formats to `HH:MM`                   |
| `conversationTimestampLabel`    | `(dateTime) => string` | Relative day or `HH:MM`              |
| `typingIndicatorLabel`          | `(users) => string`    | `"Alice is typing"`                  |
| `scrollToBottomWithCountLabel`  | `(count) => string`    | `"Scroll to bottom, N new messages"` |
| `composerRemoveAttachmentLabel` | `(fileName) => string` | `"Remove {fileName}"`                |
