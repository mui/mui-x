import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatComposerAttachmentList } from '@mui/x-chat';
import { useChatStore } from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { emptyConversation } from 'docs/src/modules/components/chat-playground/sharedFixtures';
import {
  ChoiceControl,
  DividerLabel,
  NumberControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';

const POOL = [
  { name: 'design-spec.pdf', type: 'application/pdf', size: 134_512 },
  { name: 'screenshot.png', type: 'image/png', size: 982_146 },
  { name: 'release-notes.md', type: 'text/markdown', size: 4_220 },
  { name: 'palette.svg', type: 'image/svg+xml', size: 18_734 },
  { name: 'spec-v2.docx', type: 'application/vnd.openxmlformats', size: 76_891 },
];

const PROGRESS_BY_STATUS = {
  queued: 0,
  uploading: 45,
  uploaded: 100,
  error: 0,
};

function makeDraftAttachments(files, status) {
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
      status,
      progress: PROGRESS_BY_STATUS[status],
    };
  });
}

function AttachmentsEffect({ files, status }) {
  const store = useChatStore();
  React.useEffect(() => {
    store.setComposerAttachments(makeDraftAttachments(files, status));
    return () => {
      store.setComposerAttachments([]);
    };
  }, [store, files, status]);
  return null;
}

const CLASS_DEFS = [
  {
    name: 'attachmentList',
    selector: '.MuiChatComposer-attachmentList',
    description: 'The pending attachments row above the textarea.',
  },
];

export default function ChatComposerAttachmentListPlayground() {
  const [count, setCount] = React.useState(2);
  const [status, setStatus] = React.useState('uploaded');
  const classesCustomizations = useCustomizations(CLASS_DEFS);
  const files = React.useMemo(() => POOL.slice(0, count), [count]);

  const wrapperSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatComposerAttachmentList"
      description="Pending-attachment chips rendered above the textarea."
      previewMinHeight={220}
      span={2}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>state (store)</DividerLabel>
          <NumberControl
            label="attachment count"
            value={count}
            min={0}
            max={POOL.length}
            onChange={setCount}
          />
          <ChoiceControl
            label="status"
            value={status}
            options={['queued', 'uploading', 'uploaded', 'error']}
            onChange={setStatus}
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[emptyConversation]}
          activeConversationId={emptyConversation.id}
        >
          <AttachmentsEffect files={files} status={status} />
          <Box sx={{ width: '100%', ...wrapperSx }}>
            <ChatComposerAttachmentList />
          </Box>
        </ScopedChat>
      }
    />
  );
}
