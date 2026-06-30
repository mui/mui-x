---
productId: x-chat
title: Reasoning
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Reasoning

<p class="description">Display chain-of-thought reasoning traces from LLMs alongside streamed chat responses.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Many large language models expose a "thinking" or "reasoning" trace alongside their final response.
The Chat component supports streaming and displaying this reasoning content through dedicated chunk types and a specialized message part.
Reasoning parts render automatically as a collapsible "Thinking…" section — no configuration required.

## Default rendering

Reasoning parts render automatically — you don't need to register a renderer to display them.
The built-in renderer is a native `<details>`/`<summary>` disclosure that stays open while `state` is `'streaming'` (showing a "Thinking…" label), then collapses to a clickable "Reasoning" summary once the reasoning is `'done'`.

{{"demo": "ReasoningStreamingDemo.js", "bg": "inline", "defaultCodeOpen": false}}

### Labels

The summary text comes from two `localeText` keys: `messageReasoningStreamingLabel` (`'Thinking…'`, shown while streaming) and `messageReasoningLabel` (`'Reasoning'`, shown once done).
Localize or override them through the `localeText` prop.
The Material layer styles the disclosure's three slots — `root`, `summary`, and `content` — and the summary icon carries the `MuiChatMessage-ReasoningIcon` class.

## Reasoning part structure

When reasoning chunks arrive during streaming, the runtime creates a `ChatReasoningMessagePart` on the assistant message:

```ts
interface ChatReasoningMessagePart {
  type: 'reasoning';
  text: string;
  state?: ChatMessagePartStatus; // 'streaming' | 'done'
}
```

| Field   | Type                    | Description                                   |
| :------ | :---------------------- | :-------------------------------------------- |
| `type`  | `'reasoning'`           | Identifies this as a reasoning part           |
| `text`  | `string`                | The accumulated reasoning text                |
| `state` | `'streaming' \| 'done'` | Whether the reasoning is still being streamed |

