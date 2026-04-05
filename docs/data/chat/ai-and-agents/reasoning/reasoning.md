---
productId: x-chat
title: Reasoning
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Reasoning

<p class="description">Display the LLM's chain-of-thought or thinking trace using <code>ChatReasoningMessagePart</code> and the reasoning stream chunks.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

Many large language models expose a "thinking" or "reasoning" trace alongside their final response. The Chat component supports streaming and displaying this reasoning content through dedicated chunk types and a specialized message part.

## `ChatReasoningMessagePart`

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

## Displaying reasoning in a collapsible section

Reasoning content is typically displayed in a collapsible section above the main response text. Register a custom renderer for reasoning parts to control the presentation:

```tsx
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

const renderers: ChatPartRendererMap = {
  reasoning: ({ part }) => (
    <Accordion defaultExpanded={false} sx={{ my: 1, bgcolor: 'action.hover' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption" color="text.secondary">
          {part.state === 'streaming' ? 'Thinking...' : 'Reasoning'}
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
  <MyChat />
</ChatProvider>;
```

## Show/hide configuration

Control whether reasoning is visible to the user by filtering parts in your renderer. You can use a prop, a context value, or application state to toggle visibility:

```tsx
function ReasoningPart({ part, showReasoning }) {
  if (!showReasoning) return null;

  return (
    <div style={{ opacity: 0.7, fontSize: '0.85em', fontStyle: 'italic' }}>
      <details>
        <summary>
          {part.state === 'streaming' ? 'Thinking...' : 'Show reasoning'}
        </summary>
        <p>{part.text}</p>
      </details>
    </div>
  );
}

// Register with a configurable toggle
const renderers: ChatPartRendererMap = {
  reasoning: ({ part }) => (
    <ReasoningPart part={part} showReasoning={userPreferences.showReasoning} />
  ),
};
```

## Reasoning alongside tool calls

Reasoning chunks can appear before, between, or after tool invocations in the same stream. The runtime handles interleaving correctly — each chunk type creates its own message part in the order it arrives:

```tsx
// Stream order:
// 1. reasoning-start -> reasoning-delta -> reasoning-end  (thinking)
// 2. tool-input-start -> tool-input-available             (tool call)
// 3. reasoning-start -> reasoning-delta -> reasoning-end  (thinking about result)
// 4. tool-output-available                                (tool result)
// 5. text-start -> text-delta -> text-end                 (final answer)
```

This produces a message with five parts in order: reasoning, tool, reasoning, tool (updated), text.

## API

- [`ChatMessageContent`](/x/api/chat/chat-message-content/)

## See also

- [Tool Calling](/x/react-chat/ai-and-agents/tool-calling/) for the tool invocation lifecycle.
- [Step Tracking](/x/react-chat/ai-and-agents/step-tracking/) for multi-step agent progress tracking.
- [Streaming](/x/react-chat/behavior/streaming/) for the full chunk protocol reference including reasoning chunks.
