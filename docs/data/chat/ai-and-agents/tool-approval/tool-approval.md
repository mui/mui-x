---
productId: x-chat
title: Tool Approval
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatConfirmation
---

# Chat - Tool Approval

<p class="description">Add human-in-the-loop checkpoints to review and approve or deny agent tool calls before they execute.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Tool approval lets you pause the agent when it requests a potentially dangerous action, present the user with an approval interface, and resume or cancel the tool execution based on the user's decision.

## Approval workflow

The approval lifecycle extends the standard tool invocation states with two additional phases:

| State                | Description                           |
| :------------------- | :------------------------------------ |
| `input-streaming`    | Tool input JSON is being streamed     |
| `input-available`    | Tool input is fully available         |
| `approval-requested` | Stream pauses—user approval is needed |
| `approval-responded` | User has responded, stream continues  |
| `output-available`   | Tool output is ready (if approved)    |
| `output-denied`      | User denied the tool call             |

The stream pauses at `approval-requested` until your UI calls `addToolApprovalResponse()`.

## Triggering an approval request

When the backend determines a tool call needs user approval, it sends a `tool-approval-request` chunk:

```ts
controller.enqueue({
  type: 'tool-approval-request',
  toolCallId: 'call-1',
  toolName: 'delete_files',
  input: { path: '/tmp/data', recursive: true },
  approvalId: 'approval-1', // optional, defaults to toolCallId
});
```

| Field        | Type                  | Description                          |
| :----------- | :-------------------- | :----------------------------------- |
| `toolCallId` | `string`              | The tool invocation being gated      |
| `toolName`   | `string`              | Name of the tool requesting approval |
| `input`      | `object`              | The tool's input, shown to the user  |
| `approvalId` | `string \| undefined` | Optional distinct approval ID        |

When this chunk arrives, the tool invocation moves to `state: 'approval-requested'`.

## Implementing approval responses

Implement `addToolApprovalResponse` on your adapter to send the user's decision to the backend:

```ts
interface ChatAddToolApproveResponseInput {
  id: string; // the approval request ID from the stream chunk
  approved: boolean; // true = approved, false = denied
  reason?: string; // optional reason surfaced to the model when denied
}
```

```tsx
async addToolApprovalResponse({ id, approved, reason }) {
  await fetch('/api/tool-approval', {
    method: 'POST',
    body: JSON.stringify({ id, approved, reason }),
  });
},
```

## Responding to approval requests in the UI

Use `useChat()` to call `addToolApprovalResponse` from your component:

```tsx
const { addToolApprovalResponse } = useChat();

// Approve
await addToolApprovalResponse({
  id: toolCall.toolCallId,
  approved: true,
});

// Deny with reason
await addToolApprovalResponse({
  id: toolCall.toolCallId,
  approved: false,
  reason: 'User declined the operation',
});
```

After responding, the tool invocation moves to `state: 'approval-responded'`, and the stream continues.
If approved, the tool proceeds to execution and eventually reaches `output-available`.
If denied, the tool moves to `output-denied`.

## Prompting the user for confirmation

`ChatConfirmation` renders a prominent warning card with a message and two action buttons for human-in-the-loop checkpoints:

```tsx
import { ChatConfirmation } from '@mui/x-chat';

<ChatConfirmation
  message="Are you sure you want to delete all files?"
  onConfirm={() => agent.confirm()}
  onCancel={() => agent.cancel()}
/>;
```

### Custom labels

Use `confirmLabel` and `cancelLabel` to tailor the button text to the action:

```tsx
<ChatConfirmation
  message="Send this email on your behalf?"
  confirmLabel="Send email"
  cancelLabel="Cancel"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

### Connecting to the adapter

Hold the card visibility in `React.useState`.
Show the card when the agent triggers a confirmation step, and hide it once the user responds:

```tsx
const [pendingConfirmation, setPendingConfirmation] = React.useState(false);

const setConfirmRef = React.useRef(setPendingConfirmation);
setConfirmRef.current = setPendingConfirmation;

const adapter = React.useMemo(
  () => ({
    async sendMessage({ message }) {
      // ... stream agent response ...
      // Signal that a confirmation is needed:
      setConfirmRef.current(true);
      return responseStream;
    },
  }),
  [],
);

// In your JSX:
{
  pendingConfirmation && (
    <ChatConfirmation
      message="Proceed with this action?"
      onConfirm={() => {
        setPendingConfirmation(false);
        /* approve the tool */
      }}
      onCancel={() => setPendingConfirmation(false)}
    />
  );
}
```

## Relationship to tool-call approval

The built-in tool part `approval-requested` state handles the narrow case of approving a specific tool call—it renders inside the collapsible tool widget.
`ChatConfirmation` is a broader, more prominent pattern for any human-in-the-loop checkpoint that does not require a structured tool invocation.

Use the stream-based `tool-approval-request` when:

- The approval is tied to a specific tool invocation
- You want the approval UI inline within the message
- The backend needs to resume the stream after approval

Use `ChatConfirmation` when:

- You need a prominent, page-level confirmation dialog
- The confirmation is not tied to a specific tool call
- You want full control over the confirmation UI and flow

## Registering custom renderers for tool approval

Register a renderer that handles the `approval-requested` state inside tool parts:

```tsx
const renderers: ChatPartRendererMap = {
  tool: ({ part, message, index }) => {
    const { toolInvocation } = part;

    if (toolInvocation.state === 'approval-requested') {
      return (
        <ApprovalCard
          toolName={toolInvocation.toolName}
          input={toolInvocation.input}
          onApprove={() =>
            addToolApprovalResponse({
              id: toolInvocation.toolCallId,
              approved: true,
            })
          }
          onDeny={(reason) =>
            addToolApprovalResponse({
              id: toolInvocation.toolCallId,
              approved: false,
              reason,
            })
          }
        />
      );
    }

    return <ToolCard invocation={toolInvocation} />;
  },
};

<ChatProvider adapter={adapter} partRenderers={renderers}>
  <MyChat />
</ChatProvider>;
```

## See also

- [Tool calling](/x/react-chat/ai-and-agents/tool-calling/) for the full tool invocation lifecycle and chunk protocol.
- [Adapter](/x/react-chat/backend/adapters/) for the `addToolApprovalResponse()` method reference.
- [Streaming](/x/react-chat/behavior/streaming/) for the `tool-approval-request` chunk type.
- [Reasoning](/x/react-chat/ai-and-agents/reasoning/) for displaying LLM thinking alongside tool calls.
