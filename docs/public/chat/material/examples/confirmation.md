---
title: Chat - Confirmation
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Confirmation

<p class="description">Display a prominent human-in-the-loop checkpoint before the agent takes an irreversible action using <code>ChatConfirmation</code>.</p>

Click **Delete files** or **Keep files** to see the result.

- `ChatConfirmation` renders as a prominent warning card with a message and two action buttons
- The card is owned by the consumer via `React.useState` — show it when the agent requests confirmation, hide it after the user responds
- Default labels are `'Confirm'` and `'Cancel'`; override them with `confirmLabel` and `cancelLabel`

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox, ChatConfirmation } from '@mui/x-chat';
import {
  createChunkStream,
  createTextResponseChunks,
  randomId,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  demoUsers,
  minimalConversation,
  createTextMessage,
} from 'docsx/data/chat/material/examples/shared/demoData';

const CONVERSATION_ID = minimalConversation.id;

const INITIAL_MESSAGES = [
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    text: 'Delete all temporary files in the project.',
    createdAt: '2026-03-22T10:00:00.000Z',
    author: demoUsers.you,
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    text: 'I found 47 temporary files totalling 2.3 GB. Please confirm before I proceed — this action cannot be undone.',
    createdAt: '2026-03-22T10:01:00.000Z',
    author: demoUsers.agent,
  }),
];

type ConfirmationStatus = 'pending' | 'confirmed' | 'cancelled';

const RESULT_DISPLAY: Record<
  Exclude<ConfirmationStatus, 'pending'>,
  { text: string; color: string; borderColor: string }
> = {
  confirmed: {
    text: 'Files deleted successfully.',
    color: 'success.main',
    borderColor: 'success.main',
  },
  cancelled: {
    text: 'Action cancelled — files kept.',
    color: 'text.secondary',
    borderColor: 'divider',
  },
};

export default function Confirmation() {
  const [status, setStatus] = React.useState<ConfirmationStatus>('pending');

  const adapter = React.useMemo(
    () => ({
      async sendMessage() {
        const messageId = randomId();
        return createChunkStream(
          createTextResponseChunks(
            messageId,
            'Got it — what else can I help with?',
            {
              author: demoUsers.agent,
            },
          ),
          { delayMs: 60 },
        );
      },
    }),
    [],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: 560 }}>
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={CONVERSATION_ID}
        initialConversations={[minimalConversation]}
        initialMessages={INITIAL_MESSAGES}
        sx={{
          flex: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
      {status === 'pending' && (
        <ChatConfirmation
          message="Delete 47 temporary files (2.3 GB)? This action cannot be undone."
          confirmLabel="Delete files"
          cancelLabel="Keep files"
          onConfirm={() => setStatus('confirmed')}
          onCancel={() => setStatus('cancelled')}
        />
      )}
      {status !== 'pending' && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: RESULT_DISPLAY[status].borderColor,
          }}
        >
          <Typography variant="body2" color={RESULT_DISPLAY[status].color}>
            {RESULT_DISPLAY[status].text}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

```

## Basic usage

```tsx
<ChatConfirmation
  message="Are you sure you want to delete all files?"
  onConfirm={() => agent.confirm()}
  onCancel={() => agent.cancel()}
/>
```

## Custom labels

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

Hold the card visibility in `React.useState`. Show the card when the agent triggers a confirmation step, and hide it once the user responds. Use a `useRef`-based callback so the adapter closure always accesses the latest setter without recreating the adapter:

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

The built-in tool part `approval-requested` state handles the narrow case of approving a specific tool call — it renders inside the collapsible tool widget. `ChatConfirmation` is a broader, more prominent pattern for any "human-in-the-loop" checkpoint that doesn't require a structured tool invocation.

## API

- [ChatRoot](/x/api/chat/chat-root/)
