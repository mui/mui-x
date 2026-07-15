import * as React from 'react';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreIcon from '@mui/icons-material/MoreVert';
import PinIcon from '@mui/icons-material/PushPin';
import SearchIcon from '@mui/icons-material/Search';
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
import type { ChatConversation as ChatConversationType } from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  DividerLabel,
  NumberControl,
  SwitchControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const DEFAULTS = {
  title: 'Styling questions',
  subtitle: 'Theming MuiChatComposer',
  showSubtitle: true,
  actionCount: 2,
};

type ClassKey = 'header' | 'headerInfo' | 'title' | 'subtitle' | 'headerActions';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
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
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const handleReset = React.useCallback(() => {
    setTitle(DEFAULTS.title);
    setSubtitle(DEFAULTS.subtitle);
    setShowSubtitle(DEFAULTS.showSubtitle);
    setActionCount(DEFAULTS.actionCount);
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
