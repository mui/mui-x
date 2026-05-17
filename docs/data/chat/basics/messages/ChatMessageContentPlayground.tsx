import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';
import type {
  ChatConversation,
  ChatMessage,
  ChatVariant,
} from '@mui/x-chat/headless';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from '../../_playground/sharedProviders';
import {
  ChoiceControl,
  DividerLabel,
  SelectControl,
} from '../../_playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from '../../_playground/useCustomizations';
import { users } from '../../_playground/data';

const conversation: ChatConversation = {
  id: 'content-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

type Role = 'assistant' | 'user';
type Status = 'sent' | 'read' | 'streaming';

function makeMessage(role: Role, status: Status, text: string): ChatMessage {
  const author = role === 'user' ? users.me : users.assistant;
  return {
    id: `content-${role}-${status}`,
    conversationId: conversation.id,
    role,
    author,
    createdAt: '2026-05-03T09:30:00.000Z',
    status,
    parts: [{ type: 'text', text }],
  };
}

type ClassKey = 'content' | 'bubble';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  {
    name: 'content',
    selector: '.MuiChatMessage-content',
    description: 'The content slot wrapping the bubble + inline meta.',
  },
  {
    name: 'bubble',
    selector: '.MuiChatMessage-bubble',
    description: 'The actual rounded bubble element.',
  },
];

export default function ChatMessageContentPlayground() {
  const [content, setContent] = React.useState<'plain' | 'markdown'>('markdown');
  const [role, setRole] = React.useState<Role>('assistant');
  const [variant, setVariant] = React.useState<ChatVariant>('default');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const text =
    content === 'markdown'
      ? `**Markdown** is rendered automatically:\n\n- bullet one\n- bullet two\n\nInline \`code\` works too.`
      : `Plain text with no formatting — just wraps naturally.`;

  const message = React.useMemo(() => makeMessage(role, 'read', text), [role, text]);

  const contentSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageContent"
      description="Bubble interior — handles markdown, code fences and tool/source parts."
      previewMinHeight={220}
      span={2}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>fixture (message data)</DividerLabel>
          <ChoiceControl<Role>
            label="role"
            value={role}
            options={['assistant', 'user'] as const}
            onChange={setRole}
          />
          <SelectControl<'plain' | 'markdown'>
            label="content"
            value={content}
            options={[{ value: 'plain' }, { value: 'markdown' }]}
            onChange={setContent}
          />
          <DividerLabel>chrome provider</DividerLabel>
          <ChoiceControl<ChatVariant>
            label="ChatChrome.variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[message]}
          activeConversationId={conversation.id}
        >
          <ChatChrome variant={variant} density="standard">
            <Box sx={{ width: '100%', ...(contentSx as object) }}>
              <ChatMessageGroup messageId={message.id}>
                <ChatMessageComponent messageId={message.id}>
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
