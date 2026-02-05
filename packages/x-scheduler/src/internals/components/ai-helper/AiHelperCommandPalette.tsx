'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useStore } from '@base-ui/utils/store';
import type { RecurringEventRecurrenceRule } from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTranslations } from '../../utils/TranslationsContext';
import { useAiHelper } from './useAiHelper';
import { ProgressButton } from './progress-button';
import { EventDraggableDialogTrigger } from '../event-draggable-dialog';
import type { AiHelperCommandPaletteProps } from './AiHelperCommandPalette.types';

const PROCESSING_MESSAGES = [
  { emoji: '🔮', text: 'Reading your mind...' },
  { emoji: '🧙', text: 'Casting calendar spells...' },
  { emoji: '🎯', text: 'Finding the perfect time...' },
  { emoji: '✨', text: 'Sprinkling some magic...' },
  { emoji: '🤔', text: 'Thinking really hard...' },
  { emoji: '📅', text: 'Consulting the calendar gods...' },
  { emoji: '🚀', text: 'Almost there...' },
];

function useProcessingMessage(isProcessing: boolean) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isProcessing) {
      setIndex(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return PROCESSING_MESSAGES[index];
}

/**
 * Format a datetime string for display.
 */
function formatDateTime(dateTimeString: string | undefined): string {
  if (!dateTimeString) {
    return '';
  }
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
 * Format a recurrence rule for display.
 */
function formatRecurrence(rrule: RecurringEventRecurrenceRule): string {
  const { freq, interval = 1, byDay } = rrule;

  const freqMap: Record<string, string> = {
    DAILY: 'day',
    WEEKLY: 'week',
    MONTHLY: 'month',
    YEARLY: 'year',
  };

  let text = interval === 1 ? `Every ${freqMap[freq]}` : `Every ${interval} ${freqMap[freq]}s`;

  if (byDay && byDay.length > 0) {
    const dayMap: Record<string, string> = {
      MO: 'Mon',
      TU: 'Tue',
      WE: 'Wed',
      TH: 'Thu',
      FR: 'Fri',
      SA: 'Sat',
      SU: 'Sun',
    };
    const days = byDay.map((d) => dayMap[d] || d).join(', ');
    text += ` on ${days}`;
  }

  if (rrule.count) {
    text += `, ${rrule.count} times`;
  } else if (rrule.until) {
    const untilStr = typeof rrule.until === 'string' ? rrule.until : String(rrule.until);
    text += `, until ${formatDateTime(untilStr)}`;
  }

  return text;
}

/**
 * Command palette modal for creating events with AI assistance.
 */
export function AiHelperCommandPalette(props: AiHelperCommandPaletteProps) {
  const { apiKey, provider, model, defaultDuration, extraContext } = props;

  const { state, close, submit, confirm, retry } = useAiHelper({
    apiKey,
    provider,
    model,
    defaultDuration,
    extraContext,
  });

  const [inputValue, setInputValue] = React.useState('');
  const translations = useTranslations();
  const store = useSchedulerStoreContext();
  const processingMessage = useProcessingMessage(state.status === 'processing');

  // Get resource info for display
  const resourceId = state.parsedResponse?.event?.resource;
  const resource = useStore(
    store,
    React.useCallback(
      (s: any) => schedulerResourceSelectors.processedResource(s, resourceId),
      [resourceId],
    ),
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
    <Dialog open onClose={close} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        {/* Prompting State */}
        {state.status === 'prompting' && (
          <React.Fragment>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {translations.aiHelperTitle}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                autoFocus
                fullWidth
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={translations.aiHelperPlaceholder}
              />
            </form>
          </React.Fragment>
        )}

        {/* Processing State */}
        {state.status === 'processing' && (
          <React.Fragment>
            <Typography variant="h2" sx={{ mb: 2 }}>
              {processingMessage.emoji}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {processingMessage.text}
            </Typography>
          </React.Fragment>
        )}

        {/* Error State */}
        {state.status === 'error' && (
          <React.Fragment>
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
              {state.parsedResponse?.error || translations.aiHelperGenericError}
            </Alert>
            <Stack spacing={1.5}>
              <Button onClick={retry} variant="contained" fullWidth>
                {translations.aiHelperRetry}
              </Button>
              <Button onClick={close} variant="outlined" fullWidth>
                {translations.cancel}
              </Button>
            </Stack>
          </React.Fragment>
        )}

        {/* Confirming State */}
        {state.status === 'confirming' && state.parsedResponse?.event && (
          <React.Fragment>
            <Box
              sx={{
                mb: 3,
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
              {state.parsedResponse.event.rrule && (
                <Typography>
                  <strong>Repeats:</strong>{' '}
                  {typeof state.parsedResponse.event.rrule === 'string'
                    ? state.parsedResponse.event.rrule
                    : formatRecurrence(state.parsedResponse.event.rrule)}
                </Typography>
              )}
              {resource && (
                <Typography>
                  <strong>Resource:</strong> {resource.title}
                </Typography>
              )}
            </Box>

            <Stack spacing={1.5}>
              {state.occurrence && (
                <EventDraggableDialogTrigger occurrence={state.occurrence} onClick={close}>
                  <Button variant="outlined" fullWidth>
                    {translations.aiHelperEditButton}
                  </Button>
                </EventDraggableDialogTrigger>
              )}
              <ProgressButton timeoutMs={5000} onClick={confirm} variant="contained" fullWidth>
                {translations.aiHelperConfirmButton}
              </ProgressButton>
            </Stack>
          </React.Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
}
