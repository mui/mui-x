'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerAttachmentList,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
} from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import { minimalConversation } from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) => `Draft submitted: "${text}".`,
});

export default function ComposerVariantsStandalone() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          variant=&quot;default&quot;
        </Typography>
        <ChatProvider
          adapter={adapter}
          initialActiveConversationId={minimalConversation.id}
          initialConversations={[minimalConversation]}
        >
          <ChatComposer variant="default">
            <ChatComposerTextArea
              aria-label="Message"
              placeholder="Type a message"
            />
            <ChatComposerToolbar>
              <ChatComposerAttachButton>Attach</ChatComposerAttachButton>
              <ChatComposerSendButton>Send</ChatComposerSendButton>
            </ChatComposerToolbar>
          </ChatComposer>
        </ChatProvider>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          variant=&quot;compact&quot;
        </Typography>
        <ChatProvider
          adapter={adapter}
          initialActiveConversationId={minimalConversation.id}
          initialConversations={[minimalConversation]}
        >
          <ChatComposer variant="compact">
            <ChatComposerAttachmentList />
            <ChatComposerAttachButton>Attach</ChatComposerAttachButton>
            <ChatComposerTextArea
              aria-label="Message"
              maxRows={5}
              placeholder="Type a message"
            />
            <ChatComposerSendButton>Send</ChatComposerSendButton>
          </ChatComposer>
        </ChatProvider>
      </Box>
    </Box>
  );
}
