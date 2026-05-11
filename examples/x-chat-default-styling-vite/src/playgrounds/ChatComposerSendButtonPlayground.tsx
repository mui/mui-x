import * as React from 'react';
import { Box } from '@mui/material';
import { ChatComposer, ChatComposerSendButton, ChatComposerTextArea } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { ChoiceControl, SwitchControl } from './controls';

function SendArrow() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

type IconChoice = 'send' | 'play' | 'stop';

const icons: Record<IconChoice, React.ReactNode> = {
  send: <SendArrow />,
  play: <PlayIcon />,
  stop: <StopIcon />,
};

export function ChatComposerSendButtonPlayground() {
  const [icon, setIcon] = React.useState<IconChoice>('send');
  const [disabled, setDisabled] = React.useState(false);
  const [composerDisabled, setComposerDisabled] = React.useState(false);

  return (
    <PlaygroundCard
      title="ChatComposerSendButton"
      description="Primary action — submits the composer form and reads the busy state from the store."
      previewMinHeight={200}
      span={2}
      controls={
        <React.Fragment>
          <ChoiceControl<IconChoice>
            label="icon"
            value={icon}
            options={['send', 'play', 'stop'] as const}
            onChange={setIcon}
          />
          <SwitchControl
            label="forced disabled"
            checked={disabled}
            onChange={setDisabled}
            helperText="Override the auto-disabled state."
          />
          <SwitchControl
            label="composer disabled"
            checked={composerDisabled}
            onChange={setComposerDisabled}
            helperText="Disable the parent composer form."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={[emptyConversation]} activeConversationId={emptyConversation.id}>
          <Box sx={{ width: '100%' }}>
            <ChatComposer disabled={composerDisabled}>
              <ChatComposerTextArea placeholder="Type and submit…" />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ChatComposerSendButton disabled={disabled || undefined}>
                  {icons[icon]}
                </ChatComposerSendButton>
              </Box>
            </ChatComposer>
          </Box>
        </ScopedChat>
      }
    />
  );
}
