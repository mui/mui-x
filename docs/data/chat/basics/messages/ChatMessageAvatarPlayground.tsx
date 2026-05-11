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
import { ChoiceControl } from '../../_playground/controls';
import { users } from '../../_playground/data';

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

export default function ChatMessageAvatarPlayground() {
  const [role, setRole] = React.useState<Role>('assistant');
  const [variant, setVariant] = React.useState<ChatVariant>('default');
  const message = React.useMemo(
    () => makeMessage(role, 'read', 'Avatar preview message.'),
    [role],
  );

  return (
    <PlaygroundCard
      title="ChatMessageAvatar"
      description="Author avatar slot — falls back to initials when no avatarUrl is set."
      previewMinHeight={180}
      controls={
        <React.Fragment>
          <ChoiceControl<Role>
            label="role"
            value={role}
            options={['assistant', 'user'] as const}
            onChange={setRole}
          />
          <ChoiceControl<ChatVariant>
            label="variant"
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
            <Box sx={{ width: '100%' }}>
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
