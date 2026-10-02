import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';

import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  ChatChrome,
  ScopedChat,
} from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  ChoiceControl,
  DividerLabel,
  SelectControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

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

const CLASS_DEFS = [
  {
    name: 'content',
    selector: '.MuiChatMessage-content',
    description: 'The content slot wrapping the bubble + inline meta.',
  },
  {
    name: 'bubble',
    selector: '.MuiChatMessage-bubble',
    description: 'The actual rounded bubble element.',
  },
];

export default function ChatMessageContentPlayground() {
  const [content, setContent] = React.useState('markdown');
  const [role, setRole] = React.useState('assistant');
  const [variant, setVariant] = React.useState('default');
  const classesCustomizations = useCustomizations(CLASS_DEFS);

  const text =
    content === 'markdown'
      ? `**Markdown** is rendered automatically:\n\n- bullet one\n- bullet two\n\nInline \`code\` works too.`
      : `Plain text with no formatting—just wraps naturally.`;

  const message = React.useMemo(() => makeMessage(role, 'read', text), [role, text]);

  const contentSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageContent"
      description="Bubble interior—handles markdown, code fences and tool/source parts."
      previewMinHeight={220}
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
          <SelectControl
            label="content"
            value={content}
            options={[{ value: 'plain' }, { value: 'markdown' }]}
            onChange={setContent}
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
            <Box sx={{ width: '100%', ...contentSx }}>
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
