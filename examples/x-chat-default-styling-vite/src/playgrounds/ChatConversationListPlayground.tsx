import * as React from 'react';
import { Box } from '@mui/material';
import { ChatConversationList } from '@mui/x-chat';
import type { ChatConversation } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { directoryConversations } from './sharedFixtures';
import { ChoiceControl, NumberControl, SwitchControl } from './controls';

type Variant = 'default' | 'compact';

const DEFAULTS = {
  variant: 'default' as Variant,
  count: directoryConversations.length,
  allUnread: false,
  activeIndex: 0,
};

export function ChatConversationListPlayground() {
  const [variant, setVariant] = React.useState<Variant>(DEFAULTS.variant);
  const [count, setCount] = React.useState(DEFAULTS.count);
  const [allUnread, setAllUnread] = React.useState(DEFAULTS.allUnread);
  const [activeIndex, setActiveIndex] = React.useState(DEFAULTS.activeIndex);

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
        allUnread ? { ...c, readState: 'unread' as const, unreadCount: c.unreadCount || 2 } : c,
      );
  }, [count, allUnread]);

  const safeActiveIndex = Math.min(activeIndex, Math.max(0, conversations.length - 1));
  const activeId = conversations[safeActiveIndex]?.id;

  const codeExample = `import { ChatConversationList } from '@mui/x-chat';

// Inside ChatProvider
<ChatConversationList />`;

  return (
    <PlaygroundCard
      title="ChatConversationList"
      description="Inbox sidebar — avatar, title, preview, timestamp and unread badge."
      previewMinHeight={340}
      codeExample={codeExample}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <ChoiceControl<Variant>
            label="variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
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
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <ChatConversationList variant={variant} />
          </Box>
        </ScopedChat>
      }
    />
  );
}
