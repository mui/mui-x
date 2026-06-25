import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatTypingIndicator } from '@mui/x-chat';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  ScopedChat,
  TypingEffect,
} from 'docs/src/modules/components/chat-playground/sharedProviders';
import { emptyConversation } from 'docs/src/modules/components/chat-playground/sharedFixtures';
import {
  DividerLabel,
  NumberControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const candidates = [users.alice, users.mira];

const CLASS_DEFS = [
  { name: 'root', description: 'The typing indicator container.' },
];

export default function ChatTypingIndicatorPlayground() {
  const [count, setCount] = React.useState(1);
  const classesCustomizations = useCustomizations(CLASS_DEFS);
  const userIds = React.useMemo(
    () => candidates.slice(0, count).map((u) => u.id),
    [count],
  );

  const indicatorSx = classesCustomizations.toClassesSx();

  const label = React.useMemo(() => {
    if (count === 0) {
      return '(renders nothing)';
    }
    const names = candidates.slice(0, count).map((u) => u.displayName ?? u.id);
    return `${names.join(', ')}${count === 1 ? ' is typing' : ' are typing'}`;
  }, [count]);

  return (
    <PlaygroundCard
      title="ChatTypingIndicator"
      description="Renders when participants are typing in the active conversation."
      previewMinHeight={140}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>state (store)</DividerLabel>
          <NumberControl
            label="users typing"
            value={count}
            min={0}
            max={candidates.length}
            onChange={setCount}
            helperText="Calls store.setTypingUser() — not a component prop."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[emptyConversation]}
          activeConversationId={emptyConversation.id}
        >
          <TypingEffect conversationId={emptyConversation.id} userIds={userIds} />
          <Box sx={{ width: '100%' }}>
            <ChatTypingIndicator sx={indicatorSx} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1 }}
            >
              count: {count} · data-count=&quot;{count}&quot; · label: {label}
            </Typography>
          </Box>
        </ScopedChat>
      }
    />
  );
}
