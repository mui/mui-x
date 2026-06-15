'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Echo: "${text}". Switch to Branded above to restyle this chat with theme + sx alone.`,
});

const brandTheme = createTheme({
  palette: { primary: { main: '#5b6cff' } },
  shape: { borderRadius: 16 },
});

export default function EightyTwentyDemo() {
  const [skin, setSkin] = React.useState('default');

  const chat = (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      sx={{ height: 480 }}
    />
  );

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={skin}
        onChange={(_, next) => {
          if (next !== null) {
            setSkin(next);
          }
        }}
        aria-label="Theme skin"
      >
        <ToggleButton value="default">Default</ToggleButton>
        <ToggleButton value="branded">Branded</ToggleButton>
      </ToggleButtonGroup>

      {skin === 'branded' ? (
        <ThemeProvider theme={brandTheme}>{chat}</ThemeProvider>
      ) : (
        chat
      )}
    </Stack>
  );
}
