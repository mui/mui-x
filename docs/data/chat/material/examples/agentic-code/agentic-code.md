---
title: Agentic code assistant
productId: x-chat
packageName: '@mui/x-chat'
---

# Agentic code assistant

<p class="description">Streaming tool calls (Bash, Read, Edit, Write, Glob), reasoning, step boundaries, and an interactive approval flow — driven entirely by the adapter API.</p>

{{"demo": "AgenticCode.js"}}

## How it works

The demo has three pre-populated conversations, each showcasing a different aspect of the
agentic loop:

- **Fix test failures** — a complete multi-step task: `glob` finds the files, `read_file`
  inspects the broken import, `edit_file` patches it, and `bash` confirms the tests pass.
- **Add dark mode toggle** — `read_file` inspects the existing component, `write_file`
  creates a new one, then `bash` verifies the build.
- **Clean build artifacts** — a `bash` command in the `approval-requested` state. Click
  **Approve** or **Deny** to see the state transition live.

Send any new message in any conversation to watch the scripted agentic stream play out from
scratch: reasoning → text → tool input streaming → tool output → next tool → final summary.

## Streaming tool calls

The adapter's `sendMessage` method returns a `ReadableStream` of typed chunks. Tool calls
flow through a state machine driven by those chunks:

```ts
// 1. Tool starts — input streams in as JSON deltas
{ type: 'tool-input-start', toolCallId, toolName: 'glob', dynamic: true }
{ type: 'tool-input-delta', toolCallId, inputTextDelta: '{"pattern":' }
{ type: 'tool-input-delta', toolCallId, inputTextDelta: '"src/**/*.ts"}' }
{ type: 'tool-input-available', toolCallId, toolName: 'glob', input: { pattern: 'src/**/*.ts' } }

// 2. Tool finishes — output arrives as a single chunk
{ type: 'tool-output-available', toolCallId, output: { files: ['src/api.ts', ...] } }
```

The component renders each state automatically: a spinner during `input-streaming`,
the formatted input once `input-available`, and the output once `output-available`.

## Tool approval flow

When the adapter emits a `tool-approval-request` chunk (or a message is pre-populated with
`state: 'approval-requested'`), the built-in `ToolPart` renders **Approve** and **Deny**
buttons. Clicking either calls `adapter.addToolApprovalResponse({ id, approved })`.

The adapter then updates the tool's state to `output-available` or `output-denied`,
which the component reflects immediately:

```ts
const adapter: ChatAdapter = {
  async addToolApprovalResponse({ id, approved }) {
    // Update the tool invocation state in your message store
  },
};
```

## Reasoning parts

Before the first tool call the model emits a reasoning chunk sequence:

```ts
{ type: 'reasoning-start', id }
{ type: 'reasoning-delta', id, delta: 'Let me explore...' }
{ type: 'reasoning-end', id }
```

This produces a collapsible `ReasoningPart` in the message — collapsed by default so it
doesn't dominate the conversation but still inspectable.

## Step boundaries

`{ type: 'start-step' }` marks the beginning of a new agentic iteration. The corresponding
`step-start` part in the rendered message visually separates reasoning loops, making it
clear where one planning cycle ends and the next begins.

## Tool slot overrides

Both `slots` and `slotProps` on the built-in `ToolPart` renderer are fully
customisable. Pass them through `slotProps.messageContent.partProps['dynamic-tool']`
on `ChatBox`.

### Icon styles

Five variations of the `icon` slot — from the default first-letter monogram to
emoji, coloured circles, terminal squares, and Unicode symbols. Each icon
receives `ownerState.toolName` so a single component can branch on the tool type.

{{"demo": "ToolStylingA.js"}}

### Block themes

Five visual themes applied via `slotProps` (global, all tools) and `toolSlotProps`
(per tool name). Covers borderless minimal, dark Catppuccin palette, per-tool
gradient headers, frosted glass, and a retro amber terminal look.

{{"demo": "ToolStylingB.js"}}

## Related

- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) — two-pane inbox layout
- [Split layout](/x/react-chat/material/examples/split-layout/) — place message list and composer in separate DOM zones
