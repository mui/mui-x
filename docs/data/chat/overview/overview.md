---
productId: x-chat
title: Chat React components
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatRoot, ChatLayout
---

{{"component": "modules/components/overview/XLogo.tsx"}}

# MUI X Chat

<p class="description">A fully styled, theme-aware chat interface built on a three-tier package architecture.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

{{"component": "modules/components/overview/chat/mainDemo/MainDemo.tsx"}}

## Features

- **Streaming responses** — display assistant messages token-by-token as they are generated
- **Multi-conversation** — manage multiple conversations with a sidebar, thread switching, and per-conversation message state
- **Adapters** — connect to any backend through a single `sendMessage` interface that returns a `ReadableStream`
- **Tool calling** — render tool invocations, results, and approval flows inside the conversation thread
- **Attachments** — attach files with MIME type filtering, file size limits, and preview
- **Customization** — override slots and apply theme overrides for full control
- **Accessibility** — keyboard navigation, ARIA labels, and live regions built in

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
- [`ChatLayout`](/x/api/chat/chat-layout/)
