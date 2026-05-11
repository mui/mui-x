import * as React from 'react';
import { Box } from '@mui/material';
import {
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
} from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { SwitchControl } from './controls';

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M16.5 6v11.5a4 4 0 1 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 1 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 1 0 11 0V6h-1.5z" />
    </svg>
  );
}

export function ChatComposerToolbarPlayground() {
  const [showAttach, setShowAttach] = React.useState(true);
  const [showSend, setShowSend] = React.useState(true);

  return (
    <PlaygroundCard
      title="ChatComposerToolbar"
      description="Bottom row of the default composer — hosts attach + send buttons."
      previewMinHeight={220}
      span={2}
      controls={
        <React.Fragment>
          <SwitchControl label="attach button" checked={showAttach} onChange={setShowAttach} />
          <SwitchControl label="send button" checked={showSend} onChange={setShowSend} />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={[emptyConversation]} activeConversationId={emptyConversation.id}>
          <Box sx={{ width: '100%' }}>
            <ChatComposer>
              <ChatComposerTextArea placeholder="Type something…" />
              <ChatComposerToolbar>
                {showAttach ? (
                  <ChatComposerAttachButton>
                    <AttachIcon />
                  </ChatComposerAttachButton>
                ) : null}
                {showSend ? (
                  <ChatComposerSendButton>
                    <SendIcon />
                  </ChatComposerSendButton>
                ) : null}
              </ChatComposerToolbar>
            </ChatComposer>
          </Box>
        </ScopedChat>
      }
    />
  );
}
