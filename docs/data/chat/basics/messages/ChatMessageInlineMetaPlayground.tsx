import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageInlineMeta,
} from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from '../../_playground/sharedProviders';
import { ChoiceControl } from '../../_playground/controls';
import { users } from '../../_playground/data';

const conversation: ChatConversation = {
  id: 'inline-meta-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

type Role = 'assistant' | 'user';
type Status = 'sent' | 'read' | 'streaming';

function makeMessage(role: Role, status: Status, text: string): ChatMessage {
  const author = role === 'user' ? users.me : users.assistant;
  return {
    id: `inline-meta-${role}-${status}`,
    conversationId: conversation.id,
    role,
    author,
    createdAt: '2026-05-03T09:30:00.000Z',
    status,
    parts: [{ type: 'text', text }],
  };
}

export default function ChatMessageInlineMetaPlayground() {
  const [role, setRole] = React.useState<Role>('user');
  const [status, setStatus] = React.useState<Status>('read');
  const message = React.useMemo(
    () =>
      makeMessage(
        role,
        status,
        'Inline meta sits at the bottom-right of this bubble.',
      ),
    [role, status],
  );

  return (
    <PlaygroundCard
      title="ChatMessageInlineMeta"
      description="Telegram-style timestamp + status that flows inside the bubble."
      previewMinHeight={200}
      span={2}
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
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[message]}
          activeConversationId={conversation.id}
        >
          <ChatChrome variant="default" density="standard">
            <Box sx={{ width: '100%' }}>
              <ChatMessageGroup messageId={message.id}>
                <ChatMessageComponent messageId={message.id}>
                  <ChatMessageAvatar />
                  <ChatMessageContent afterContent={<ChatMessageInlineMeta />} />
                </ChatMessageComponent>
              </ChatMessageGroup>
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
