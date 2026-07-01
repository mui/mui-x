import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageActions,
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
  SwitchControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation = {
  id: 'actions-playground',
  title: 'Actions',
  participants: [users.me, users.assistant],
};

function makeMessage(role, status, text) {
  const author = role === 'user' ? users.me : users.assistant;
  return {
    id: `actions-${role}-${status}`,
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
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z" />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1 21h4V9H1zm22-11a2 2 0 0 0-2-2h-6.31l.95-4.57a4 4 0 0 0-1.04-3.61L13 0 7.59 5.41A2 2 0 0 0 7 6.83V19a2 2 0 0 0 2 2h9a2 2 0 0 0 1.84-1.21l3.02-7.05A2 2 0 0 0 23 12z" />
    </svg>
  );
}

const CLASS_DEFS = [
  {
    name: 'actions',
    selector: '.MuiChatMessage-actions',
    description: 'The hover-revealed action toolbar.',
  },
];

export default function ChatMessageActionsPlayground() {
  const [showCopy, setShowCopy] = React.useState(true);
  const [showLike, setShowLike] = React.useState(true);
  const [revealed, setRevealed] = React.useState(true);
  const [variant, setVariant] = React.useState('default');
  const [density, setDensity] = React.useState('standard');
  const classesCustomizations = useCustomizations(CLASS_DEFS);
  const message = React.useMemo(
    () =>
      makeMessage(
        'assistant',
        'read',
        'Toggle "reveal actions", or hover this bubble.',
      ),
    [],
  );

  const wrapperSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageActions"
      description="Hover-revealed action toolbar (copy, regenerate, react…) anchored under the bubble."
      previewMinHeight={220}
      span={2}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>composition (children)</DividerLabel>
          <SwitchControl
            label="copy action"
            checked={showCopy}
            onChange={setShowCopy}
          />
          <SwitchControl
            label="like action"
            checked={showLike}
            onChange={setShowLike}
          />
          <DividerLabel>visibility</DividerLabel>
          <SwitchControl
            label="reveal actions"
            checked={revealed}
            onChange={setRevealed}
          />
          <DividerLabel>chrome provider</DividerLabel>
          <ChoiceControl
            label="ChatChrome.variant"
            value={variant}
            options={['default', 'compact']}
            onChange={setVariant}
          />
          <ChoiceControl
            label="ChatChrome.density"
            value={density}
            options={['compact', 'standard', 'comfortable']}
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
            <Box
              sx={{
                width: '100%',
                ...(revealed && {
                  '& .MuiChatMessage-actions': {
                    opacity: 1,
                    visibility: 'visible',
                  },
                }),
                ...wrapperSx,
              }}
            >
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