The `state` field transitions from `'streaming'` while deltas are arriving to `'done'` once the reasoning section is complete.
The [built-in renderer](#default-rendering) uses this to keep the disclosure expanded and show a live "Thinking…" label while deltas arrive — use `state` (or the `streaming` ownerState flag in slots) the same way in custom UIs.

## Customizing the reasoning slots

The built-in renderer already displays reasoning in a collapsible section above the response text.
To change its appearance, override the reasoning slots — `root`, `summary`, and `content` — instead of re-implementing the disclosure.

With a Material `ChatBox`, target the slots through `slotProps.messageContent`:

```tsx
slotProps={{
  messageContent: {
    partProps: { reasoning: { slots: { summary: MySummary } } },
  },
}}
```

In a composable layout, pass `partProps` directly on `ChatMessage.Content` (or `ChatMessageContent`).

Slot components receive `ownerState: ReasoningPartOwnerState` (`{ messageId, role, streaming }`) — read `ownerState.streaming` for a pulsing or live affordance while the model is thinking.
Import the type from `@mui/x-chat/headless`:

```tsx
import type { ReasoningPartOwnerState } from '@mui/x-chat/headless';
```

Partial overrides keep the remaining Material defaults, because the slot maps are merged: a `summary`-only override still uses the default `root` and `content`.

{{"demo": "ReasoningSlotsDemo.js", "bg": "inline", "defaultCodeOpen": true}}

See the [`ChatMessageContent` API](/x/api/chat/chat-message-content/) for the full `partProps` shape.

## Replacing the renderer

To replace the rendering entirely — rather than restyle the built-in disclosure — register a `partRenderers.reasoning` renderer.
`partRenderers` is accepted by `<ChatBox />` directly, so Material users don't need `ChatProvider`:

```tsx
import { ChatProvider, type ChatPartRendererMap } from '@mui/x-chat-headless';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

const renderers: ChatPartRendererMap = {
  reasoning: ({ part }) => (
    <Accordion
      defaultExpanded={part.state === 'streaming'}
      sx={{ my: 1, bgcolor: 'action.hover' }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption" color="text.secondary">
          {part.state === 'streaming' ? 'Thinking…' : 'Reasoning'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {part.text}
        </Typography>
      </AccordionDetails>
    </Accordion>
  ),
};

<ChatProvider adapter={adapter} partRenderers={renderers}>
  {/* your chat UI */}
</ChatProvider>;
```

Unlike the built-in renderer — which controls the `open` state and auto-collapses when reasoning finishes — this uncontrolled Accordion only starts expanded when it mounts mid-stream.

:::warning
The default renderer uses a native `<details>`/`<summary>` disclosure, which is keyboard-operable and integrates with the message list's roving focus.
If you replace it, preserve an equivalent accessible disclosure pattern.
See [Accessibility](/x/react-chat/accessibility/) for details.
:::

## Showing and hiding reasoning

Control whether reasoning is visible to the user by filtering parts in your renderer.
You can use a prop, a context value, or application state to toggle visibility.

Renderers receive `{ part, message, index, onToolCall }` — `showReasoning` here is application state that the renderer closes over, not a prop injected by the runtime.
Returning `null` hides the part; delegating to the exported `ReasoningPart` keeps the built-in disclosure when visible:

```tsx
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { ReasoningPart, type ChatPartRendererMap } from '@mui/x-chat/headless';

function MyChat() {
  const [showReasoning, setShowReasoning] = React.useState(true);

  const renderers: ChatPartRendererMap = React.useMemo(
    () => ({
      reasoning: (props) => (showReasoning ? <ReasoningPart {...props} /> : null),
    }),
    [showReasoning],
  );

  return (
    <ChatBox
      adapter={adapter}
      partRenderers={renderers} /* + a toggle for setShowReasoning */
    />
  );
}
```

## Reasoning stream chunks

Reasoning content is streamed using a triplet of chunks, following the same pattern as text chunks:

| Chunk type        | Fields        | Description                 |
| :---------------- | :------------ | :-------------------------- |
| `reasoning-start` | `id`          | Begin a reasoning part      |
| `reasoning-delta` | `id`, `delta` | Append reasoning content    |
| `reasoning-end`   | `id`          | Finalize the reasoning part |

### How chunks become parts

1. `reasoning-start` creates a new `ChatReasoningMessagePart` with `state: 'streaming'`.
2. `reasoning-delta` appends the `delta` text to the existing reasoning part.
3. `reasoning-end` sets `state: 'done'`.

Multiple `reasoning-delta` chunks are batched according to `streamFlushInterval` before being applied to the store, just like text deltas.

### Streaming example

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'msg-1' });

        // Reasoning section
        controller.enqueue({ type: 'reasoning-start', id: 'reasoning-1' });
        controller.enqueue({
          type: 'reasoning-delta',
          id: 'reasoning-1',
          delta: 'The user is asking about weather in Paris. ',
        });
        controller.enqueue({
          type: 'reasoning-delta',
          id: 'reasoning-1',
          delta: 'I should check the current forecast data.',
        });
        controller.enqueue({ type: 'reasoning-end', id: 'reasoning-1' });

        // Text response
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({
          type: 'text-delta',
          id: 'text-1',
          delta: 'The weather in Paris is currently 22 degrees and sunny.',
        });
        controller.enqueue({ type: 'text-end', id: 'text-1' });

        controller.enqueue({ type: 'finish', messageId: 'msg-1' });
        controller.close();
      },
    });
  },
};
```

## Reasoning alongside tool calls

Reasoning chunks can appear before, between, or after tool invocations in the same stream.
The runtime handles interleaving correctly—each chunk type creates its own message part in the order it arrives:

```tsx
// Stream order:
// 1. reasoning-start -> reasoning-delta -> reasoning-end  (thinking)
// 2. tool-input-start -> tool-input-available             (tool call)
// 3. reasoning-start -> reasoning-delta -> reasoning-end  (thinking about result)
// 4. tool-output-available                                (tool result)
// 5. text-start -> text-delta -> text-end                 (final answer)
```

The resulting message has five parts in order: reasoning, tool, reasoning, tool (updated), text.

## See also

- [Tool calling](/x/react-chat/ai-and-agents/tool-calling/) for details on the tool invocation lifecycle.
- [Step tracking](/x/react-chat/ai-and-agents/step-tracking/) for details on multi-step agent progress.
- [Streaming](/x/react-chat/behavior/streaming/) for the full chunk protocol reference, including reasoning chunks.
