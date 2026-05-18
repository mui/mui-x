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
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { ChoiceControl, DividerLabel } from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation: ChatConversation = {
  id: 'avatar-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

type Role = 'assistant' | 'user';
type Status = 'sent' | 'read' | 'streaming';

function makeMessage(role: Role, status: Status, text: string): ChatMessage {
  const author = role === 'user' ? users.me : users.assistant;
  return {
    id: `avatar-${role}-${status}`,
    conversationId: conversation.id,
    role,
    author,
    createdAt: '2026-05-03T09:30:00.000Z',
    status,
    parts: [{ type: 'text', text }],
  };
}

type ClassKey = 'avatar';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  {
    name: 'avatar',
    selector: '.MuiChatMessage-avatar',
    description: 'Applied to the avatar element of the message row.',
  },
];

export default function ChatMessageAvatarPlayground() {
  const [role, setRole] = React.useState<Role>('assistant');
  const [variant, setVariant] = React.useState<ChatVariant>('default');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const message = React.useMemo(
    () => makeMessage(role, 'read', 'Avatar preview message.'),
    [role],
  );

  const avatarSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageAvatar"
      description="Author avatar slot — falls back to initials when no avatarUrl is set."
      previewMinHeight={180}
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
            <Box sx={{ width: '100%', ...(avatarSx as object) }}>
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
