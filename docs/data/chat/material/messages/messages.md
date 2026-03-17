---
productId: x-chat
title: Chat - Messages
packageName: '@mui/x-chat'
components: ChatMessage, ChatMarkdownTextPart, ChatMessageSkeleton
---

# Messages

<p class="description">Styled message components render user and assistant messages with avatars, metadata, grouping, date dividers, and AI-specific part renderers.</p>

## Message anatomy

Each message is composed from sub-components:

- `ChatMessageRoot` — container with role-based alignment
- `ChatMessageAvatar` — uses `MuiAvatar` with user images or initials
- `ChatMessageContent` — bubble with part renderers
- `ChatMessageMeta` — timestamp, status, and edited indicators
- `ChatMessageActions` — hover/focus action buttons

`ChatMessageGroup` groups consecutive messages from the same author, applying connected corner styles and collapsing repeated avatars.

{{"demo": "MessageAnatomy.js"}}

## Markdown rendering

The built-in `ChatMarkdownTextPart` renders markdown content with:

- Headings, paragraphs, lists, and inline formatting
- Fenced code blocks with syntax highlighting and a copy button
- Streaming-safe incremental parsing

{{"demo": "MarkdownMessages.js"}}

## AI part renderers

The styled layer ships renderers for common AI message parts:

- **Reasoning**: collapsible panel showing the model's chain of thought
- **Tool calls**: state-specific card (streaming, approval-requested, completed, error)
- **Source URLs**: clickable reference links
- **Source documents**: document reference cards
- **Files**: inline images and file download links

{{"demo": "AiPartRenderers.js"}}

## Custom part renderers

Override the default rendering for any part type using the `partRenderers` prop.

{{"demo": "CustomPartRenderer.js"}}

## Date dividers

`ChatDateDivider` renders a centered date label between messages from different days.
It is automatically inserted by `ChatThread` when dates change in the message list.

## Adjacent pages

- See [Unstyled messages](/x/react-chat/unstyled/messages/) for the structural primitive model.
- See [Headless message parts](/x/react-chat/headless/examples/message-parts/) for the part type reference.
