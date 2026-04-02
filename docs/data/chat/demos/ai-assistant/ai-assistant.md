---
productId: x-chat
title: AI Assistant demo
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - AI Assistant demo

<p class="description">A full ChatGPT-style AI assistant with streaming responses, tool calling, and rich content rendering.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Agentic code assistant

An advanced agentic chat that demonstrates the full range of AI assistant capabilities: streaming tool calls (Bash, Read, Edit, Write, Glob), collapsible reasoning blocks, step boundaries between agentic iterations, and an interactive tool approval flow.

Send a message in any conversation to watch the scripted agentic stream play out: reasoning, text, tool input streaming, tool output, and a final summary.

{{"demo": "../../material/examples/agentic-code/AgenticCode.js", "defaultCodeOpen": false, "bg": "inline"}}

## Basic AI chat

The simplest working `ChatBox` setup: a single adapter, one conversation, and an initial message. This demo shows the minimum required props to render a styled, interactive chat surface with streaming responses.

{{"demo": "../../material/examples/basic-ai-chat/BasicAiChat.js", "defaultCodeOpen": false, "bg": "inline"}}

## What these demos show

- **Streaming responses** — text arrives incrementally as the model generates it, giving users immediate feedback
- **Tool calling** — the adapter drives a state machine for tool invocations, with input streaming, output rendering, and approval flows
- **Reasoning blocks** — collapsible reasoning parts let users inspect the model's chain of thought without cluttering the conversation
- **Rich content** — code blocks, inline code, and structured tool output render natively inside message bubbles
- **Adapter-driven architecture** — all behavior flows through the `sendMessage` adapter method, keeping the component stateless and backend-agnostic

## API

- [`ChatBox`](/x/api/chat/chat-box/)
