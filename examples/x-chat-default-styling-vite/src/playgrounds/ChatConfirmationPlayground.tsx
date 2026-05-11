import * as React from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import { ChatConfirmation } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { TextControl } from './controls';

export function ChatConfirmationPlayground() {
  const [message, setMessage] = React.useState(
    'The assistant wants to delete 3 files. Approve this action?',
  );
  const [confirmLabel, setConfirmLabel] = React.useState('Allow');
  const [cancelLabel, setCancelLabel] = React.useState('Deny');
  const [resolution, setResolution] = React.useState<'confirm' | 'cancel' | null>(null);

  return (
    <PlaygroundCard
      title="ChatConfirmation"
      description="Inline tool-call gating using palette.warning tokens."
      previewMinHeight={200}
      controls={
        <React.Fragment>
          <TextControl label="message" value={message} onChange={setMessage} multiline rows={2} />
          <TextControl label="confirmLabel" value={confirmLabel} onChange={setConfirmLabel} />
          <TextControl label="cancelLabel" value={cancelLabel} onChange={setCancelLabel} />
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
              {resolution === 'confirm' ? 'Confirmed' : 'Cancelled'}
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
}
