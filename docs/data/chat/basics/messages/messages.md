---
productId: x-chat
title: Messages
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageList, ChatMessageGroup
---

# Chat - Messages

<p class="description">Render conversation history as a virtualized, grouped, auto-scrolling message list.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Interactive playground

Toggle role, status, density, and grouping on a single `ChatMessage` bubble:

{{"demo": "ChatMessagePlayground.js", "bg": "inline", "defaultCodeOpen": false}}

### Message groups

`ChatMessageGroup` collapses consecutive messages from the same author into a single visual cluster:

{{"demo": "ChatMessageGroupPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

### Message list

`ChatMessageList` virtualizes rendering, manages auto-scroll, and can insert opt-in dividers between days:

{{"demo": "ChatMessageListPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## The `ChatMessage` data model

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
| `author`         | `ChatUser`            | The author payload used for inline identity data and member matching                               |
| `createdAt`      | `string`              | ISO 8601 timestamp when the message was created                                                    |
| `updatedAt`      | `string`              | ISO 8601 timestamp when the message was last updated                                               |
| `editedAt`       | `string`              | ISO 8601 timestamp if the message was edited                                                       |
| `conversationId` | `string`              | The conversation this message belongs to                                                           |
| `metadata`       | `ChatMessageMetadata` | Extensible metadata object for custom data                                                         |

`author.id` is the canonical identity key for message rendering.
If you pass `members`, `currentUser`, or active conversation `participants`, chat components use that id to enrich missing display names and avatars at render time.

If your message model stores author identity somewhere else, provide `getMessageAuthorId`, `getMessageAuthorDisplayName`, and `getMessageAuthorAvatarUrl` on `ChatProvider`, `ChatRoot`, or `ChatBox` to map that data into the built-in message primitives.

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

- **pending**—the message is queued but not yet dispatched to the adapter.
- **sending**—the message has been dispatched; waiting for the first response chunk.
- **streaming**—the assistant is actively generating tokens.
- **sent**—the response is complete.
- **error**—the adapter encountered an error.
- **cancelled**—the user or application cancelled the response.

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
  MessageListDateDivider            ← date separator between message groups (opt-in)
  ChatMessageGroup                  ← groups consecutive same-author messages
    ChatMessage                     ← individual message row
      ChatMessageAvatar             ← author avatar
      ChatMessageContent            ← message bubble with part renderers
      ChatMessageMeta               ← timestamp, delivery status
      ChatMessageActions            ← hover action buttons
```

## How messages render

The `ChatMessageList` component is the scrollable region that renders conversation history.
It manages scroll behavior, overflow, padding, and a thin scrollbar by default.

### Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`.
Within a group, only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.
If no display name or avatar resolves for a message author, the UI omits those affordances instead of falling back to the role name.

See [Message appearance](/x/react-chat/display/message-appearance/) for grouping configuration and demos.

### Date dividers

When consecutive messages span different calendar dates, the message list can render a date divider between them.
Dividers are disabled by default—enable them with the `dateDivider` feature flag:

```tsx
<ChatBox adapter={adapter} features={{ dateDivider: true }} />
```

See [Date divider](/x/react-chat/display/date-divider/) and [Message appearance](/x/react-chat/display/message-appearance/) for customization.

### Auto-scrolling

The message list automatically scrolls to the bottom when the user sends a new message, when new assistant messages arrive, and during streaming.

See [Scrolling](/x/react-chat/behavior/scrolling/) for buffer configuration and scroll-to-bottom affordance.

## Standalone usage

When building a custom layout outside of `ChatBox`, render `ChatMessageList` directly inside `ChatProvider`.
The demo below isolates the message surface with only the provider, a bounded frame, and the message list composition:

{{"demo": "StandaloneMessages.js", "defaultCodeOpen": false, "bg": "inline"}}

### Message slots

Each slot inside the `ChatMessage` row has its own playground — iterate on a single surface at a time.

#### Avatar

The author avatar slot—falls back to initials when no `avatarUrl` is set.

{{"demo": "ChatMessageAvatarPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

#### Author label

Displays the author name above grouped messages.

{{"demo": "ChatMessageAuthorLabelPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

#### Content

The bubble interior—renders markdown, code fences, and tool or source parts.

{{"demo": "ChatMessageContentPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

#### Meta

External timestamp and delivery status, used by compact bubbles.

{{"demo": "ChatMessageMetaPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

#### Inline meta

Telegram-style timestamp and status flowing inside the bubble.

{{"demo": "ChatMessageInlineMetaPlayground.js", "bg": "inline", "defaultCodeOpen": false}}
