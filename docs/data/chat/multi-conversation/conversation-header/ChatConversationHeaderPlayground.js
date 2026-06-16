import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderActions,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
} from '@mui/x-chat';

import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  DividerLabel,
  NumberControl,
  SwitchControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 8a2 2 0 1 0-2-2 2 2 0 0 0 2 2zm0 2a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79L19 20.49 20.49 19zM10 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" />
    </svg>
  );
}

const DEFAULTS = {
  title: 'Styling questions',
  subtitle: 'Theming MuiChatComposer',
  showSubtitle: true,
  actionCount: 2,
};

const CLASS_DEFS = [
  {
    name: 'header',
    selector: '.MuiChatConversation-header',
    description: 'The header bar.',
  },
  {
    name: 'headerInfo',
    selector: '.MuiChatConversation-headerInfo',
    description: 'The title + subtitle column.',
  },
  {
    name: 'title',
    selector: '.MuiChatConversation-title',
    description: 'The title text.',
  },
  {
    name: 'subtitle',
    selector: '.MuiChatConversation-subtitle',
    description: 'The subtitle text.',
  },
  {
    name: 'headerActions',
    selector: '.MuiChatConversation-headerActions',
    description: 'The trailing actions row.',
  },
];

export default function ChatConversationHeaderPlayground() {
  const [title, setTitle] = React.useState(DEFAULTS.title);
  const [subtitle, setSubtitle] = React.useState(DEFAULTS.subtitle);
  const [showSubtitle, setShowSubtitle] = React.useState(DEFAULTS.showSubtitle);
  const [actionCount, setActionCount] = React.useState(DEFAULTS.actionCount);
  const classesCustomizations = useCustomizations(CLASS_DEFS);

  const handleReset = React.useCallback(() => {
    setTitle(DEFAULTS.title);
    setSubtitle(DEFAULTS.subtitle);
    setShowSubtitle(DEFAULTS.showSubtitle);
    setActionCount(DEFAULTS.actionCount);
  }, []);

  const conversation = React.useMemo(
    () => ({
      id: 'header-playground',
      title,
      subtitle: showSubtitle ? subtitle : undefined,
      participants: [users.me, users.assistant],
    }),
    [title, subtitle, showSubtitle],
  );

  const wrapperSx = classesCustomizations.toClassesSx();
  return (
    <PlaygroundCard
      title="ChatConversationHeader"
      description="Top bar above the message list — title, subtitle, and action slot."
      previewMinHeight={140}
      onReset={handleReset}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>fixture (conversation data)</DividerLabel>
          <TextControl
            label="conversation.title"
            value={title}
            onChange={setTitle}
            helperText="Read by <ChatConversationTitle> from the active conversation."
          />
          <TextControl
            label="conversation.subtitle"
            value={subtitle}
            onChange={setSubtitle}
          />
          <SwitchControl
            label="render <ChatConversationSubtitle>"
            checked={showSubtitle}
            onChange={setShowSubtitle}
          />
          <DividerLabel>composition</DividerLabel>
          <NumberControl
            label="header action count"
            value={actionCount}
            min={0}
            max={4}
            onChange={setActionCount}
            helperText="Trailing icon button count."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          activeConversationId={conversation.id}
        >
          <ChatConversation>
            <Box
              sx={{
                width: '100%',
                overflow: 'hidden',
                ...wrapperSx,
              }}
            >
              <ChatConversationHeader>
                <ChatConversationHeaderInfo>
                  <ChatConversationTitle />
                  {showSubtitle ? <ChatConversationSubtitle /> : null}
                </ChatConversationHeaderInfo>
                {actionCount > 0 ? (
                  <ChatConversationHeaderActions>
                    {actionCount >= 1 ? (
                      <Tooltip title="Search">
                        <IconButton size="small" aria-label="Search">
                          <SearchIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {actionCount >= 2 ? (
                      <Tooltip title="More">
                        <IconButton size="small" aria-label="More">
                          <MoreIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {actionCount >= 3 ? (
                      <Tooltip title="Pin">
                        <IconButton size="small" aria-label="Pin">
                          <PinIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {actionCount >= 4 ? (
                      <Tooltip title="Archive">
                        <IconButton size="small" aria-label="Archive">
                          <ArchiveIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
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
