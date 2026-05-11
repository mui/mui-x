import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageMeta,
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
  id: 'meta-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

type Role = 'assistant' | 'user';
type Status = 'sent' | 'read' | 'streaming';

function makeMessage(role: Role, status: Status, text: string): ChatMessage {
  const author = role === 'user' ? users.me : users.assistant;
  return {
    id: `meta-${role}-${status}`,
    conversationId: conversation.id,
    role,
    author,
    createdAt: '2026-05-03T09:30:00.000Z',
    status,
    parts: [{ type: 'text', text }],
  };
}

export default function ChatMessageMetaPlayground() {
  const [role, setRole] = React.useState<Role>('user');
  const [status, setStatus] = React.useState<Status>('read');
  const [variant, setVariant] = React.useState<ChatVariant>('compact');
  const message = React.useMemo(
    () => makeMessage(role, status, 'Meta preview message.'),
    [role, status],
  );

  return (
    <PlaygroundCard
      title="ChatMessageMeta"
      description="External meta (timestamp + delivery status) used by compact bubbles."
      previewMinHeight={200}
      controls={
        <React.Fragment>
          <ChoiceControl<Role>
            label="role"
            value={role}
            options={['assistant', 'user'] as const}
            onChange={setRole}
          />
          <ChoiceControl<Status>
            label="status"
            value={status}
            options={['sent', 'read', 'streaming'] as const}
            onChange={setStatus}
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
                  <ChatMessageMeta />
                </ChatMessageComponent>
              </ChatMessageGroup>
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
