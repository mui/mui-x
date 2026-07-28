import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatMessage } from '@mui/x-chat';
import type {
  ChatConversation,
  ChatMessage as ChatMessageEntity,
} from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  MessageErrorEffect,
  ScopedChat,
} from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  ChoiceControl,
  DividerLabel,
  SwitchControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation: ChatConversation = {
  id: 'error-playground',
  title: 'Error preview',
  participants: [users.me, users.assistant],
};

const message: ChatMessageEntity = {
  // A user message: the built-in retry button only renders for user messages
  // (retrying re-sends the original prompt), so the `retryable` toggle below is
  // only meaningful here.
  id: 'error-msg',
  conversationId: conversation.id,
  role: 'user',
  author: users.me,
  createdAt: '2026-05-03T10:00:00.000Z',
  status: 'error',
  parts: [{ type: 'text', text: 'This message failed to send.' }],
};

type ErrorCode = 'SEND_ERROR' | 'STREAM_ERROR' | 'HISTORY_ERROR' | 'REALTIME_ERROR';

type ClassKey = 'root' | 'message' | 'retryButton';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'The error card root element.' },
  {
    name: 'message',
    selector: '.MuiChatMessageError-message',
    description: 'The error message text.',
  },
  {
    name: 'retryButton',
    selector: '.MuiChatMessageError-retryButton',
    description: 'The retry button.',
  },
];

export default function ChatMessageErrorPlayground() {
  const [enabled, setEnabled] = React.useState(true);
  const [code, setCode] = React.useState<ErrorCode>('SEND_ERROR');
  const [retryable, setRetryable] = React.useState(true);
  const [text, setText] = React.useState('Could not reach the chat server.');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const errorRowSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageError"
      description="Inline error using palette.error tokens — rendered under failed messages."
      previewMinHeight={220}
      span={2}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>state (message error)</DividerLabel>
          <SwitchControl
            label="error enabled"
            checked={enabled}
            onChange={setEnabled}
            helperText="Toggles store.setMessageError(messageId, …)."
          />
          <ChoiceControl<ErrorCode>
            label="code"
            value={code}
            options={
              [
                'SEND_ERROR',
                'STREAM_ERROR',
                'HISTORY_ERROR',
                'REALTIME_ERROR',
              ] as const
            }
            onChange={setCode}
          />
          <TextControl
            label="message"
            value={text}
            onChange={setText}
            multiline
            rows={2}
          />
          <SwitchControl
            label="retryable"
            checked={retryable}
            onChange={setRetryable}
            helperText="Drives whether the retry button is rendered."
          />
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
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              ...errorRowSx,
            }}
          >
            {/*
              The retry button rendered inside ChatMessageError already calls the
              public useChat().retry(messageId) action for you — no extra wiring
              is needed here.
            */}
            <ChatMessage messageId={message.id} />
            <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
              {enabled
                ? `ChatError — code: ${code} · retryable: ${retryable}`
                : 'Error disabled'}
            </Typography>
          </Box>
        </ScopedChat>
      }
    />
  );
}
