import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAuthorLabel,
  ChatMessageGroup,
} from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { ChoiceControl, DividerLabel } from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

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

type ClassKey = 'authorLabel';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  {
    name: 'authorLabel',
    selector: '.MuiChatMessage-authorLabel',
    description: 'Applied to the author label element above the bubble group.',
  },
];

export default function ChatMessageAuthorLabelPlayground() {
  const [role, setRole] = React.useState<Role>('assistant');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const message = React.useMemo(
    () => makeMessage(role, 'read', 'Author label preview message.'),
    [role],
  );

  const labelSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageAuthorLabel"
      description="Author display name rendered above grouped messages."
      previewMinHeight={140}
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
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[message]}
          activeConversationId={conversation.id}
        >
          <Box sx={{ width: '100%', ...(labelSx as object) }}>
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
