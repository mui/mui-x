---
title: Chat - Confirmation
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Confirmation

<p class="description">Prompt the user to approve or deny an agent action before it runs.</p>

- `ChatConfirmation` renders as a warning card with a message and two action buttons.
- The card is owned by the consumer via `React.useState`—show it when the agent requests confirmation, and hide it after the user responds.
- Default labels are `'Confirm'` and `'Cancel'`; override them with `confirmLabel` and `cancelLabel`.

The demo below shows the confirmation card in action. Click **Delete files** or **Keep files** to see the result:

{{"demo": "Confirmation.js", "bg": "inline"}}

## Rendering the confirmation card

```tsx
<ChatConfirmation
  message="Are you sure you want to delete all files?"
  onConfirm={() => agent.confirm()}
  onCancel={() => agent.cancel()}
/>
```

## Customizing labels

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

## Connecting to the adapter

Hold the card visibility in `React.useState`.
Show the card when the agent triggers a confirmation step, and hide it once the user responds.
Use a `useRef`-based callback so the adapter closure always accesses the latest setter without recreating the adapter:

```tsx
const [pendingConfirmation, setPendingConfirmation] = React.useState(false);

const setConfirmRef = React.useRef(setPendingConfirmation);
setConfirmRef.current = setPendingConfirmation;

const adapter = React.useMemo(
  () => ({
    async sendMessage({ message }) {
      // … stream agent response …
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
        setPendingConfirmation(false); /* … */
      }}
      onCancel={() => setPendingConfirmation(false)}
    />
  );
}
```

## Relationship to tool-call approval

The built-in tool part `approval-requested` state handles the narrow case of approving a specific tool call—it renders inside the collapsible tool widget.
`ChatConfirmation` is a broader pattern for any human-in-the-loop checkpoint that doesn't require a structured tool invocation.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
