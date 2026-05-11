import * as React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageActions,
  ChatMessageAuthorLabel,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageInlineMeta,
  ChatMessageMeta,
} from '@mui/x-chat';
import type { ChatConversation, ChatDensity, ChatMessage, ChatVariant } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ChatChrome, ScopedChat } from './sharedProviders';
import { ChoiceControl, SelectControl, SwitchControl } from './controls';
import { users } from '../data';

const conversation: ChatConversation = {
  id: 'parts-playground',
  title: 'Parts',
  participants: [users.me, users.assistant],
};

type Role = 'assistant' | 'user';
type Status = 'sent' | 'read' | 'streaming';

function makeMessage(role: Role, status: Status, text: string): ChatMessage {
  const author = role === 'user' ? users.me : users.assistant;
  return {
    id: `parts-${role}-${status}`,
    conversationId: conversation.id,
    role,
    author,
    createdAt: '2026-05-03T09:30:00.000Z',
    status,
    parts: [{ type: 'text', text }],
  };
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z" />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M1 21h4V9H1zm22-11a2 2 0 0 0-2-2h-6.31l.95-4.57a4 4 0 0 0-1.04-3.61L13 0 7.59 5.41A2 2 0 0 0 7 6.83V19a2 2 0 0 0 2 2h9a2 2 0 0 0 1.84-1.21l3.02-7.05A2 2 0 0 0 23 12z" />
    </svg>
  );
}

export function ChatMessageAvatarPlayground() {
  const [role, setRole] = React.useState<Role>('assistant');
  const [variant, setVariant] = React.useState<ChatVariant>('default');
  const message = React.useMemo(() => makeMessage(role, 'read', 'Avatar preview message.'), [role]);

  return (
    <PlaygroundCard
      title="ChatMessageAvatar"
      description="Author avatar slot — falls back to initials when no avatarUrl is set."
      previewBackground="background.default"
      previewMinHeight={180}
      controls={
        <React.Fragment>
          <ChoiceControl<Role>
            label="role"
            value={role}
            options={['assistant', 'user'] as const}
            onChange={setRole}
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
                </ChatMessageComponent>
              </ChatMessageGroup>
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}

export function ChatMessageAuthorLabelPlayground() {
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

export function ChatMessageContentPlayground() {
  const [content, setContent] = React.useState<'plain' | 'markdown'>('markdown');
  const [role, setRole] = React.useState<Role>('assistant');
  const [variant, setVariant] = React.useState<ChatVariant>('default');

  const text =
    content === 'markdown'
      ? `**Markdown** is rendered automatically:\n\n- bullet one\n- bullet two\n\nInline \`code\` works too.`
      : `Plain text with no formatting — just wraps naturally.`;

  const message = React.useMemo(() => makeMessage(role, 'read', text), [role, text]);

  return (
    <PlaygroundCard
      title="ChatMessageContent"
      description="Bubble interior — handles markdown, code fences and tool/source parts."
      previewBackground="background.default"
      previewMinHeight={220}
      span={2}
      controls={
        <React.Fragment>
          <ChoiceControl<Role>
            label="role"
            value={role}
            options={['assistant', 'user'] as const}
            onChange={setRole}
          />
          <ChoiceControl<ChatVariant>
            label="variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <SelectControl<'plain' | 'markdown'>
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

export function ChatMessageMetaPlayground() {
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
      previewBackground="background.default"
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

export function ChatMessageInlineMetaPlayground() {
  const [role, setRole] = React.useState<Role>('user');
  const [status, setStatus] = React.useState<Status>('read');
  const message = React.useMemo(
    () => makeMessage(role, status, 'Inline meta sits at the bottom-right of this bubble.'),
    [role, status],
  );

  return (
    <PlaygroundCard
      title="ChatMessageInlineMeta"
      description="Telegram-style timestamp + status that flows inside the bubble."
      previewBackground="background.default"
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

export function ChatMessageActionsPlayground() {
  const [showCopy, setShowCopy] = React.useState(true);
  const [showLike, setShowLike] = React.useState(true);
  const [variant, setVariant] = React.useState<ChatVariant>('default');
  const [density, setDensity] = React.useState<ChatDensity>('standard');
  const message = React.useMemo(
    () => makeMessage('assistant', 'read', 'Hover this bubble to reveal the actions.'),
    [],
  );

  return (
    <PlaygroundCard
      title="ChatMessageActions"
      description="Hover-revealed action toolbar (copy, regenerate, react…) anchored under the bubble."
      previewBackground="background.default"
      previewMinHeight={220}
      span={2}
      controls={
        <React.Fragment>
          <SwitchControl label="copy action" checked={showCopy} onChange={setShowCopy} />
          <SwitchControl label="like action" checked={showLike} onChange={setShowLike} />
          <ChoiceControl<ChatVariant>
            label="variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <ChoiceControl<ChatDensity>
            label="density"
            value={density}
            options={['compact', 'standard', 'comfortable'] as const}
            onChange={setDensity}
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[message]}
          activeConversationId={conversation.id}
        >
          <ChatChrome variant={variant} density={density}>
            <Box sx={{ width: '100%' }}>
              <ChatMessageGroup messageId={message.id}>
                <ChatMessageComponent messageId={message.id}>
                  <ChatMessageAvatar />
                  <ChatMessageContent />
                  <ChatMessageActions>
                    {showCopy ? (
                      <Tooltip title="Copy">
                        <IconButton size="small" aria-label="Copy">
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {showLike ? (
                      <Tooltip title="Like">
                        <IconButton size="small" aria-label="Like">
                          <ThumbsUpIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </ChatMessageActions>
                </ChatMessageComponent>
              </ChatMessageGroup>
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
