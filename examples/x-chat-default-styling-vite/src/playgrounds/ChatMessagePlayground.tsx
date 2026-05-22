import * as React from 'react';
import { Box } from '@mui/material';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';
import type { ChatConversation, ChatDensity, ChatMessage, ChatVariant } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ChatChrome, MessageErrorEffect, ScopedChat } from './sharedProviders';
import { sampleTexts } from './sharedFixtures';
import { ChoiceControl, SelectControl, SwitchControl } from './controls';
import { users } from '../data';

const conversation: ChatConversation = {
  id: 'msg-playground',
  title: 'Single message',
  participants: [users.me, users.assistant],
};

type Role = 'user' | 'assistant';
type StatusOption = 'sent' | 'read' | 'streaming' | 'error';
type LengthOption = 'short' | 'medium' | 'long' | 'markdown';

const DEFAULTS = {
  role: 'assistant' as Role,
  status: 'read' as StatusOption,
  length: 'medium' as LengthOption,
  variant: 'default' as ChatVariant,
  density: 'standard' as ChatDensity,
  grouped: false,
};

export function ChatMessagePlayground() {
  const [role, setRole] = React.useState<Role>(DEFAULTS.role);
  const [status, setStatus] = React.useState<StatusOption>(DEFAULTS.status);
  const [length, setLength] = React.useState<LengthOption>(DEFAULTS.length);
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [density, setDensity] = React.useState<ChatDensity>(DEFAULTS.density);
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

  const message: ChatMessage = React.useMemo(
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

  const codeExample = `import { ChatMessage, ChatMessageAvatar, ChatMessageContent } from '@mui/x-chat';

<ChatMessage messageId={message.id}>
  <ChatMessageAvatar />
  <ChatMessageContent />
</ChatMessage>`;

  return (
    <PlaygroundCard
      title="ChatMessage (bubble)"
      description="Single message bubble — toggle role, status, density, grouping."
      previewBackground="background.default"
      previewMinHeight={260}
      span={2}
      codeExample={codeExample}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <ChoiceControl<Role>
            label="role"
            value={role}
            options={['assistant', 'user'] as const}
            onChange={setRole}
          />
          <SelectControl<StatusOption>
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
          <ChoiceControl<ChatVariant>
            label="variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <ChoiceControl<ChatDensity>
            label="density"
            value={density}
            options={['compact', 'standard', 'comfortable'] as const}
            onChange={setDensity}
          />
          <SelectControl<LengthOption>
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
            <MessageErrorEffect messageId={message.id} enabled={status === 'error'} />
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
