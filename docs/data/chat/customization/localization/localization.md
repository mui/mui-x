---
productId: x-chat
title: Localization
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatRoot
---

# Chat - Localization

<p class="description">Customize all user-facing strings in the chat UI using the <code>localeText</code> prop on <code>ChatRoot</code> or the <code>useChatLocaleText()</code> hook.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

Every user-facing string in the chat UI — placeholders, button labels, status messages, timestamps — is defined in a locale text object.
You can override any string by passing a partial `localeText` object to `ChatBox`.

## Default locale

The default locale is English (US).
It is exported as `chatEnUS` from `@mui/x-chat/locales`:

```tsx
import { chatEnUS } from '@mui/x-chat/locales';
```

This object contains all the default string values used by the chat components.

## Overriding locale strings

Pass a partial `localeText` object to `ChatBox` or `Chat.Root` to override specific strings.
Unspecified keys fall back to the defaults:

```tsx
<ChatBox
  adapter={adapter}
  localeText={{
    composerInputPlaceholder: 'Escribe un mensaje',
    composerSendButtonLabel: 'Enviar',
    composerAttachButtonLabel: 'Adjuntar archivo',
    scrollToBottomLabel: 'Ir al final',
    threadNoMessagesLabel: 'Sin mensajes a\u00fan',
  }}
/>
```

## The `useChatLocaleText()` hook

Inside any descendant of `ChatBox`, use the `useChatLocaleText()` hook to read the current locale text:

```tsx
import { useChatLocaleText } from '@mui/x-chat/headless';

function CustomSendButton() {
  const localeText = useChatLocaleText();

  return <button aria-label={localeText.composerSendButtonLabel}>Send</button>;
}
```

This is useful when building custom slot components that need to access localized strings.

## Available locale keys

### Static string keys

| Key                                    | Default value            | Description                       |
| :------------------------------------- | :----------------------- | :-------------------------------- |
| `composerInputPlaceholder`             | `"Type a message"`       | Composer textarea placeholder     |
| `composerInputAriaLabel`               | `"Message"`              | Composer textarea aria-label      |
| `composerSendButtonLabel`              | `"Send message"`         | Send button aria-label            |
| `composerAttachButtonLabel`            | `"Add attachment"`       | Attach button aria-label          |
| `messageCopyButtonLabel`               | `"Copy"`                 | Copy message button label         |
| `messageCopyCodeButtonLabel`           | `"Copy code"`            | Copy code block button label      |
| `messageCopiedCodeButtonLabel`         | `"Copied"`               | Copied confirmation label         |
| `messageEditedLabel`                   | `"Edited"`               | Edited message indicator          |
| `messageDeletedLabel`                  | `"Deleted"`              | Deleted message indicator         |
| `messageReasoningLabel`                | `"Reasoning"`            | Reasoning part label              |
| `messageReasoningStreamingLabel`       | `"Thinking..."`          | Reasoning part streaming label    |
| `messageToolInputLabel`                | `"Input"`                | Tool input label                  |
| `messageToolOutputLabel`               | `"Output"`               | Tool output label                 |
| `messageToolApproveButtonLabel`        | `"Approve"`              | Tool approval button              |
| `messageToolDenyButtonLabel`           | `"Deny"`                 | Tool denial button                |
| `conversationListNoConversationsLabel` | `"No conversations"`     | Empty conversation list           |
| `conversationListSearchPlaceholder`    | `"Search conversations"` | Conversation search placeholder   |
| `unreadMarkerLabel`                    | `"New messages"`         | Unread messages marker            |
| `retryButtonLabel`                     | `"Retry"`                | Retry button label                |
| `reconnectButtonLabel`                 | `"Reconnect"`            | Reconnect button label            |
| `scrollToBottomLabel`                  | `"Scroll to bottom"`     | Scroll-to-bottom affordance label |
| `threadNoMessagesLabel`                | `"No messages yet"`      | Empty thread state                |
| `genericErrorLabel`                    | `"Something went wrong"` | Generic error message             |
| `loadingLabel`                         | `"Loading..."`           | Loading state label               |
| `suggestionsLabel`                     | `"Suggested prompts"`    | Suggestions section label         |
| `messageListLabel`                     | `"Message log"`          | Message list aria-label           |
| `messageLabel`                         | `"Message"`              | Individual message aria-label     |

### Function keys

These keys accept parameters and return formatted strings:

| Key                            | Signature                                    | Default behavior                                        |
| :----------------------------- | :------------------------------------------- | :------------------------------------------------------ |
| `messageStatusLabel`           | `(status: ChatMessageStatus) => string`      | Maps status to human-readable label                     |
| `toolStateLabel`               | `(state: ChatToolInvocationState) => string` | Maps tool state to label (e.g., "Running...", "Failed") |
| `messageTimestampLabel`        | `(dateTime: string) => string`               | Formats to `HH:MM` using `toLocaleTimeString`           |
| `conversationTimestampLabel`   | `(dateTime: string) => string`               | Time for today, `MMM DD` for older dates                |
| `typingIndicatorLabel`         | `(users: ChatLocaleTypingUser[]) => string`  | `"Alice is typing"` or `"Alice, Bob are typing"`        |
| `scrollToBottomWithCountLabel` | `(unseenCount: number) => string`            | `"Scroll to bottom, N new messages"`                    |

### Message status labels

The `messageStatusLabel` function maps from `ChatMessageStatus`:

| Status      | Default label |
| :---------- | :------------ |
| `pending`   | `"Pending"`   |
| `sending`   | `"Sending"`   |
| `streaming` | `"Streaming"` |
| `sent`      | `"Sent"`      |
| `read`      | `"Read"`      |
| `error`     | `"Error"`     |
| `cancelled` | `"Cancelled"` |

### Tool state labels

The `toolStateLabel` function maps from `ChatToolInvocationState`:

| State                | Default label         |
| :------------------- | :-------------------- |
| `input-streaming`    | `"Running..."`        |
| `input-available`    | `"Running..."`        |
| `approval-requested` | `"Awaiting approval"` |
| `approval-responded` | `"Running..."`        |
| `output-available`   | `"Completed"`         |
| `output-error`       | `"Failed"`            |
| `output-denied`      | `"Denied"`            |

## Full locale override example

```tsx
const frenchLocale = {
  composerInputPlaceholder: 'Tapez un message',
  composerSendButtonLabel: 'Envoyer',
  composerAttachButtonLabel: 'Joindre un fichier',
  scrollToBottomLabel: 'Aller en bas',
  threadNoMessagesLabel: 'Aucun message',
  genericErrorLabel: 'Une erreur est survenue',
  loadingLabel: 'Chargement...',
  retryButtonLabel: 'R\u00e9essayer',
  unreadMarkerLabel: 'Nouveaux messages',
  typingIndicatorLabel: (users) => {
    const names = users.map((u) => u.displayName ?? u.id).join(', ');
    if (users.length === 1) return `${names} \u00e9crit...`;
    return `${names} \u00e9crivent...`;
  },
  messageTimestampLabel: (dateTime) => {
    const d = new Date(dateTime);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  },
};

<ChatBox adapter={adapter} localeText={frenchLocale} />;
```

## See also

- [Styling](/x/react-chat/customization/styling/) for visual customization.
- [Slots & Composition](/x/react-chat/customization/slots-and-composition/) for replacing components that render localized text.

## API
