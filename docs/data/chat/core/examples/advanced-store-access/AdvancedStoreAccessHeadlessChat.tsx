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
  const typingUserIds = useStore(store, chatSelectors.typingUserIdsForActiveConversation);
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
