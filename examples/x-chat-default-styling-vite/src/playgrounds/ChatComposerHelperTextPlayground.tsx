import * as React from 'react';
import { Box } from '@mui/material';
import { ChatComposer, ChatComposerHelperText, ChatComposerTextArea } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { SwitchControl, TextControl } from './controls';

export function ChatComposerHelperTextPlayground() {
  const [show, setShow] = React.useState(true);
  const [text, setText] = React.useState('Press Enter to send, Shift+Enter for a new line.');

  return (
    <PlaygroundCard
      title="ChatComposerHelperText"
      description="Caption under the textarea — switches to error tokens on validation failure."
      previewMinHeight={200}
      span={2}
      controls={
        <React.Fragment>
          <SwitchControl label="visible" checked={show} onChange={setShow} />
          <TextControl label="children" value={text} onChange={setText} />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={[emptyConversation]} activeConversationId={emptyConversation.id}>
          <Box sx={{ width: '100%' }}>
            <ChatComposer>
              <ChatComposerTextArea placeholder="Try Shift+Enter for a new line…" />
              {show ? <ChatComposerHelperText>{text}</ChatComposerHelperText> : null}
            </ChatComposer>
          </Box>
        </ScopedChat>
      }
    />
  );
}
