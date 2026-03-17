---
productId: x-chat
title: Chat - AI assistant
packageName: '@mui/x-chat'
---

# AI assistant

<p class="description">A production-ready AI assistant with streaming responses, markdown rendering, reasoning parts, and tool call display.</p>

This example shows the full Material chat surface configured as an AI coding assistant.
The adapter streams text with markdown formatting, emits reasoning parts, and simulates a tool call.

{{"demo": "AiAssistant.js"}}

## What this example demonstrates

- Streaming text responses with simulated chunk delays
- Markdown rendering with headings, code blocks, and lists
- Reasoning part displayed as a collapsible panel
- Tool call part showing a completed tool invocation
- Thread-only layout (no conversations sidebar)

## Key patterns

The adapter returns a `ReadableStream` that emits chunks in sequence:

1. `start` chunk to begin the message
2. `reasoning-start` / `reasoning-delta` / `reasoning-end` for the thinking step
3. `text-start` / `text-delta` / `text-end` for the visible response
4. `tool-start` / `tool-delta` / `tool-end` for tool invocations
5. `finish` to complete the message
