---
title: Chat — Material UI examples
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat — Material UI examples

<p class="description">Build chat interfaces with <code>@mui/x-chat</code> using ready-made <code>ChatBox</code> demos.</p>

Each demo shows a common product pattern with `ChatBox` and focuses on one aspect of the `@mui/x-chat` API.

All examples use a local echo adapter that streams responses back; replace it with your adapter to connect a backend.

## Where to start

- [Basic AI chat](/x/react-chat/material/examples/basic-ai-chat/) — the smallest working `ChatBox` setup.
- [Thread-only](/x/react-chat/material/examples/thread-only/) — a single-pane copilot with no sidebar.
- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) — the two-pane inbox layout.
- [No conversation history](/x/react-chat/material/examples/no-conversation-history/) — the adapter has no `listConversations` and no conversations state is provided.

## Composable parts

- [Message feed](/x/react-chat/material/examples/message-feed/) — a display-only embed with no input—trigger messages via `useChat().sendMessage()`.
- [Split layout](/x/react-chat/material/examples/split-layout/) — place `ChatMessageList` and `ChatComposer` in separate DOM zones, connected only by `ChatRoot`.

## Agentic

- [Agentic code assistant](/x/react-chat/material/examples/agentic-code/) — streaming tool calls (Bash, Read, Edit, Write, Glob), reasoning parts, step boundaries, and an interactive tool-approval flow—all via the adapter API.
- [Plan & task](/x/react-chat/material/examples/plan-task/) — display a structured agent execution plan with live step status via `ChatTaskList` and `ChatTask`.
- [Code block](/x/react-chat/material/examples/code-block/) — display code with a language label and copy-to-clipboard via `ChatCodeBlock`.
- [Confirmation](/x/react-chat/material/examples/confirmation/) — human-in-the-loop checkpoints before irreversible actions via `ChatConfirmation`.

## Theming and customization

- [Compact variant](/x/react-chat/material/examples/compact-variant/) — a messenger-style layout with no bubbles, left-aligned messages, and author names as group headers.
- [Custom theme](/x/react-chat/material/examples/custom-theme/) — change palette, shape, and typography via `ThemeProvider`.
- [Slot overrides](/x/react-chat/material/examples/slot-overrides/) — replace inner subcomponents with custom implementations.
- [Model selector](/x/react-chat/material/examples/model-selector/) — add a model picker to the conversation header via `slots.conversationHeaderActions`.

## Suggested learning order

1. Start with [Basic AI chat](/x/react-chat/material/examples/basic-ai-chat/) for the minimal surface.
2. Try [Thread-only](/x/react-chat/material/examples/thread-only/) for a copilot with no conversation sidebar.
3. Move to [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) to see the two-pane inbox pattern.
4. Explore [Custom theme](/x/react-chat/material/examples/custom-theme/) to retheme the component from the `ThemeProvider`.
5. Finish with [Slot overrides](/x/react-chat/material/examples/slot-overrides/) when the default structure needs modification.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
