import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatConversationList } from '@mui/x-chat';
import type { ChatConversation } from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { directoryConversations } from 'docs/src/modules/components/chat-playground/sharedFixtures';
import {
  ChoiceControl,
  DividerLabel,
  NumberControl,
  SwitchControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';

type Variant = 'default' | 'compact';

const DEFAULTS = {
  variant: 'default' as Variant,
  count: directoryConversations.length,
  allUnread: false,
  activeIndex: 0,
};

type ClassKey =
  | 'root'
  | 'scroller'
  | 'item'
  | 'itemSelected'
  | 'itemUnread'
  | 'itemFocused'
  | 'itemAvatar'
  | 'itemTitle'
  | 'itemPreview'
  | 'itemTimestamp'
  | 'itemUnreadBadge'
  | 'compact';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'The list root element.' },
  {
    name: 'scroller',
    selector: '.MuiChatConversationList-scroller',
    description: 'Inner scroller column.',
  },
  {
    name: 'item',
    selector: '.MuiChatConversationList-item',
    description: 'Each conversation row.',
  },
  {
    name: 'itemSelected',
    selector: '.MuiChatConversationList-itemSelected',
    description: 'Applied to the active conversation row.',
  },
  {
    name: 'itemUnread',
    selector: '.MuiChatConversationList-itemUnread',
    description: 'Applied to rows with unread messages.',
  },
  {
    name: 'itemFocused',
    selector: '.MuiChatConversationList-itemFocused',
    description: 'Applied to the keyboard-focused row.',
  },
  {
    name: 'itemAvatar',
    selector: '.MuiChatConversationList-itemAvatar',
    description: 'Applied to per-row avatar cells.',
  },
  {
    name: 'itemTitle',
    selector: '.MuiChatConversationList-itemTitle',
    description: 'Per-row title text.',
  },
  {
    name: 'itemPreview',
    selector: '.MuiChatConversationList-itemPreview',
    description: 'Per-row preview snippet text.',
  },
  {
    name: 'itemTimestamp',
    selector: '.MuiChatConversationList-itemTimestamp',
    description: 'Per-row timestamp text.',
  },
  {
    name: 'itemUnreadBadge',
    selector: '.MuiChatConversationList-itemUnreadBadge',
    description: 'Per-row unread count badge.',
  },
  {
    name: 'compact',
    selector: '.MuiChatConversationList-compact',
    description: 'Applied to the root when variant="compact".',
  },
];

export default function ChatConversationListPlayground() {
  const [variant, setVariant] = React.useState<Variant>(DEFAULTS.variant);
  const [count, setCount] = React.useState(DEFAULTS.count);
  const [allUnread, setAllUnread] = React.useState(DEFAULTS.allUnread);
  const [activeIndex, setActiveIndex] = React.useState(DEFAULTS.activeIndex);
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const handleReset = React.useCallback(() => {
    setVariant(DEFAULTS.variant);
    setCount(DEFAULTS.count);
    setAllUnread(DEFAULTS.allUnread);
    setActiveIndex(DEFAULTS.activeIndex);
  }, []);

  const conversations = React.useMemo<ChatConversation[]>(() => {
    return directoryConversations
      .slice(0, count)
      .map((c) =>
        allUnread
          ? { ...c, readState: 'unread' as const, unreadCount: c.unreadCount || 2 }
          : c,
      );
  }, [count, allUnread]);

  const safeActiveIndex = Math.min(
    activeIndex,
    Math.max(0, conversations.length - 1),
  );
  const activeId = conversations[safeActiveIndex]?.id;
  const listSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatConversationList"
      description="Inbox sidebar — avatar, title, preview, timestamp and unread badge."
      previewMinHeight={340}
      onReset={handleReset}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <ChoiceControl<Variant>
            label="variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <DividerLabel>fixture data</DividerLabel>
          <NumberControl
            label="conversation count"
            value={count}
            min={1}
            max={directoryConversations.length}
            onChange={setCount}
          />
          <NumberControl
            label="active index"
            value={safeActiveIndex}
            min={0}
            max={Math.max(0, conversations.length - 1)}
            onChange={setActiveIndex}
            helperText="Maps to ScopedChat.activeConversationId."
          />
          <SwitchControl
            label="mark every conversation unread"
            checked={allUnread}
            onChange={setAllUnread}
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={conversations} activeConversationId={activeId}>
          <Box
            sx={{
              width: '100%',
              height: 340,
              overflow: 'hidden',
            }}
          >
            <ChatConversationList variant={variant} sx={listSx as any} />
          </Box>
        </ScopedChat>
      }
    />
  );
}
