'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ChatConversation, ChatMessageList } from '@mui/x-chat';

import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';

const MARKDOWN_SAMPLE = `### Markdown rendering

The built-in renderer turns model output into **bold**, _italic_, and \`inline code\`.

- First item
- Second item with a [link](https://mui.com)
- Third item

\`\`\`ts
const greeting: string = 'Hello, markdown!';
console.log(greeting);
\`\`\`

Footnotes are supported too.[^1]

<b>Raw HTML stays escaped text.</b>

[^1]: This is the footnote definition.
`;

const conversation = {
  id: 'markdown-playground',
  title: 'Markdown playground',
  participants: [],
};

export default function MarkdownPlayground() {
  const [source, setSource] = React.useState(MARKDOWN_SAMPLE);

  // The assistant message is re-seeded whenever the textarea changes; ScopedChat
  // remounts the provider on seed-key change so the bubble re-renders live.
  const messages = React.useMemo(
    () => [
      {
        id: 'markdown-playground-msg',
        conversationId: conversation.id,
        role: 'assistant',
        status: 'sent',
        createdAt: '2026-03-15T10:00:00.000Z',
        parts: [{ type: 'text', text: source }],
      },
    ],
    [source],
  );

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2">Markdown source</Typography>
        <TextField
          value={source}
          onChange={(event) => setSource(event.target.value)}
          multiline
          minRows={14}
          fullWidth
          slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: 13 } } }}
        />
      </Stack>
      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2">Rendered message</Typography>
        <Box
          sx={{
            height: 360,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <ScopedChat conversations={[conversation]} messages={messages}>
            <ChatConversation>
              <ChatMessageList />
            </ChatConversation>
          </ScopedChat>
        </Box>
      </Stack>
    </Stack>
  );
}
