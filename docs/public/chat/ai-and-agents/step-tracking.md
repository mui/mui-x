---
productId: x-chat
title: Step Tracking
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Step Tracking

<p class="description">Track multi-step agent progress using <code>start-step</code> and <code>finish-step</code> stream chunks that create visual delimiters in the message.</p>



Agentic AI workflows often involve multiple processing steps — reasoning, tool calls, intermediate results, and a final answer. Step tracking lets you visually delimit these phases in the message stream so users can follow the agent's progress.

## Step boundary chunks

The streaming protocol provides two chunks for step boundaries:

| Chunk type    | Description                 |
| :------------ | :-------------------------- |
| `start-step`  | Begin a new processing step |
| `finish-step` | End the current step        |

```ts
interface ChatStartStepChunk {
  type: 'start-step';
}

interface ChatFinishStepChunk {
  type: 'finish-step';
}
```

## `ChatStepStartMessagePart`

When a `start-step` chunk arrives, the runtime creates a `ChatStepStartMessagePart` on the assistant message:

```ts
interface ChatStepStartMessagePart {
  type: 'step-start';
}
```

The `finish-step` chunk signals the end of the current step but does not create a separate message part — it serves as a boundary marker in the stream.

## Streaming example

A typical agentic loop might produce multiple steps, each containing reasoning, tool calls, or text:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'msg-1' });

        // Step 1: Search for information
        controller.enqueue({ type: 'start-step' });
        controller.enqueue({
          type: 'tool-input-start',
          toolCallId: 'call-1',
          toolName: 'search',
        });
        controller.enqueue({
          type: 'tool-input-available',
          toolCallId: 'call-1',
          toolName: 'search',
          input: { query: 'MUI X Chat documentation' },
        });
        controller.enqueue({
          type: 'tool-output-available',
          toolCallId: 'call-1',
          output: { results: ['...'] },
        });
        controller.enqueue({ type: 'finish-step' });

        // Step 2: Analyze results
        controller.enqueue({ type: 'start-step' });
        controller.enqueue({
          type: 'tool-input-start',
          toolCallId: 'call-2',
          toolName: 'analyze',
        });
        controller.enqueue({
          type: 'tool-input-available',
          toolCallId: 'call-2',
          toolName: 'analyze',
          input: { data: '...' },
        });
        controller.enqueue({
          type: 'tool-output-available',
          toolCallId: 'call-2',
          output: { summary: '...' },
        });
        controller.enqueue({ type: 'finish-step' });

        // Step 3: Final answer
        controller.enqueue({ type: 'start-step' });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({
          type: 'text-delta',
          id: 'text-1',
          delta: 'Based on my research, here is the answer...',
        });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish-step' });

        controller.enqueue({ type: 'finish', messageId: 'msg-1' });
        controller.close();
      },
    });
  },
};
```

## Displaying step progress

The `step-start` parts act as delimiters in the message's `parts` array. You can render them as visual separators, progress indicators, or collapsible sections.

### Step delimiter renderer

Register a custom renderer for `step-start` parts:

```tsx
const renderers: ChatPartRendererMap = {
  'step-start': ({ index, message }) => {
    const stepNumber = message.parts
      .slice(0, index + 1)
      .filter((part) => part.type === 'step-start').length;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: '8px 0',
          color: 'gray',
          fontSize: '0.8em',
        }}
      >
        <div style={{ flex: 1, height: 1, background: 'lightgray' }} />
        <span>Step {stepNumber}</span>
        <div style={{ flex: 1, height: 1, background: 'lightgray' }} />
      </div>
    );
  },
};

<ChatProvider adapter={adapter} partRenderers={renderers}>
  <MyChat />
</ChatProvider>;
```

### Step progress with Material UI

For a more polished UI, use Material UI components to show step progress:

```tsx
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const renderers: ChatPartRendererMap = {
  'step-start': ({ index, message }) => {
    const stepNumber = message.parts
      .slice(0, index + 1)
      .filter((part) => part.type === 'step-start').length;
    return (
      <Divider sx={{ my: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Step {stepNumber}
        </Typography>
      </Divider>
    );
  },
};
```

## Step structure in the parts array

After streaming, the message's `parts` array contains `step-start` entries interleaved with the content parts for each step:

```ts
// Example parts array after streaming
[
  { type: 'step-start' }, // Step 1 delimiter
  {
    type: 'tool',
    toolInvocation: {
      /* ... */
    },
  }, // Step 1 content
  { type: 'step-start' }, // Step 2 delimiter
  {
    type: 'tool',
    toolInvocation: {
      /* ... */
    },
  }, // Step 2 content
  { type: 'step-start' }, // Step 3 delimiter
  { type: 'text', text: 'Final answer...' }, // Step 3 content
];
```

This structure makes it straightforward to group parts by step when building custom renderers. Iterate through the parts and treat each `step-start` as a new group boundary.

## Steps with reasoning and tool calls

Steps compose naturally with reasoning and tool calling. A single step can contain reasoning, one or more tool invocations, and text:

```tsx
// Step with reasoning + tool call
controller.enqueue({ type: 'start-step' });
controller.enqueue({ type: 'reasoning-start', id: 'r-1' });
controller.enqueue({
  type: 'reasoning-delta',
  id: 'r-1',
  delta: 'I need to look up the user data first.',
});
controller.enqueue({ type: 'reasoning-end', id: 'r-1' });
controller.enqueue({
  type: 'tool-input-start',
  toolCallId: 'call-1',
  toolName: 'get_user',
});
controller.enqueue({
  type: 'tool-input-available',
  toolCallId: 'call-1',
  toolName: 'get_user',
  input: { userId: '123' },
});
controller.enqueue({
  type: 'tool-output-available',
  toolCallId: 'call-1',
  output: { name: 'Alice', email: 'alice@example.com' },
});
controller.enqueue({ type: 'finish-step' });
```

## See also

- [Tool Calling](/x/react-chat/ai-and-agents/tool-calling/) for the tool invocation lifecycle within steps.
- [Reasoning](/x/react-chat/ai-and-agents/reasoning/) for displaying LLM thinking traces.
- [Streaming](/x/react-chat/behavior/streaming/) for the full chunk protocol reference including step boundary chunks.
- [Tool Approval](/x/react-chat/ai-and-agents/tool-approval/) for human-in-the-loop checkpoints within agent steps.
