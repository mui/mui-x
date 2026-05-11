import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';

import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import {
  ChatChrome,
  MessageErrorEffect,
  ScopedChat,
} from '../../_playground/sharedProviders';
import { sampleTexts } from '../../_playground/sharedFixtures';
import {
  ChoiceControl,
  SelectControl,
  SwitchControl,
} from '../../_playground/controls';
import { users } from '../../_playground/data';

const conversation = {
  id: 'msg-playground',
  title: 'Single message',
  participants: [users.me, users.assistant],
};

const DEFAULTS = {
  role: 'assistant',
  status: 'read',
  length: 'medium',
  variant: 'default',
  density: 'standard',
  grouped: false,
};

export default function ChatMessagePlayground() {
  const [role, setRole] = React.useState(DEFAULTS.role);
  const [status, setStatus] = React.useState(DEFAULTS.status);
  const [length, setLength] = React.useState(DEFAULTS.length);
  const [variant, setVariant] = React.useState(DEFAULTS.variant);
  const [density, setDensity] = React.useState(DEFAULTS.density);
  const [grouped, setGrouped] = React.useState(DEFAULTS.grouped);

  const handleReset = React.useCallback(() => {
    setRole(DEFAULTS.role);
    setStatus(DEFAULTS.status);
    setLength(DEFAULTS.length);
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
    setGrouped(DEFAULTS.grouped);
  }, []);

  const author = role === 'user' ? users.me : users.assistant;

  const message = React.useMemo(
    () => ({
      id: 'msg-playground-bubble',
      conversationId: conversation.id,
      role,
      author,
      createdAt: '2026-05-03T09:30:00.000Z',
      status,
      parts: [{ type: 'text', text: sampleTexts[length] }],
    }),
    [role, author, status, length],
  );
  return (
    <PlaygroundCard
      title="ChatMessage (bubble)"
      description="Single message bubble — toggle role, status, density, grouping."
      previewMinHeight={260}
      span={2}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <ChoiceControl
            label="role"
            value={role}
            options={['assistant', 'user']}
            onChange={setRole}
          />
          <SelectControl
            label="status"
            value={status}
            options={[
              { value: 'sent' },
              { value: 'read' },
              { value: 'streaming' },
              { value: 'error' },
            ]}
            onChange={setStatus}
          />
          <ChoiceControl
            label="variant"
            value={variant}
            options={['default', 'compact']}
            onChange={setVariant}
          />
          <ChoiceControl
            label="density"
            value={density}
            options={['compact', 'standard', 'comfortable']}
            onChange={setDensity}
          />
          <SelectControl
            label="content length"
            value={length}
            options={[
              { value: 'short' },
              { value: 'medium' },
              { value: 'long' },
              { value: 'markdown' },
            ]}
            onChange={setLength}
          />
          <SwitchControl
            label="isGrouped"
            checked={grouped}
            onChange={setGrouped}
            helperText="Render as a continuation of the previous bubble."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[message]}
          activeConversationId={conversation.id}
        >
          <ChatChrome variant={variant} density={density}>
            <MessageErrorEffect
              messageId={message.id}
              enabled={status === 'error'}
            />
            <Box sx={{ width: '100%' }}>
              <ChatMessageGroup messageId={message.id}>
                <ChatMessageComponent messageId={message.id} isGrouped={grouped}>
                  <ChatMessageAvatar />
                  <ChatMessageContent />
                </ChatMessageComponent>
              </ChatMessageGroup>
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
