---
title: Chat - No conversation history
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# No conversation history

<p class="description"><code>ChatBox</code> hides the conversation list when neither the adapter nor a prop supplies conversation data.</p>

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatConversation,
  ChatComposer,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageMeta,
  ChatMessageList,
} from '@mui/x-chat';
import { useMessageIds } from '@mui/x-chat/headless';
import type { ChatAdapter } from '@mui/x-chat/headless';
import { ChatRoot } from '@mui/x-chat/unstyled';
import { nanoid } from 'nanoid';
import { createChunkStream, createTextResponseChunks } from '../shared/demoUtils';
import { createTextMessage, demoUsers } from '../shared/demoData';

const CONVERSATION_ID = nanoid();

// Adapter has only `sendMessage` — no `listConversations` or `listMessages`.
// ChatBox cannot fetch conversation history, and no `conversations` prop is passed,
// so the conversation list panel is never rendered.
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const text = message.parts
      .map((p) => (p.type === 'text' ? p.text : ''))
      .filter(Boolean)
      .join('');
    return createChunkStream(
      createTextResponseChunks(nanoid(), `You said: "${text}".`),
    );
  },
};

const initialMessages = [
  createTextMessage({
    id: nanoid(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:58:00.000Z',
    text: 'Hello! This thread is composed directly from individual components — no ChatBox, no header, no sidebar.',
  }),
  createTextMessage({
    id: nanoid(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Got it. So I can pick exactly which parts to include?',
  }),
  createTextMessage({
    id: nanoid(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:01:00.000Z',
    text: 'Exactly. Use ChatRoot for the context, then add only the pieces you need — message list, composer, or a header if you want one.',
  }),
];

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

// Must be a child of ChatRoot so it can access the chat context.
function ThreadContent() {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    ({ id }: { id: string }) => (
      <ChatMessageGroup key={id} messageId={id}>
        <ChatMessage messageId={id}>
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
        </ChatMessage>
      </ChatMessageGroup>
    ),
    [],
  );

  return (
    <ChatConversation>
      <ChatMessageList renderItem={renderItem} items={messageIds} />
      <ChatComposer>
        <ChatComposerTextArea placeholder="Type a message…" />
        <ChatComposerToolbar>
          <ChatComposerSendButton aria-label="Send message">
            <SendIcon />
          </ChatComposerSendButton>
        </ChatComposerToolbar>
      </ChatComposer>
    </ChatConversation>
  );
}

export default function NoConversationHistory() {
  return (
    // ChatRoot provides the chat context (adapter, state, hooks).
    // display: contents collapses the root div so the Box controls layout.
    <ChatRoot
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialMessages={initialMessages}
      slotProps={{ root: { style: { display: 'contents' } } }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 460,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          boxSizing: 'border-box',
          '*, *::before, *::after': { boxSizing: 'inherit' },
        }}
      >
        <ThreadContent />
      </Box>
    </ChatRoot>
  );
}

```

## How it works

`ChatBox` gates the conversation list on a single condition: whether the internal `conversations` array has any items.

There are exactly two ways to populate that array:

1. **Controlled or uncontrolled state** — pass `conversations` / `initialConversations` props to `ChatBox`.
2. **Adapter** — implement `listConversations?()` on the adapter so `ChatBox` can fetch history from a backend.

When neither is present, the array stays empty and `ChatBox` skips rendering the list panel entirely. The thread fills the full width automatically — no extra configuration needed.

```tsx
// Adapter with no `listConversations` — history cannot be fetched
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return streamResponse(message);
  },
};

// No `conversations` or `initialConversations` prop — state stays empty
<ChatBox adapter={adapter} />;
```

## When this is the right choice

Use this pattern when:

- Your backend has no conversation history API (e.g., a stateless AI endpoint).
- The product intentionally gives users a fresh thread each session.
- You are building an embedded copilot or assistant that lives inside another page and doesn't need a sidebar.

## Restoring the conversation list

To show the conversation list, provide at least one of the two sources:

**Via props (uncontrolled):**

```tsx
<ChatBox
  adapter={adapter}
  initialConversations={[{ id: 'main', title: 'My chat' }]}
  initialActiveConversationId="main"
/>
```

**Via adapter (fetched from backend):**

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    /* ... */
  },
  async listConversations() {
    const data = await fetch('/api/conversations').then((r) => r.json());
    return { conversations: data };
  },
};
```

## Next steps

- See [Thread-only](/x/react-chat/material/examples/thread-only/) for a layout-focused view of the single-pane pattern.
- See [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for the full two-pane inbox with a conversation sidebar.
