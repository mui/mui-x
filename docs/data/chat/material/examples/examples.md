---
title: Chat - Material UI examples
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Material UI examples

<p class="description">Demo-first examples for building chat interfaces with <code>@mui/x-chat</code></p>

These demos show common product patterns using the `ChatBox` component.
Each demo is self-contained and demonstrates one aspect of the `@mui/x-chat` API.

All examples use a local echo adapter that streams responses back.
Replace it with your real adapter to connect to a backend.

## Start here

- [Basic AI chat](/x/react-chat/material/examples/basic-ai-chat/) for the smallest working `ChatBox` setup
- [Thread-only](/x/react-chat/material/examples/thread-only/) for a single-pane copilot with no sidebar
- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for the two-pane inbox layout
- [No conversation history](/x/react-chat/material/examples/no-conversation-history/) for when the adapter has no `listConversations` and no conversations state is provided

## Composable parts

- [Message feed](/x/react-chat/material/examples/message-feed/) for a display-only embed with no input — trigger messages via `useChat().sendMessage()`
- [Split layout](/x/react-chat/material/examples/split-layout/) for placing `ChatMessageList` and `ChatComposer` in separate DOM zones, connected only by `ChatRoot`

## Agentic

- [Agentic code assistant](/x/react-chat/material/examples/agentic-code/) — streaming tool calls (Bash, Read, Edit, Write, Glob), reasoning parts, step boundaries, and an interactive tool-approval flow — all via the adapter API
- [Plan & task](/x/react-chat/material/examples/plan-task/) for displaying a structured agent execution plan with live step status via `ChatPlan` and `ChatTask`
- [Code Block](/x/react-chat/material/examples/code-block/) for displaying code with language label and copy-to-clipboard via `ChatCodeBlock`
- [Confirmation](/x/react-chat/material/examples/confirmation/) for human-in-the-loop checkpoints before irreversible actions via `ChatConfirmation`

## Theming and customization

- [Custom theme](/x/react-chat/material/examples/custom-theme/) for changing palette, shape, and typography via `ThemeProvider`
- [Slot overrides](/x/react-chat/material/examples/slot-overrides/) for replacing inner sub-components with custom implementations
- [Model selector](/x/react-chat/material/examples/model-selector/) for adding a model picker to the conversation header via `slots.conversationHeaderActions`

## Recommended progression

1. Start with [Basic AI chat](/x/react-chat/material/examples/basic-ai-chat/) to understand the minimal surface.
2. Try [Thread-only](/x/react-chat/material/examples/thread-only/) for a copilot with no conversation sidebar.
3. Move to [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) to see the two-pane inbox pattern.
4. Explore [Custom theme](/x/react-chat/material/examples/custom-theme/) to retheme the component from the `ThemeProvider`.
5. Finish with [Slot overrides](/x/react-chat/material/examples/slot-overrides/) when the default structure needs modification.

## API

- [ChatRoot](/x/api/chat/chat-root/)
