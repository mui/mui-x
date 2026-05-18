import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';

import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { ChoiceControl, DividerLabel } from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation = {
  id: 'avatar-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

function makeMessage(role, status, text) {
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

const CLASS_DEFS = [
  {
    name: 'avatar',
    selector: '.MuiChatMessage-avatar',
    description: 'Applied to the avatar element of the message row.',
  },
];

export default function ChatMessageAvatarPlayground() {
  const [role, setRole] = React.useState('assistant');
  const [variant, setVariant] = React.useState('default');
  const classesCustomizations = useCustomizations(CLASS_DEFS);

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
          <ChoiceControl
            label="role"
            value={role}
            options={['assistant', 'user']}
            onChange={setRole}
          />
          <DividerLabel>chrome provider</DividerLabel>
          <ChoiceControl
            label="ChatChrome.variant"
            value={variant}
            options={['default', 'compact']}
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
            <Box sx={{ width: '100%', ...avatarSx }}>
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
