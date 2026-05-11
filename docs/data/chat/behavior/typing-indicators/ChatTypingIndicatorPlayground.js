import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatTypingIndicator } from '@mui/x-chat';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat, TypingEffect } from '../../_playground/sharedProviders';
import { emptyConversation } from '../../_playground/sharedFixtures';
import { NumberControl } from '../../_playground/controls';
import { users } from '../../_playground/data';

const candidates = [users.assistant, users.alice];

export default function ChatTypingIndicatorPlayground() {
  const [count, setCount] = React.useState(1);
  const userIds = React.useMemo(
    () => candidates.slice(0, count).map((u) => u.id),
    [count],
  );
  return (
    <PlaygroundCard
      title="ChatTypingIndicator"
      description="Renders when participants are typing in the active conversation."
      previewMinHeight={140}
      controls={
        <NumberControl
          label="users typing"
          value={count}
          min={0}
          max={candidates.length}
          onChange={setCount}
        />
      }
      preview={
        <ScopedChat
          conversations={[emptyConversation]}
          activeConversationId={emptyConversation.id}
        >
          <TypingEffect conversationId={emptyConversation.id} userIds={userIds} />
          <Box sx={{ width: '100%' }}>
            <ChatTypingIndicator />
          </Box>
        </ScopedChat>
      }
    />
  );
}
