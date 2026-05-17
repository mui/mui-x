import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatTypingIndicator } from '@mui/x-chat';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat, TypingEffect } from '../../_playground/sharedProviders';
import { emptyConversation } from '../../_playground/sharedFixtures';
import { DividerLabel, NumberControl } from '../../_playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from '../../_playground/useCustomizations';
import { users } from '../../_playground/data';

const candidates = [users.assistant, users.alice];

type ClassKey = 'root';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'The typing indicator container.' },
];

export default function ChatTypingIndicatorPlayground() {
  const [count, setCount] = React.useState(1);
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);
  const userIds = React.useMemo(
    () => candidates.slice(0, count).map((u) => u.id),
    [count],
  );

  const indicatorSx = classesCustomizations.toClassesSx();

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
            <ChatTypingIndicator sx={indicatorSx as any} />
          </Box>
        </ScopedChat>
      }
    />
  );
}
