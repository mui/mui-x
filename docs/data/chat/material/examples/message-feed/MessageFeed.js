'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {
  ChatConversation,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageMeta,
  ChatMessageList,
} from '@mui/x-chat';
import { useChat, useMessageIds } from '@mui/x-chat/headless';

import { ChatRoot } from '@mui/x-chat/unstyled';
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

const adapter = {
  async sendMessage({ message }) {
    const text = message.parts
      .map((p) => (p.type === 'text' ? p.text : ''))
      .filter(Boolean)
      .join('');
    return createChunkStream(
      createTextResponseChunks(randomId(), `Responding to: "${text}"`),
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
    text: 'This is a read-only message feed — no ChatComposer is rendered anywhere on the page.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'So how do new messages appear if there is no input?',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:01:00.000Z',
    text: 'Call useChat().sendMessage() directly. Use this pattern for transcripts, notification feeds, or copilot result panels.',
  }),
];

// Must be a child of ChatRoot to access the chat context via hooks.
function Feed() {
  const { sendMessage, isStreaming } = useChat();
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    ({ id }) => (
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

  const handleTrigger = () => {
    sendMessage({
      conversationId: CONVERSATION_ID,
      parts: [{ type: 'text', text: 'Show me another message.' }],
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Only the message list — no ChatComposer */}
      <ChatConversation sx={{ flex: 1, minHeight: 0 }}>
        <ChatMessageList renderItem={renderItem} items={messageIds} />
      </ChatConversation>
      <Divider />
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
        <Button
          size="small"
          variant="outlined"
          onClick={handleTrigger}
          disabled={isStreaming}
        >
          Trigger message
        </Button>
      </Box>
    </Box>
  );
}

export default function MessageFeed() {
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
        <Feed />
      </Box>
    </ChatRoot>
  );
}
