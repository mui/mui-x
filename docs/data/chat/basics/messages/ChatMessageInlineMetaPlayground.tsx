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
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { ChoiceControl, DividerLabel } from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

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

type ClassKey = 'inlineMeta' | 'inlineMetaSpacer';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  {
    name: 'inlineMeta',
    selector: '.MuiChatMessage-inlineMeta',
    description: 'The container floating at the bottom-right of the bubble.',
  },
  {
    name: 'inlineMetaSpacer',
    selector: '.MuiChatMessage-inlineMetaSpacer',
    description: 'Reserved whitespace so text wraps around the meta block.',
  },
];

export default function ChatMessageInlineMetaPlayground() {
  const [role, setRole] = React.useState<Role>('user');
  const [status, setStatus] = React.useState<Status>('read');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);
  const message = React.useMemo(
    () =>
      makeMessage(
        role,
        status,
        'Inline meta sits at the bottom-right of this bubble.',
      ),
    [role, status],
  );

  const inlineSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageInlineMeta"
      description="Telegram-style timestamp + status that flows inside the bubble."
      previewMinHeight={200}
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
            <Box sx={{ width: '100%', ...(inlineSx as object) }}>
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
