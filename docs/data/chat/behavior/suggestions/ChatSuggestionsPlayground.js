import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatSuggestions } from '@mui/x-chat';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat } from '../../_playground/sharedProviders';
import { emptyConversation } from '../../_playground/sharedFixtures';
import {
  DividerLabel,
  NumberControl,
  SwitchControl,
  TextControl,
} from '../../_playground/controls';
import { useCustomizations } from '../../_playground/useCustomizations';

const POOL = [
  'Show me the default ChatComposer',
  'How do I style ChatMessage bubbles?',
  'Render code blocks with syntax highlighting',
  'Wire up RAG sources',
  'Toggle dark mode in MUI X Chat',
  'Customise the conversation list row',
  'Disable attachments on the composer',
];

const CLASS_DEFS = [
  { name: 'root', description: 'The root container of the suggestions row.' },
  {
    name: 'item',
    selector: '.MuiChatSuggestions-item',
    description: 'Each suggestion pill.',
  },
];

export default function ChatSuggestionsPlayground() {
  const [count, setCount] = React.useState(4);
  const [autoSubmit, setAutoSubmit] = React.useState(false);
  const [alwaysVisible, setAlwaysVisible] = React.useState(false);
  const [first, setFirst] = React.useState(POOL[0]);
  const classesCustomizations = useCustomizations(CLASS_DEFS);

  const suggestions = React.useMemo(() => {
    const list = [first, ...POOL.slice(1)].slice(0, count);
    return list;
  }, [count, first]);

  const rootSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatSuggestions"
      description="Pill-style prompts shown when the active thread is empty."
      previewMinHeight={180}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <SwitchControl
            label="autoSubmit"
            checked={autoSubmit}
            onChange={setAutoSubmit}
            helperText="Submit on click instead of populating the input."
          />
          <SwitchControl
            label="alwaysVisible"
            checked={alwaysVisible}
            onChange={setAlwaysVisible}
            helperText="Render even when the active thread has messages."
          />
          <DividerLabel>suggestions data</DividerLabel>
          <NumberControl
            label="suggestion count"
            value={count}
            min={1}
            max={POOL.length}
            onChange={setCount}
          />
          <TextControl label="first suggestion" value={first} onChange={setFirst} />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[emptyConversation]}
          activeConversationId={emptyConversation.id}
        >
          <Box sx={{ width: '100%' }}>
            <ChatSuggestions
              suggestions={suggestions}
              autoSubmit={autoSubmit}
              alwaysVisible={alwaysVisible}
              sx={rootSx}
            />
          </Box>
        </ScopedChat>
      }
    />
  );
}
