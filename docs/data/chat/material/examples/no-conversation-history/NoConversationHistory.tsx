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
  ChatMessageInlineMeta,
  ChatMessageList,
} from '@mui/x-chat';
import { useMessageIds } from '@mui/x-chat/headless';
import type { ChatAdapter } from '@mui/x-chat/headless';
import { ChatRoot } from '@mui/x-chat/headless';
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
    text: 'Hello! This thread is composed directly from individual components — no ChatBox, no header, no sidebar.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Got it. So I can pick exactly which parts to include?',
  }),
  createTextMessage({
    id: randomId(),
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
          <ChatMessageContent afterContent={<ChatMessageInlineMeta />} />
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
