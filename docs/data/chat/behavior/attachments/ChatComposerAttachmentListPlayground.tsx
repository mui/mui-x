import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatComposerAttachmentList } from '@mui/x-chat';
import { useChatStore, type ChatDraftAttachmentStatus } from '@mui/x-chat/headless';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat } from '../../_playground/sharedProviders';
import { emptyConversation } from '../../_playground/sharedFixtures';
import {
  ChoiceControl,
  DividerLabel,
  NumberControl,
} from '../../_playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from '../../_playground/useCustomizations';

interface FileSpec {
  name: string;
  type: string;
  size: number;
}

const POOL: FileSpec[] = [
  { name: 'design-spec.pdf', type: 'application/pdf', size: 134_512 },
  { name: 'screenshot.png', type: 'image/png', size: 982_146 },
  { name: 'release-notes.md', type: 'text/markdown', size: 4_220 },
  { name: 'palette.svg', type: 'image/svg+xml', size: 18_734 },
  { name: 'spec-v2.docx', type: 'application/vnd.openxmlformats', size: 76_891 },
];

const PROGRESS_BY_STATUS: Record<ChatDraftAttachmentStatus, number> = {
  queued: 0,
  uploading: 0.45,
  uploaded: 1,
  error: 0,
};

function makeDraftAttachments(files: FileSpec[], status: ChatDraftAttachmentStatus) {
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

function AttachmentsEffect({
  files,
  status,
}: {
  files: FileSpec[];
  status: ChatDraftAttachmentStatus;
}) {
  const store = useChatStore();
  React.useEffect(() => {
    store.setComposerAttachments(makeDraftAttachments(files, status));
    return () => {
      store.setComposerAttachments([]);
    };
  }, [store, files, status]);
  return null;
}

type ClassKey = 'attachmentList';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  {
    name: 'attachmentList',
    selector: '.MuiChatComposer-attachmentList',
    description: 'The pending attachments row above the textarea.',
  },
];

export default function ChatComposerAttachmentListPlayground() {
  const [count, setCount] = React.useState(2);
  const [status, setStatus] = React.useState<ChatDraftAttachmentStatus>('uploaded');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);
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
          <ChoiceControl<ChatDraftAttachmentStatus>
            label="status"
            value={status}
            options={['uploading', 'uploaded', 'error'] as const}
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
          <Box sx={{ width: '100%', ...(wrapperSx as object) }}>
            <ChatComposerAttachmentList />
          </Box>
        </ScopedChat>
      }
    />
  );
}
