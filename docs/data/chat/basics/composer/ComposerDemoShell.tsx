'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerHelperText,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatConversation,
} from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import { minimalConversation } from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Draft submitted: "${text}". The standalone composer is wired through ChatProvider.`,
});

interface ComposerDemoShellProps {
  beforeComposer?: React.ReactNode;
  composerProps?: React.ComponentProps<typeof ChatComposer>;
  inputProps?: React.ComponentProps<typeof ChatComposerTextArea>;
  hideAttachButton?: boolean;
  helperText?: React.ReactNode;
  composerValue?: string;
  onComposerValueChange?: (value: string) => void;
}

export function ComposerDemoShell(props: ComposerDemoShellProps) {
  const {
    beforeComposer,
    composerProps,
    inputProps,
    hideAttachButton = false,
    helperText,
    composerValue,
    onComposerValueChange,
  } = props;

  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      composerValue={composerValue}
      onComposerValueChange={onComposerValueChange}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {beforeComposer}
        <Box
          sx={{
            height: 320,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <ChatConversation sx={{ justifyContent: 'flex-end' }}>
            <ChatComposer {...composerProps}>
              <ChatComposerTextArea
                aria-label="Message"
                placeholder="Type a message"
                {...inputProps}
              />
              {helperText ? (
                <ChatComposerHelperText>{helperText}</ChatComposerHelperText>
              ) : null}
              <ChatComposerToolbar>
                {!hideAttachButton ? (
                  <ChatComposerAttachButton>Attach</ChatComposerAttachButton>
                ) : null}
                <ChatComposerSendButton>Send</ChatComposerSendButton>
              </ChatComposerToolbar>
            </ChatComposer>
          </ChatConversation>
        </Box>
      </Box>
    </ChatProvider>
  );
}
