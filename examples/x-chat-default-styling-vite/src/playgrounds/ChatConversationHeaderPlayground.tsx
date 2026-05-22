import * as React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderActions,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
} from '@mui/x-chat';
import type { ChatConversation as ChatConversationType } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { SwitchControl, TextControl } from './controls';
import { users } from '../data';

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M12 8a2 2 0 1 0-2-2 2 2 0 0 0 2 2zm0 2a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79L19 20.49 20.49 19zM10 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
    </svg>
  );
}

const DEFAULTS = {
  title: 'Styling questions',
  subtitle: 'Theming MuiChatComposer',
  showSubtitle: true,
  showActions: true,
};

export function ChatConversationHeaderPlayground() {
  const [title, setTitle] = React.useState(DEFAULTS.title);
  const [subtitle, setSubtitle] = React.useState(DEFAULTS.subtitle);
  const [showSubtitle, setShowSubtitle] = React.useState(DEFAULTS.showSubtitle);
  const [showActions, setShowActions] = React.useState(DEFAULTS.showActions);

  const handleReset = React.useCallback(() => {
    setTitle(DEFAULTS.title);
    setSubtitle(DEFAULTS.subtitle);
    setShowSubtitle(DEFAULTS.showSubtitle);
    setShowActions(DEFAULTS.showActions);
  }, []);

  const conversation: ChatConversationType = React.useMemo(
    () => ({
      id: 'header-playground',
      title,
      subtitle: showSubtitle ? subtitle : undefined,
      participants: [users.me, users.assistant],
    }),
    [title, subtitle, showSubtitle],
  );

  const codeExample = `import {
  ChatConversationHeader,
  ChatConversationHeaderInfo,
  ChatConversationHeaderActions,
  ChatConversationTitle,
  ChatConversationSubtitle,
} from '@mui/x-chat';

<ChatConversationHeader>
  <ChatConversationHeaderInfo>
    <ChatConversationTitle />
    <ChatConversationSubtitle />
  </ChatConversationHeaderInfo>
  <ChatConversationHeaderActions>
    <IconButton>…</IconButton>
  </ChatConversationHeaderActions>
</ChatConversationHeader>`;

  return (
    <PlaygroundCard
      title="ChatConversationHeader"
      description="Top bar above the message list — title, subtitle, and action slot."
      previewBackground="background.default"
      previewMinHeight={140}
      codeExample={codeExample}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <TextControl label="title" value={title} onChange={setTitle} />
          <SwitchControl label="subtitle" checked={showSubtitle} onChange={setShowSubtitle} />
          <TextControl label="subtitle text" value={subtitle} onChange={setSubtitle} />
          <SwitchControl
            label="actions"
            checked={showActions}
            onChange={setShowActions}
            helperText="Render trailing icon buttons."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={[conversation]} activeConversationId={conversation.id}>
          <ChatConversation>
            <Box
              sx={{
                width: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <ChatConversationHeader>
                <ChatConversationHeaderInfo>
                  <ChatConversationTitle />
                  {showSubtitle ? <ChatConversationSubtitle /> : null}
                </ChatConversationHeaderInfo>
                {showActions ? (
                  <ChatConversationHeaderActions>
                    <Tooltip title="Search">
                      <IconButton size="small" aria-label="Search">
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More">
                      <IconButton size="small" aria-label="More">
                        <MoreIcon />
                      </IconButton>
                    </Tooltip>
                  </ChatConversationHeaderActions>
                ) : null}
              </ChatConversationHeader>
            </Box>
          </ChatConversation>
        </ScopedChat>
      }
    />
  );
}
