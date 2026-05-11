import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAuthorLabel,
  ChatMessageGroup,
} from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat } from '../../_playground/sharedProviders';
import { ChoiceControl } from '../../_playground/controls';
import { users } from '../../_playground/data';

const conversation: ChatConversation = {
  id: 'author-label-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

type Role = 'assistant' | 'user';
type Status = 'sent' | 'read' | 'streaming';

function makeMessage(role: Role, status: Status, text: string): ChatMessage {
  const author = role === 'user' ? users.me : users.assistant;
  return {
    id: `author-label-${role}-${status}`,
    conversationId: conversation.id,
    role,
    author,
    createdAt: '2026-05-03T09:30:00.000Z',
    status,
    parts: [{ type: 'text', text }],
  };
}

export default function ChatMessageAuthorLabelPlayground() {
  const [role, setRole] = React.useState<Role>('assistant');
  const message = React.useMemo(
    () => makeMessage(role, 'read', 'Author label preview message.'),
    [role],
  );

  return (
    <PlaygroundCard
      title="ChatMessageAuthorLabel"
      description="Author display name rendered above grouped messages."
      previewMinHeight={140}
      controls={
        <ChoiceControl<Role>
          label="role"
          value={role}
          options={['assistant', 'user'] as const}
          onChange={setRole}
        />
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[message]}
          activeConversationId={conversation.id}
        >
          <Box sx={{ width: '100%' }}>
            <ChatMessageGroup messageId={message.id}>
              <ChatMessageComponent messageId={message.id}>
                <ChatMessageAuthorLabel />
              </ChatMessageComponent>
            </ChatMessageGroup>
          </Box>
        </ScopedChat>
      }
    />
  );
}
