'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useTranslations } from '../../utils/TranslationsContext';
import { useAiHelper } from './useAiHelper';
import type {
  AiHelperCommandPaletteProps,
  AiHelperCommandPaletteHandle,
} from './AiHelperCommandPalette.types';

/**
 * Format a datetime string for display.
 */
function formatDateTime(dateTimeString: string | undefined): string {
  if (!dateTimeString) return '';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateTimeString;
  }
}

/**
 * Command palette modal for creating events with AI assistance.
 */
export const AiHelperCommandPalette = React.forwardRef<
  AiHelperCommandPaletteHandle,
  AiHelperCommandPaletteProps
>(function AiHelperCommandPalette(props, ref) {
  const { apiKey, provider, model, defaultDuration, extraContext } = props;

  const { state, open, close, submit, confirm, edit, retry } = useAiHelper({
    apiKey,
    provider,
    model,
    defaultDuration,
    extraContext,
  });

  const [inputValue, setInputValue] = React.useState('');
  const translations = useTranslations();

  // Expose open method via ref
  React.useImperativeHandle(ref, () => ({ open }), [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && state.status === 'prompting') {
      submit(inputValue.trim());
    }
  };

  // Reset input when reopening
  React.useEffect(() => {
    if (state.status === 'prompting') {
      setInputValue(state.prompt);
    }
  }, [state.status, state.prompt]);

  if (state.status === 'closed') {
    return null;
  }

  return (
    <Dialog open onClose={close} maxWidth="sm" fullWidth>
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        {/* Prompting State */}
        {state.status === 'prompting' && (
          <>
            <Typography variant="h6" gutterBottom>
              {translations.aiHelperTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {translations.aiHelperDescription}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                autoFocus
                fullWidth
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={translations.aiHelperPlaceholder}
              />
            </form>
          </>
        )}

        {/* Processing State */}
        {state.status === 'processing' && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {translations.aiHelperProcessing}
            </Typography>
          </>
        )}

        {/* Error State */}
        {state.status === 'error' && (
          <>
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
              {state.parsedResponse?.error || translations.aiHelperGenericError}
            </Alert>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button onClick={close} variant="outlined">
                {translations.cancel}
              </Button>
              <Button onClick={retry} variant="contained">
                {translations.aiHelperRetry}
              </Button>
            </Stack>
          </>
        )}

        {/* Confirming State */}
        {state.status === 'confirming' && state.parsedResponse?.event && (
          <>
            <Typography variant="body1" gutterBottom>
              {state.parsedResponse.summary}
            </Typography>

            <Box
              sx={{
                my: 3,
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 1,
                textAlign: 'left',
              }}
            >
              <Typography>
                <strong>Title:</strong> {state.parsedResponse.event.title}
              </Typography>
              <Typography>
                <strong>Start:</strong> {formatDateTime(state.parsedResponse.event.start)}
              </Typography>
              <Typography>
                <strong>End:</strong> {formatDateTime(state.parsedResponse.event.end)}
              </Typography>
              {state.parsedResponse.event.description && (
                <Typography>
                  <strong>Description:</strong> {state.parsedResponse.event.description}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button onClick={edit} variant="outlined">
                {translations.aiHelperEditButton}
              </Button>
              <Button onClick={confirm} variant="contained">
                {translations.aiHelperConfirmButton}
              </Button>
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
