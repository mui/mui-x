import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';

import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from '../../_playground/sharedProviders';
import { ChoiceControl, SelectControl } from '../../_playground/controls';
import { users } from '../../_playground/data';

const conversation = {
  id: 'content-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

function makeMessage(role, status, text) {
  const author = role === 'user' ? users.me : users.assistant;
  return {
    id: `content-${role}-${status}`,
    conversationId: conversation.id,
    role,
    author,
    createdAt: '2026-05-03T09:30:00.000Z',
    status,
    parts: [{ type: 'text', text }],
  };
}

export default function ChatMessageContentPlayground() {
  const [content, setContent] = React.useState('markdown');
  const [role, setRole] = React.useState('assistant');
  const [variant, setVariant] = React.useState('default');

  const text =
    content === 'markdown'
      ? `**Markdown** is rendered automatically:\n\n- bullet one\n- bullet two\n\nInline \`code\` works too.`
      : `Plain text with no formatting — just wraps naturally.`;

  const message = React.useMemo(() => makeMessage(role, 'read', text), [role, text]);

  return (
    <PlaygroundCard
      title="ChatMessageContent"
      description="Bubble interior — handles markdown, code fences and tool/source parts."
      previewMinHeight={220}
      span={2}
      controls={
        <React.Fragment>
          <ChoiceControl
            label="role"
            value={role}
            options={['assistant', 'user']}
            onChange={setRole}
          />
          <ChoiceControl
            label="variant"
            value={variant}
            options={['default', 'compact']}
            onChange={setVariant}
          />
          <SelectControl
            label="content"
            value={content}
            options={[{ value: 'plain' }, { value: 'markdown' }]}
            onChange={setContent}
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
