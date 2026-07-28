import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';
import type {
  ChatConversation,
  ChatDensity,
  ChatMessage,
  ChatVariant,
} from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  ChatChrome,
  MessageErrorEffect,
  ScopedChat,
} from 'docs/src/modules/components/chat-playground/sharedProviders';
import { sampleTexts } from 'docs/src/modules/components/chat-playground/sharedFixtures';
import {
  ChoiceControl,
  DividerLabel,
  SelectControl,
  SwitchControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

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

type ClassKey =
  'root' | 'bubble' | 'roleUser' | 'roleAssistant' | 'streaming' | 'error';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'The message row.' },
  {
    name: 'bubble',
    selector: '.MuiChatMessage-bubble',
    description: 'The actual rounded bubble inside the content slot.',
  },
  {
    name: 'roleUser',
    selector: '.MuiChatMessage-roleUser',
    description: 'Applied to rows whose role is "user".',
  },
  {
    name: 'roleAssistant',
    selector: '.MuiChatMessage-roleAssistant',
    description: 'Applied to rows whose role is "assistant".',
  },
  {
    name: 'streaming',
    selector: '.MuiChatMessage-streaming',
    description: 'Applied while the message is streaming.',
  },
  {
    name: 'error',
    selector: '.MuiChatMessage-error',
    description: 'Applied when the message has an error status.',
  },
];

export default function ChatMessagePlayground() {
  const [role, setRole] = React.useState<Role>(DEFAULTS.role);
  const [status, setStatus] = React.useState<StatusOption>(DEFAULTS.status);
  const [length, setLength] = React.useState<LengthOption>(DEFAULTS.length);
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [density, setDensity] = React.useState<ChatDensity>(DEFAULTS.density);
  const [grouped, setGrouped] = React.useState(DEFAULTS.grouped);
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

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

  const messageSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessage (bubble)"
      description="Single message bubble—toggle role, status, density, grouping."
      previewMinHeight={260}
      span={2}
      onReset={handleReset}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <SwitchControl
            label="isGrouped"
            checked={grouped}
            onChange={setGrouped}
            helperText="Render as a continuation of the previous bubble."
          />
          <DividerLabel>fixture (message data)</DividerLabel>
          <ChoiceControl<Role>
            label="role"
            value={role}
            options={['assistant', 'user'] as const}
            onChange={setRole}
            helperText="Stored on the message, read by useMessage()."
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
          <DividerLabel>chrome provider</DividerLabel>
          <ChoiceControl<ChatVariant>
            label="ChatChrome.variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <ChoiceControl<ChatDensity>
            label="ChatChrome.density"
            value={density}
            options={['compact', 'standard', 'comfortable'] as const}
            onChange={setDensity}
          />
          <Typography variant="caption" color="text.secondary">
            variant and density mainly affect meta and bubble spacing—see the Meta
            and Inline meta playgrounds below.
          </Typography>
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
                <ChatMessageComponent
                  messageId={message.id}
                  isGrouped={grouped}
                  sx={messageSx}
                >
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
