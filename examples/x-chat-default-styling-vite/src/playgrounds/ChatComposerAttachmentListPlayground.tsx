import * as React from 'react';
import { Box } from '@mui/material';
import { ChatComposer, ChatComposerAttachmentList, ChatComposerTextArea } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ComposerAttachmentsEffect, ScopedChat } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { NumberControl } from './controls';

const POOL = [
  { name: 'design-spec.pdf', type: 'application/pdf', size: 134_512 },
  { name: 'screenshot.png', type: 'image/png', size: 982_146 },
  { name: 'release-notes.md', type: 'text/markdown', size: 4_220 },
  { name: 'palette.svg', type: 'image/svg+xml', size: 18_734 },
  { name: 'spec-v2.docx', type: 'application/vnd.openxmlformats', size: 76_891 },
];

export function ChatComposerAttachmentListPlayground() {
  const [count, setCount] = React.useState(2);
  const files = React.useMemo(() => POOL.slice(0, count), [count]);

  return (
    <PlaygroundCard
      title="ChatComposerAttachmentList"
      description="Pending-attachment chips rendered above the textarea."
      previewMinHeight={220}
      span={2}
      controls={
        <NumberControl
          label="attachment count"
          value={count}
          min={0}
          max={POOL.length}
          onChange={setCount}
        />
      }
      preview={
        <ScopedChat conversations={[emptyConversation]} activeConversationId={emptyConversation.id}>
          <ComposerAttachmentsEffect files={files} />
          <Box sx={{ width: '100%' }}>
            <ChatComposer>
              <ChatComposerAttachmentList />
              <ChatComposerTextArea placeholder="Attachments preview live above…" />
            </ChatComposer>
          </Box>
        </ScopedChat>
      }
    />
  );
}
