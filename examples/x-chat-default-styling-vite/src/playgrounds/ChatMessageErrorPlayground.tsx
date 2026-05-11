import * as React from 'react';
import { Box } from '@mui/material';
import { ChatMessage } from '@mui/x-chat';
import type { ChatConversation, ChatMessage as ChatMessageEntity } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { MessageErrorEffect, ScopedChat } from './sharedProviders';
import { ChoiceControl, SwitchControl, TextControl } from './controls';
import { users } from '../data';

const conversation: ChatConversation = {
  id: 'error-playground',
  title: 'Error preview',
  participants: [users.me, users.assistant],
};

const message: ChatMessageEntity = {
  id: 'error-msg',
  conversationId: conversation.id,
  role: 'assistant',
  author: users.assistant,
  createdAt: '2026-05-03T10:00:00.000Z',
  status: 'error',
  parts: [{ type: 'text', text: 'This message failed to send.' }],
};

type ErrorCode = 'SEND_ERROR' | 'STREAM_ERROR' | 'HISTORY_ERROR' | 'REALTIME_ERROR';

export function ChatMessageErrorPlayground() {
  const [enabled, setEnabled] = React.useState(true);
  const [code, setCode] = React.useState<ErrorCode>('SEND_ERROR');
  const [retryable, setRetryable] = React.useState(true);
  const [text, setText] = React.useState('Could not reach the chat server.');

  return (
    <PlaygroundCard
      title="ChatMessageError"
      description="Inline error using palette.error tokens — rendered under failed messages."
      previewBackground="background.default"
      previewMinHeight={220}
      span={2}
      controls={
        <React.Fragment>
          <SwitchControl label="error enabled" checked={enabled} onChange={setEnabled} />
          <ChoiceControl<ErrorCode>
            label="code"
            value={code}
            options={['SEND_ERROR', 'STREAM_ERROR', 'HISTORY_ERROR', 'REALTIME_ERROR'] as const}
            onChange={setCode}
          />
          <TextControl label="message" value={text} onChange={setText} multiline rows={2} />
          <SwitchControl label="retryable" checked={retryable} onChange={setRetryable} />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[message]}
          activeConversationId={conversation.id}
        >
          <MessageErrorEffect
            messageId={message.id}
            enabled={enabled}
            errorCode={code}
            errorMessage={text}
            retryable={retryable}
          />
          <Box sx={{ width: '100%' }}>
            <ChatMessage messageId={message.id} />
          </Box>
        </ScopedChat>
      }
    />
  );
}
