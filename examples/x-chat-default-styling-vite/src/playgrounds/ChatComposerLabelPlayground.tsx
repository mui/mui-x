import * as React from 'react';
import { Box } from '@mui/material';
import { ChatComposer, ChatComposerLabel, ChatComposerTextArea } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { SwitchControl, TextControl } from './controls';

export function ChatComposerLabelPlayground() {
  const [text, setText] = React.useState('Message to support');
  const [linked, setLinked] = React.useState(true);
  const inputId = 'composer-label-playground-input';

  return (
    <PlaygroundCard
      title="ChatComposerLabel"
      description="Visible <label> linked to the textarea — improves a11y and click-to-focus."
      previewMinHeight={200}
      span={2}
      controls={
        <React.Fragment>
          <TextControl label="label" value={text} onChange={setText} />
          <SwitchControl
            label="link via htmlFor"
            checked={linked}
            onChange={setLinked}
            helperText="Forward to the textarea's id."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={[emptyConversation]} activeConversationId={emptyConversation.id}>
          <Box sx={{ width: '100%' }}>
            <ChatComposer>
              <ChatComposerLabel htmlFor={linked ? inputId : undefined}>{text}</ChatComposerLabel>
              <ChatComposerTextArea id={inputId} placeholder="Click the label above to focus me…" />
            </ChatComposer>
          </Box>
        </ScopedChat>
      }
    />
  );
}
