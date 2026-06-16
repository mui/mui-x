import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatSuggestions } from '@mui/x-chat';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  directoryConversations,
  emptyConversation,
  groupThreadMessages,
} from 'docs/src/modules/components/chat-playground/sharedFixtures';
import {
  DividerLabel,
  NumberControl,
  SwitchControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';

const POOL = [
  'Show me the default ChatComposer',
  'How do I style ChatMessage bubbles?',
  'Render code blocks with syntax highlighting',
  'Wire up RAG sources',
  'Toggle dark mode in MUI X Chat',
  'Customise the conversation list row',
  'Disable attachments on the composer',
];

type ClassKey = 'root' | 'item';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
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
  const [hasMessages, setHasMessages] = React.useState(false);
  const [first, setFirst] = React.useState(POOL[0]);
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const suggestions = React.useMemo(() => {
    const list = [first, ...POOL.slice(1)].slice(0, count);
    return list;
  }, [count, first]);

  const rootSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatSuggestions"
      description="Pill-style prompts for the active thread. By default they only render while the thread is empty; alwaysVisible keeps them available as a next-prompt row."
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
          <DividerLabel>preview state</DividerLabel>
          <SwitchControl
            label="thread has messages"
            checked={hasMessages}
            onChange={setHasMessages}
            helperText="Seed the preview thread with messages. With alwaysVisible off, the suggestions render nothing."
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
          conversations={
            hasMessages ? [directoryConversations[0]] : [emptyConversation]
          }
          messages={hasMessages ? groupThreadMessages : undefined}
          activeConversationId={hasMessages ? 'styling' : emptyConversation.id}
        >
          <Box sx={{ width: '100%' }}>
            <ChatSuggestions
              suggestions={suggestions}
              autoSubmit={autoSubmit}
              alwaysVisible={alwaysVisible}
              sx={rootSx as any}
            />
          </Box>
        </ScopedChat>
      }
    />
  );
}
