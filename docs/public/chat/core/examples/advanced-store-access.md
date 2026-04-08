---
title: Chat - Advanced store access
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Advanced store access

Use the store escape hatch to subscribe to exactly the runtime slices you want.

This demo is intentionally advanced.
It demonstrates how to bypass the convenience hooks and work directly with the normalized store for custom dashboards, metrics, or highly specialized derived views:

- `useChatStore()` to get the underlying store instance
- `chatSelectors` to read specific store slices
- custom selector subscriptions for derived values

## Key concepts

### Getting the store

`useChatStore()` returns the `ChatStore<Cursor>` instance created by `ChatProvider`:

```tsx
import { useChatStore, chatSelectors } from '@mui/x-chat/headless';
import { useStore } from '@mui/x-internals/store';

function Dashboard() {
  const store = useChatStore();
  const messageCount = useStore(store, chatSelectors.messageCount);
  const conversationCount = useStore(store, chatSelectors.conversationCount);
  const isStreaming = useStore(store, chatSelectors.isStreaming);

  return (
    <div>
      <span>{messageCount} messages</span>
      <span>{conversationCount} conversations</span>
      <span>{isStreaming ? 'Streaming' : 'Idle'}</span>
    </div>
  );
}
```

### Parameterized selectors

Some selectors accept arguments.
Pass them as additional arguments to `useStore()`:

```tsx
// Single message by ID
const message = useStore(store, chatSelectors.message, 'msg-42');

// Single conversation by ID
const conversation = useStore(store, chatSelectors.conversation, 'support');

// Typing users in a specific conversation
const typingUserIds = useStore(store, chatSelectors.typingUserIds, 'support');

// Typing users in the active conversation (no conversationId needed)
const activeTypingUserIds = useStore(store, chatSelectors.typingUserIdsForActiveConversation);
```

### When to use direct store access

Use `useChatStore()` + `chatSelectors` when:

- you need a derived value that no built-in hook provides (e.g., message count, active conversation title)
- you are building a metrics dashboard or debug panel
- you need to subscribe to store changes outside the React render cycle
- you want to combine multiple selectors into a single subscription

For standard rendering, the built-in hooks (`useChat()`, `useMessageIds()`, `useMessage()`, etc.) are easier and sufficient.

```tsx
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import {
  ChatProvider,
  chatSelectors,
  useChat,
  useChatComposer,
  useChatStore,
  type ChatAdapter,
} from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
  cloneConversations,
  demoConversations,
  demoThreads,
  demoUsers,
} from 'docsx/data/chat/core/examples/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
} from 'docsx/data/chat/core/examples/shared/demoUtils';

const adapter: ChatAdapter = {
  async sendMessage({ conversationId }) {
    return createChunkStream(
      createTextResponseChunks(
        `advanced-${conversationId}`,
        'The store escape hatch lets you build custom dashboards with chatSelectors.',
      ),
      { delayMs: 160 },
    );
  },
};

function AdvancedMetrics() {
  const store = useChatStore();
  const messageCount = useStore(store, chatSelectors.messageCount);
  const conversationCount = useStore(store, chatSelectors.conversationCount);
  const activeConversation = useStore(store, chatSelectors.activeConversation);
  const composerValue = useStore(store, chatSelectors.composerValue);
  const typingUserIds = useStore(store, chatSelectors.typingUserIds);
  const { messages, sendMessage, setActiveConversation } = useChat();
  const composer = useChatComposer();

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Store escape hatch
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The runtime stays headless, but advanced consumers can subscribe to exactly
          the slices they need.
        </Typography>
      </Box>

      {/* Stats row */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {[
            { label: 'Messages', value: messageCount },
            { label: 'Conversations', value: conversationCount },
            { label: 'Active title', value: activeConversation?.title ?? 'none' },
            { label: 'Composer value', value: composerValue || 'empty' },
            { label: 'Typing users', value: typingUserIds.join(', ') || 'none' },
          ].map((stat) => (
            <Paper
              key={stat.label}
              variant="outlined"
              sx={{ p: 1.5, minWidth: 100, flex: '1 1 auto' }}
            >
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Stack>

        {/* Action buttons */}
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              store.setTypingUser(
                activeConversation?.id ?? 'support',
                demoUsers.alice.id,
                true,
              );
            }}
          >
            Simulate typing
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              store.setTypingUser(
                activeConversation?.id ?? 'support',
                demoUsers.alice.id,
                false,
              );
            }}
          >
            Clear typing
          </Button>
        </Stack>
      </Box>

      {/* Message list */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 160,
          maxHeight: 320,
          overflow: 'auto',
          px: 2,
          pb: 2,
        }}
      >
        {messages.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 4 }}
          >
            No messages yet.
          </Typography>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <Paper
                key={message.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  maxWidth: '85%',
                  borderRadius: 3,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  bgcolor: isUser ? 'primary.main' : 'grey.100',
                  color: isUser ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 0.5,
                    color: isUser ? 'rgba(255,255,255,0.82)' : 'text.secondary',
                  }}
                >
                  <strong>{message.author?.displayName ?? message.role}</strong>
                  {message.status ? ` · ${message.status}` : ''}
                </Typography>
                {message.parts.map((part, index) => (
                  <Typography
                    variant="body2"
                    key={`${message.id}-${part.type}-${index}`}
                  >
                    {'text' in part ? part.text : JSON.stringify(part)}
                  </Typography>
                ))}
              </Paper>
            );
          })
        )}
      </Box>

      {/* Input area */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
      >
        <TextField
          size="small"
          fullWidth
          value={composer.value}
          onChange={(event) => composer.setValue(event.target.value)}
          placeholder="Type a message..."
        />
        <Button
          variant="contained"
          onClick={() =>
            void sendMessage({
              conversationId: activeConversation?.id ?? 'support',
              author: demoUsers.alice,
              parts: [
                { type: 'text', text: composer.value || 'Store-driven message' },
              ],
            })
          }
        >
          <SendRoundedIcon fontSize="small" />
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            void setActiveConversation(
              activeConversation?.id === 'support' ? 'product' : 'support',
            );
          }}
        >
          Toggle conversation
        </Button>
      </Stack>
    </Paper>
  );
}

export default function AdvancedStoreAccessHeadlessChat() {
  return (
    <ChatProvider
      adapter={adapter}
      initialConversations={cloneConversations(demoConversations.slice(0, 2))}
      initialActiveConversationId="support"
      initialMessages={[...demoThreads.support, ...demoThreads.product]}
      initialComposerValue="Track this with a custom selector."
    >
      <AdvancedMetrics />
    </ChatProvider>
  );
}
```

## Key takeaways

- `useChatStore()` is the escape hatch for advanced store access
- `chatSelectors` provides memoized selectors for all store slices
- Combine with `useStore()` for React subscriptions or use the store directly for imperative access
- Prefer the built-in hooks for standard use cases — they wrap these selectors with a better developer experience

## See also

- [Selectors](/x/react-chat/core/selectors/) for the full selector reference
- [Hooks](/x/react-chat/core/hooks/) for the convenience hooks that wrap these selectors
- [State and store](/x/react-chat/core/state/) for the normalized store internals
- [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/) for the `useMessageIds()` + `useMessage(id)` pattern

## API

- [ChatRoot](/x/api/chat/chat-root/)
