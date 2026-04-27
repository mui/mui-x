---
productId: x-chat
title: Messages
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageList, ChatMessageGroup
---

# Chat - Messages

<p class="description">Learn how messages are structured and rendered in a scrollable, grouped list.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Message data model

Every message in the chat system is represented by the `ChatMessage` interface:

```tsx
import type { ChatMessage } from '@mui/x-chat';
```

A `ChatMessage` has the following shape:

| Field            | Type                  | Description                                                                                        |
| :--------------- | :-------------------- | :------------------------------------------------------------------------------------------------- |
| `id`             | `string`              | Unique identifier for the message                                                                  |
| `role`           | `ChatRole`            | `'user'`, `'assistant'`, or `'system'`                                                             |
| `parts`          | `ChatMessagePart[]`   | Content parts that make up the message body (text, files, tools, etc.)                             |
| `status`         | `ChatMessageStatus`   | Delivery lifecycle: `'pending'`, `'sending'`, `'streaming'`, `'sent'`, `'error'`, or `'cancelled'` |
| `author`         | `ChatUser`            | The user who sent the message (display name, avatar, role)                                         |
| `createdAt`      | `string`              | ISO 8601 timestamp when the message was created                                                    |
| `updatedAt`      | `string`              | ISO 8601 timestamp when the message was last updated                                               |
| `editedAt`       | `string`              | ISO 8601 timestamp if the message was edited                                                       |
| `conversationId` | `string`              | The conversation this message belongs to                                                           |
| `metadata`       | `ChatMessageMetadata` | Extensible metadata object for custom data                                                         |

### Message parts

The `parts` array is the core content model.
Each part has a `type` discriminant that determines how it renders:

| Part type         | Description                              |
| :---------------- | :--------------------------------------- |
| `text`            | Plain or markdown text content           |
| `reasoning`       | Model reasoning / chain-of-thought text  |
| `file`            | An attached file (image, document, etc.) |
| `source-url`      | A URL citation                           |
| `source-document` | A document citation                      |
| `tool`            | A tool call invocation and its result    |
| `step-start`      | A visual separator between agentic steps |

This part-based model means a single message can contain mixed content—for example, a text explanation followed by a code block and a source citation.

### Message status lifecycle

Messages progress through a status lifecycle:

```text
pending → sending → streaming → sent
                 \→ error
                 \→ cancelled
```

- **pending**: the message is queued but not yet dispatched to the adapter.
- **sending**: the message has been dispatched; waiting for the first response chunk.
- **streaming**: the assistant is actively generating tokens.
- **sent**: the response is complete.
- **error**: the adapter encountered an error.
- **cancelled**: the user or application cancelled the response.

## Import

```tsx
import { ChatMessageList, ChatMessageGroup, ChatMessage } from '@mui/x-chat';
```

:::info
When using `ChatBox`, the message list is already included as a built-in part of the composition.
You only need to import these components directly when building a custom layout.
:::

## Component anatomy

Inside `ChatBox`, the message list renders a subtree of themed components:

```text
ChatMessageList                     ← scrollable container
  MessageListDateDivider            ← date separator between message groups
  ChatMessageGroup                  ← groups consecutive same-author messages
    ChatMessage                     ← individual message row
      ChatMessageAvatar             ← author avatar
      ChatMessageContent            ← message bubble with part renderers
      ChatMessageMeta               ← timestamp, delivery status
      ChatMessageActions            ← hover action buttons
```

## How messages render

The `ChatMessageList` component is the scrollable region that renders conversation history.
Scroll behavior, overflow, padding, and thin scrollbar are handled out of the box.

### Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`.
Within a group, only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.

See [Message appearance](/x/react-chat/display/message-appearance/) for grouping configuration and demos.

### Date dividers

When consecutive messages span different calendar dates, the message list renders a date divider automatically between them.

See [Message appearance](/x/react-chat/display/message-appearance/) for date divider customization.

### Auto-scrolling

The message list automatically scrolls to the bottom when the user sends a new message, when new assistant messages arrive, and during streaming.

See [Scrolling](/x/react-chat/behavior/scrolling/) for buffer configuration and scroll-to-bottom affordance.

## Standalone usage

When building a custom layout outside of `ChatBox`, use `ChatMessageList` directly inside a `ChatRoot` provider.
The demo below renders only the message list with a placeholder for a custom composer:

{{"demo": "../../material/message-list/StandaloneMessageList.js", "defaultCodeOpen": false, "bg": "inline"}}
