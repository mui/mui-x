import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatComposerAttachmentList } from '@mui/x-chat';
import { useChatStore } from '@mui/x-chat/headless';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat } from '../../_playground/sharedProviders';
import { emptyConversation } from '../../_playground/sharedFixtures';
import { NumberControl } from '../../_playground/controls';

const POOL = [
  { name: 'design-spec.pdf', type: 'application/pdf', size: 134_512 },
  { name: 'screenshot.png', type: 'image/png', size: 982_146 },
  { name: 'release-notes.md', type: 'text/markdown', size: 4_220 },
  { name: 'palette.svg', type: 'image/svg+xml', size: 18_734 },
  { name: 'spec-v2.docx', type: 'application/vnd.openxmlformats', size: 76_891 },
];

function makeDraftAttachments(files) {
  return files.map((spec, index) => {
    const file = new File(['placeholder'], spec.name, { type: spec.type });
    try {
      Object.defineProperty(file, 'size', { value: spec.size });
    } catch {
      // size is read-only in some runtimes; the preview still renders the chip.
    }
    return {
      localId: `demo-attachment-${index}-${spec.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
      file,
      status: 'uploaded',
      progress: 1,
    };
  });
}

function AttachmentsEffect({ files }) {
  const store = useChatStore();
  React.useEffect(() => {
    store.setComposerAttachments(makeDraftAttachments(files));
    return () => {
      store.setComposerAttachments([]);
    };
  }, [store, files]);
  return null;
}

export default function ChatComposerAttachmentListPlayground() {
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
        <ScopedChat
          conversations={[emptyConversation]}
          activeConversationId={emptyConversation.id}
        >
          <AttachmentsEffect files={files} />
          <Box sx={{ width: '100%' }}>
            <ChatComposerAttachmentList />
          </Box>
        </ScopedChat>
      }
    />
  );
}
