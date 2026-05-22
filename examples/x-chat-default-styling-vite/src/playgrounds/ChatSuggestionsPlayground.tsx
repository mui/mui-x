import * as React from 'react';
import { Box } from '@mui/material';
import { ChatSuggestions } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { NumberControl, SwitchControl, TextControl } from './controls';

const POOL = [
  'Show me the default ChatComposer',
  'How do I style ChatMessage bubbles?',
  'Render code blocks with syntax highlighting',
  'Wire up RAG sources',
  'Toggle dark mode in MUI X Chat',
  'Customise the conversation list row',
  'Disable attachments on the composer',
];

export function ChatSuggestionsPlayground() {
  const [count, setCount] = React.useState(4);
  const [autoSubmit, setAutoSubmit] = React.useState(false);
  const [first, setFirst] = React.useState(POOL[0]);

  const suggestions = React.useMemo(() => {
    const list = [first, ...POOL.slice(1)].slice(0, count);
    return list;
  }, [count, first]);

  const codeExample = `import { ChatSuggestions } from '@mui/x-chat';

<ChatSuggestions
  suggestions={[
    'How do I style bubbles?',
    'Show me the composer',
    'Render code blocks',
  ]}
  autoSubmit={false}
/>`;

  return (
    <PlaygroundCard
      title="ChatSuggestions"
      description="Pill-style prompts shown when the active thread is empty."
      previewMinHeight={180}
      codeExample={codeExample}
      controls={
        <React.Fragment>
          <NumberControl
            label="suggestion count"
            value={count}
            min={1}
            max={POOL.length}
            onChange={setCount}
          />
          <TextControl label="first suggestion" value={first} onChange={setFirst} />
          <SwitchControl
            label="autoSubmit"
            checked={autoSubmit}
            onChange={setAutoSubmit}
            helperText="Submit on click instead of populating the input."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={[emptyConversation]} activeConversationId={emptyConversation.id}>
          <Box sx={{ width: '100%' }}>
            <ChatSuggestions suggestions={suggestions} autoSubmit={autoSubmit} />
          </Box>
        </ScopedChat>
      }
    />
  );
}
