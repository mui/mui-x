import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageInlineMeta,
} from '@mui/x-chat';

import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from '../../_playground/sharedProviders';
import { ChoiceControl, DividerLabel } from '../../_playground/controls';
import { useCustomizations } from '../../_playground/useCustomizations';
import { users } from '../../_playground/data';

const conversation = {
  id: 'inline-meta-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

function makeMessage(role, status, text) {
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

const CLASS_DEFS = [
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
  const [role, setRole] = React.useState('user');
  const [status, setStatus] = React.useState('read');
  const classesCustomizations = useCustomizations(CLASS_DEFS);
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
          <ChoiceControl
            label="role"
            value={role}
            options={['assistant', 'user']}
            onChange={setRole}
          />
          <ChoiceControl
            label="status"
            value={status}
            options={['sent', 'read', 'streaming']}
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
            <Box sx={{ width: '100%', ...inlineSx }}>
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
