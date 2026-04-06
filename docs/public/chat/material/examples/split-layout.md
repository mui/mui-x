---
title: Chat - Split layout
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Split layout

<p class="description">Place <code>ChatMessageList</code> and <code>ChatComposer</code> in separate DOM zones. Only <code>ChatRoot</code> is needed to connect them.</p>

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
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
  ChatMessageInlineMeta,
  ChatMessageList,
} from '@mui/x-chat';
import { useMessageIds } from '@mui/x-chat-headless';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-headless';
import {
  createChunkStream,
  createTextResponseChunks,
  randomId,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const CONVERSATION_ID = randomId();

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const text = message.parts
      .map((p) => (p.type === 'text' ? p.text : ''))
      .filter(Boolean)
      .join('');
    return createChunkStream(
      createTextResponseChunks(randomId(), `You said: "${text}".`),
    );
  },
};

const initialMessages = [
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:58:00.000Z',
    text: 'The message list (left) and the composer (right) are siblings in the DOM — neither is nested inside the other.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'What connects them?',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:01:00.000Z',
    text: 'Only ChatRoot. Both components read from the same ChatProvider context, so they stay in sync regardless of where they live in the layout.',
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

// Left column — message display. Must be inside ChatRoot to call useMessageIds().
function MessagePane() {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    ({ id }: { id: string }) => (
      <ChatMessageGroup key={id} messageId={id}>
        <ChatMessage messageId={id}>
          <ChatMessageAvatar />
          <ChatMessageContent afterContent={<ChatMessageInlineMeta />} />
        </ChatMessage>
      </ChatMessageGroup>
    ),
    [],
  );

  return (
    <ChatConversation sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
      <ChatMessageList renderItem={renderItem} items={messageIds} />
    </ChatConversation>
  );
}

// Right column — composer. Sibling of MessagePane, still inside ChatRoot.
// ChatComposer uses useChatComposer() from the shared context.
function InputPane() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 280,
        flexShrink: 0,
        p: 2,
        gap: 1,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        Composer
      </Typography>
      <Typography variant="caption" color="text.disabled">
        Separate DOM zone — connected only via ChatRoot
      </Typography>
      <Divider />
      <Box sx={{ flex: 1 }} />
      <ChatComposer>
        <ChatComposerTextArea placeholder="Type a message…" />
        <ChatComposerToolbar>
          <ChatComposerSendButton aria-label="Send message">
            <SendIcon />
          </ChatComposerSendButton>
        </ChatComposerToolbar>
      </ChatComposer>
    </Box>
  );
}

export default function SplitLayout() {
  return (
    // ChatRoot provides the shared context for both MessagePane and InputPane.
    // display: contents collapses the root div so the Box controls layout.
    <ChatRoot
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialMessages={initialMessages}
      slotProps={{ root: { style: { display: 'contents' } } }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          boxSizing: 'border-box',
          '*, *::before, *::after': { boxSizing: 'inherit' },
        }}
      >
        {/* Zone A: message display — could be in main content, a panel, a modal */}
        <MessagePane />
        {/* Zone B: composer — could be in a toolbar, sidebar, or footer */}
        <InputPane />
      </Box>
    </ChatRoot>
  );
}

```

## How it works

`ChatRoot` sets up a `ChatProvider` context. Any descendant can read from that context
via hooks — regardless of where it sits in the DOM tree.

This means `ChatMessageList` and `ChatComposer` don't need to be siblings
or share a parent component. Place them wherever your layout requires:

```tsx
<ChatRoot adapter={adapter}>
  {/* Could be in main content, a drawer, or a modal */}
  <MessagePane /> {/* calls useMessageIds() */}
  {/* Could be in a toolbar, sidebar, or page footer */}
  <InputPane /> {/* ChatComposer uses useChatComposer() */}
</ChatRoot>
```

Both components stay in sync automatically because they share the same store.

## When to use this pattern

Use split layout when `ChatBox`'s default two-pane structure doesn't fit your product:

- Chat input lives in the app toolbar or page footer
- Message history is displayed in one panel while the send area is in another
- You are embedding chat into an existing layout that already manages its own structure

## See also

- [No conversation history](/x/react-chat/material/examples/no-conversation-history/) — compose a thread without `ChatBox`
- [Message feed](/x/react-chat/material/examples/message-feed/) — display-only embed with no input

## API

- [ChatRoot](/x/api/chat/chat-root/)
