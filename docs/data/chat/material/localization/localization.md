---
productId: x-chat
title: Chat - Localization
packageName: '@mui/x-chat'
---

# Localization

<p class="description">Customize all user-facing strings through the <code>localeText</code> prop or theme-level injection.</p>

## The `localeText` prop

Pass `localeText` to `ChatBox` or to the `ChatRoot` provider to override any user-facing string.

{{"demo": "LocaleTextDemo.js"}}

## Available locale keys

The chat surface exposes these localizable strings:

| Key                                    | Default (en-US)          |
| :------------------------------------- | :----------------------- |
| `composerInputPlaceholder`             | "Type a message"         |
| `composerInputAriaLabel`               | "Message input"          |
| `composerSendButtonLabel`              | "Send"                   |
| `composerAttachButtonLabel`            | "Attach files"           |
| `messageCopyCodeButtonLabel`           | "Copy"                   |
| `messageCopiedCodeButtonLabel`         | "Copied"                 |
| `messageEditedLabel`                   | "Edited"                 |
| `messageReasoningLabel`                | "Reasoning"              |
| `messageReasoningStreamingLabel`       | "Thinking..."            |
| `messageToolInputLabel`                | "Input"                  |
| `messageToolOutputLabel`               | "Output"                 |
| `messageToolApproveButtonLabel`        | "Approve"                |
| `messageToolDenyButtonLabel`           | "Deny"                   |
| `retryButtonLabel`                     | "Retry"                  |
| `historyErrorLabel`                    | "Failed to load history" |
| `conversationListNoConversationsLabel` | "No conversations"       |
| `unreadMarkerLabel`                    | "New messages"           |
| `scrollToBottomLabel`                  | "Scroll to bottom"       |
| `threadNoMessagesLabel`                | "No messages yet"        |
| `loadingLabel`                         | "Loading..."             |

Some keys are functions that receive runtime values:

- `messageStatusLabel(status)` — returns status text for pending, sending, sent, error, and cancelled states
- `messageTimestampLabel(dateTime)` — formats message timestamps
- `conversationTimestampLabel(dateTime)` — formats conversation list timestamps
- `typingIndicatorLabel(users)` — returns typing indicator text
- `scrollToBottomWithCountLabel(count)` — returns scroll button text with unseen count

## Adjacent pages

- See [Theming](/x/react-chat/material/theming/) for visual customization.
- See [Headless overview](/x/react-chat/headless/) for the runtime localization contract.
