import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatMessage } from '@mui/x-chat';

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
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation = {
  id: 'error-playground',
  title: 'Error preview',
  participants: [users.me, users.assistant],
};

const message = {
  id: 'error-msg',
  conversationId: conversation.id,
  role: 'assistant',
  author: users.assistant,
  createdAt: '2026-05-03T10:00:00.000Z',
  status: 'error',
  parts: [{ type: 'text', text: 'This message failed to send.' }],
};

const CLASS_DEFS = [
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
  const [code, setCode] = React.useState('SEND_ERROR');
  const [retryable, setRetryable] = React.useState(true);
  const [text, setText] = React.useState('Could not reach the chat server.');
  const [lastRetryAt, setLastRetryAt] = React.useState(null);
  const classesCustomizations = useCustomizations(CLASS_DEFS);

  // The user can't pass onRetry directly through the headless adapter slot,
  // but we can subscribe to the retry button click via the global event bus on
  // the store. For the demo we attach a global listener that ticks the
  // "last retry" indicator below.
  React.useEffect(() => {
    function onRetry() {
      setLastRetryAt(new Date().toLocaleTimeString());
    }
    document.addEventListener('mui-x-chat-demo-retry', onRetry);
    return () => document.removeEventListener('mui-x-chat-demo-retry', onRetry);
  }, []);

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
          <ChoiceControl
            label="code"
            value={code}
            options={[
              'SEND_ERROR',
              'STREAM_ERROR',
              'HISTORY_ERROR',
              'REALTIME_ERROR',
            ]}
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
            onClickCapture={(event) => {
              const target = event.target;
              if (target.closest('.MuiChatMessageError-retryButton')) {
                document.dispatchEvent(new CustomEvent('mui-x-chat-demo-retry'));
              }
            }}
          >
            <ChatMessage messageId={message.id} />
            <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
              {lastRetryAt
                ? `Last retry click: ${lastRetryAt}`
                : 'Click "Retry" to fire onRetry — observed here.'}
            </Typography>
          </Box>
        </ScopedChat>
      }
    />
  );
}
