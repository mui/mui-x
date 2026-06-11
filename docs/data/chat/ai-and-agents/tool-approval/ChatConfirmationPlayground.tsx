import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { ChatConfirmation } from '@mui/x-chat';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  DividerLabel,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';

type ClassKey =
  | 'root'
  | 'icon'
  | 'message'
  | 'actions'
  | 'confirmButton'
  | 'cancelButton';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'The confirmation card.' },
  {
    name: 'icon',
    selector: '.MuiChatConfirmation-icon',
    description: 'The warning icon container.',
  },
  {
    name: 'message',
    selector: '.MuiChatConfirmation-message',
    description: 'The message paragraph.',
  },
  {
    name: 'actions',
    selector: '.MuiChatConfirmation-actions',
    description: 'The button row.',
  },
  {
    name: 'confirmButton',
    selector: '.MuiChatConfirmation-confirmButton',
    description: 'The primary confirm button.',
  },
  {
    name: 'cancelButton',
    selector: '.MuiChatConfirmation-cancelButton',
    description: 'The cancel button.',
  },
];

export default function ChatConfirmationPlayground() {
  const [message, setMessage] = React.useState(
    'The assistant wants to delete 3 files. Approve this action?',
  );
  const [confirmLabel, setConfirmLabel] = React.useState('Allow');
  const [cancelLabel, setCancelLabel] = React.useState('Deny');
  const [resolution, setResolution] = React.useState<'confirm' | 'cancel' | null>(
    null,
  );
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const cardSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatConfirmation"
      description="A confirmation card for gating a tool call before it runs."
      previewMinHeight={220}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <TextControl
            label="message"
            value={message}
            onChange={setMessage}
            multiline
            rows={2}
          />
          <TextControl
            label="confirmLabel"
            value={confirmLabel}
            onChange={setConfirmLabel}
          />
          <TextControl
            label="cancelLabel"
            value={cancelLabel}
            onChange={setCancelLabel}
          />
        </React.Fragment>
      }
      preview={
        <Box sx={{ width: '100%' }}>
          <ChatConfirmation
            message={message}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            onConfirm={() => setResolution('confirm')}
            onCancel={() => setResolution('cancel')}
            sx={cardSx as any}
          />
          <Snackbar
            open={resolution !== null}
            autoHideDuration={1600}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={() => setResolution(null)}
          >
            <Alert
              severity={resolution === 'confirm' ? 'success' : 'warning'}
              variant="filled"
              onClose={() => setResolution(null)}
            >
              {resolution === 'confirm' ? 'onConfirm fired' : 'onCancel fired'}
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
}
