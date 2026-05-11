import * as React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  ChatConversation,
  ChatConversationHeaderActions,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
} from '@mui/x-chat';
import type { ChatConversation as ChatConversationType } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { NumberControl, SwitchControl, TextControl } from './controls';
import { users } from '../data';

function ConvoFrame({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        p: 1.25,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      {children}
    </Box>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function ChatConversationTitlePlayground() {
  const [title, setTitle] = React.useState('Styling questions');
  const conversation: ChatConversationType = {
    id: 'title-playground',
    title,
    participants: [users.me, users.assistant],
  };

  return (
    <PlaygroundCard
      title="ChatConversationTitle"
      description="Headline rendered above the message list — pulls from the active conversation."
      previewMinHeight={140}
      controls={<TextControl label="title" value={title} onChange={setTitle} />}
      preview={
        <ScopedChat conversations={[conversation]} activeConversationId={conversation.id}>
          <ChatConversation>
            <ConvoFrame>
              <ChatConversationTitle />
            </ConvoFrame>
          </ChatConversation>
        </ScopedChat>
      }
    />
  );
}

export function ChatConversationSubtitlePlayground() {
  const [subtitle, setSubtitle] = React.useState('Theming MuiChatComposer');
  const conversation: ChatConversationType = {
    id: 'subtitle-playground',
    title: 'Styling questions',
    subtitle,
    participants: [users.me, users.assistant],
  };

  return (
    <PlaygroundCard
      title="ChatConversationSubtitle"
      description="Secondary line under the title — typically the participant or status text."
      previewMinHeight={140}
      controls={<TextControl label="subtitle" value={subtitle} onChange={setSubtitle} />}
      preview={
        <ScopedChat conversations={[conversation]} activeConversationId={conversation.id}>
          <ChatConversation>
            <ConvoFrame>
              <ChatConversationSubtitle />
            </ConvoFrame>
          </ChatConversation>
        </ScopedChat>
      }
    />
  );
}

export function ChatConversationHeaderInfoPlayground() {
  const [showSubtitle, setShowSubtitle] = React.useState(true);
  const conversation: ChatConversationType = {
    id: 'info-playground',
    title: 'Styling questions',
    subtitle: 'Theming MuiChatComposer',
    participants: [users.me, users.assistant],
  };

  return (
    <PlaygroundCard
      title="ChatConversationHeaderInfo"
      description="Info group that stacks the title + subtitle into a single column."
      previewMinHeight={140}
      controls={
        <SwitchControl label="render subtitle" checked={showSubtitle} onChange={setShowSubtitle} />
      }
      preview={
        <ScopedChat conversations={[conversation]} activeConversationId={conversation.id}>
          <ChatConversation>
            <ConvoFrame>
              <ChatConversationHeaderInfo>
                <ChatConversationTitle />
                {showSubtitle ? <ChatConversationSubtitle /> : null}
              </ChatConversationHeaderInfo>
            </ConvoFrame>
          </ChatConversation>
        </ScopedChat>
      }
    />
  );
}

export function ChatConversationHeaderActionsPlayground() {
  const [count, setCount] = React.useState(2);
  const conversation: ChatConversationType = {
    id: 'actions-playground',
    title: 'Styling questions',
    participants: [users.me, users.assistant],
  };

  return (
    <PlaygroundCard
      title="ChatConversationHeaderActions"
      description="Trailing slot for icon buttons — typically search, pin, more."
      previewMinHeight={140}
      controls={
        <NumberControl label="action count" value={count} min={0} max={4} onChange={setCount} />
      }
      preview={
        <ScopedChat conversations={[conversation]} activeConversationId={conversation.id}>
          <ChatConversation>
            <ConvoFrame>
              <Box sx={{ flex: 1 }} />
              <ChatConversationHeaderActions>
                {Array.from({ length: count }, (_, i) => (
                  <Tooltip key={i} title={`Action ${i + 1}`}>
                    <IconButton size="small" aria-label={`Action ${i + 1}`}>
                      <StarIcon />
                    </IconButton>
                  </Tooltip>
                ))}
              </ChatConversationHeaderActions>
            </ConvoFrame>
          </ChatConversation>
        </ScopedChat>
      }
    />
  );
}
