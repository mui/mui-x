import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAuthorLabel,
  ChatMessageGroup,
} from '@mui/x-chat';

import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat } from '../../_playground/sharedProviders';
import { ChoiceControl, DividerLabel } from '../../_playground/controls';
import { useCustomizations } from '../../_playground/useCustomizations';
import { users } from '../../_playground/data';

const conversation = {
  id: 'author-label-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

function makeMessage(role, status, text) {
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

const CLASS_DEFS = [
  {
    name: 'authorLabel',
    selector: '.MuiChatMessage-authorLabel',
    description: 'Applied to the author label element above the bubble group.',
  },
];

export default function ChatMessageAuthorLabelPlayground() {
  const [role, setRole] = React.useState('assistant');
  const classesCustomizations = useCustomizations(CLASS_DEFS);

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
          <ChoiceControl
            label="role"
            value={role}
            options={['assistant', 'user']}
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
          <Box sx={{ width: '100%', ...labelSx }}>
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
