import * as React from 'react';
import { Box } from '@mui/material';
import { ChatTypingIndicator } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat, TypingEffect } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { NumberControl } from './controls';
import { users } from '../data';

const candidates = [users.assistant, users.alice];

export function ChatTypingIndicatorPlayground() {
  const [count, setCount] = React.useState(1);
  const userIds = React.useMemo(() => candidates.slice(0, count).map((u) => u.id), [count]);

  const codeExample = `import { ChatTypingIndicator } from '@mui/x-chat';

// Reads typing state from ChatProvider context
<ChatTypingIndicator />`;

  return (
    <PlaygroundCard
      title="ChatTypingIndicator"
      description="Renders when participants are typing in the active conversation."
      previewMinHeight={140}
      codeExample={codeExample}
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
        <ScopedChat conversations={[emptyConversation]} activeConversationId={emptyConversation.id}>
          <TypingEffect conversationId={emptyConversation.id} userIds={userIds} />
          <Box sx={{ width: '100%' }}>
            <ChatTypingIndicator />
          </Box>
        </ScopedChat>
      }
    />
  );
}
