---
title: Chat - Error state
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Error state

How the ChatBox behaves when the adapter throws an error during message sending.

This example uses a failing adapter that always throws an error, demonstrating how errors propagate through `onError`.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { minimalConversation, minimalMessages, demoUsers } from '../shared/demoData';
import type { ChatAdapter } from '@mui/x-chat/headless';

const demoMembers = [demoUsers.you, demoUsers.agent];

const failingAdapter: ChatAdapter = {
  async sendMessage() {
    // Simulate network delay then fail
    await new Promise((resolve) => {
      setTimeout(resolve, 800);
    });
    throw new Error(
      'Network error: Unable to reach the server. Please check your connection.',
    );
  },
};

export default function ErrorState() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  return (
    <div style={{ width: '100%' }}>
      <ChatBox
        adapter={failingAdapter}
        members={demoMembers}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        onError={(error) => {
          setErrorMessage(
            error instanceof Error ? error.message : 'An unknown error occurred',
          );
        }}
        sx={{
          height: 460,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
      {errorMessage && (
        <div
          role="alert"
          style={{
            marginTop: 8,
            padding: '8px 16px',
            backgroundColor: '#fdeded',
            color: '#5f2120',
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          Error: {errorMessage}
        </div>
      )}
    </div>
  );
}

```

## What it shows

- Adapter that throws an error on every `sendMessage` call
- `onError` callback capturing the error
- External error display below the ChatBox
- User message still appears in the thread (optimistic update)
- Composer is re-enabled after the error
