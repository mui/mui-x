---
title: Chat - ChatGPT-style layout
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - ChatGPT-style layout

<p class="description">Replicate a ChatGPT-style two-pane layout with a sidebar conversation list and a clean message area.</p>

This demo shows how the same headless primitives can be customized to produce a full-page chat application layout similar to ChatGPT — dark theme, sidebar with conversation history, no message bubbles, and a centered composer.

- Two-pane layout with a fixed-width dark sidebar and a main thread area
- Conversation list with title only, unread blue dot indicator, and a 3-dot menu on hover
- User messages in rounded bubbles aligned to the right, assistant messages as flat text on the left
- Assistant avatar (sparkle icon), no avatar for user messages
- No sender names or timestamps — clean, minimal message display
- Centered content column with a maximum width and a pill-shaped composer

{{"demo": "ChatGptStyleChat.js", "bg": "inline"}}

## Key techniques

- Hidden slots (preview, timestamp, unread badge) via `display: 'none'`
- `Chat.Layout` with `gridTemplateColumns: '260px 1fr'` for a fixed sidebar
- `display: 'contents'` on the Message Content wrapper to let the bubble participate directly in flex layout
- `flexDirection: 'row-reverse'` on user message roots for right-aligned bubbles
- Hover-based 3-dot menu using React state and a fixed-position dropdown
- The composer uses `borderRadius: 24` for the pill-shaped input area

## API

- [ChatRoot](/x/api/chat/chat-root/)
