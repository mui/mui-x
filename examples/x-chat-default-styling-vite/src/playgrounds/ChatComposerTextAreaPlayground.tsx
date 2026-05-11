import * as React from 'react';
import { Box } from '@mui/material';
import { ChatComposer, ChatComposerTextArea } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { NumberControl, SwitchControl, TextControl } from './controls';

export function ChatComposerTextAreaPlayground() {
  const [placeholder, setPlaceholder] = React.useState('Ask anything…');
  const [maxRows, setMaxRows] = React.useState(0);
  const [disabled, setDisabled] = React.useState(false);

  return (
    <PlaygroundCard
      title="ChatComposerTextArea"
      description="The native textarea slot — handles auto-grow, IME and submit-on-Enter."
      previewBackground="background.default"
      previewMinHeight={220}
      span={2}
      controls={
        <React.Fragment>
          <TextControl label="placeholder" value={placeholder} onChange={setPlaceholder} />
          <NumberControl
            label="maxRows (0 = uncapped)"
            value={maxRows}
            min={0}
            max={10}
            onChange={setMaxRows}
          />
          <SwitchControl label="disabled" checked={disabled} onChange={setDisabled} />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={[emptyConversation]} activeConversationId={emptyConversation.id}>
          <Box sx={{ width: '100%' }}>
            <ChatComposer disabled={disabled}>
              <ChatComposerTextArea
                placeholder={placeholder}
                maxRows={maxRows > 0 ? maxRows : undefined}
              />
            </ChatComposer>
          </Box>
        </ScopedChat>
      }
    />
  );
}
