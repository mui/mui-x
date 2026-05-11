import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatSuggestions } from '@mui/x-chat';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat } from '../../_playground/sharedProviders';
import { emptyConversation } from '../../_playground/sharedFixtures';
import {
  NumberControl,
  SwitchControl,
  TextControl,
} from '../../_playground/controls';

const POOL = [
  'Show me the default ChatComposer',
  'How do I style ChatMessage bubbles?',
  'Render code blocks with syntax highlighting',
  'Wire up RAG sources',
  'Toggle dark mode in MUI X Chat',
  'Customise the conversation list row',
  'Disable attachments on the composer',
];

export default function ChatSuggestionsPlayground() {
  const [count, setCount] = React.useState(4);
  const [autoSubmit, setAutoSubmit] = React.useState(false);
  const [first, setFirst] = React.useState(POOL[0]);

  const suggestions = React.useMemo(() => {
    const list = [first, ...POOL.slice(1)].slice(0, count);
    return list;
  }, [count, first]);
  return (
    <PlaygroundCard
      title="ChatSuggestions"
      description="Pill-style prompts shown when the active thread is empty."
      previewMinHeight={180}
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
        <ScopedChat
          conversations={[emptyConversation]}
          activeConversationId={emptyConversation.id}
        >
          <Box sx={{ width: '100%' }}>
            <ChatSuggestions suggestions={suggestions} autoSubmit={autoSubmit} />
          </Box>
        </ScopedChat>
      }
    />
  );
}
