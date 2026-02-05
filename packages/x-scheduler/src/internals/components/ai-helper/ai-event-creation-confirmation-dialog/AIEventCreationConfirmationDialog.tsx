'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useStore } from '@base-ui/utils/store';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import {
  SchedulerEventCreationProperties,
  SchedulerEventOccurrence,
  SchedulerEventId,
} from '@mui/x-scheduler-headless/models';
import { ProgressButton } from '../progress-button';
import { EventDraggableDialogTrigger } from '../event-draggable-dialog';

export interface AIEventCreationConfirmationDialogProps {
  event: SchedulerEventCreationProperties;
  summaryText: string;
}

export function AIEventCreationConfirmationDialog(props: AIEventCreationConfirmationDialogProps) {
  const { event, summaryText } = props;
  const store = useEventCalendarStoreContext();
  const adapter = useAdapter();
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const [open, setOpen] = React.useState(false);
  const [occurrence, setOccurrence] = React.useState<SchedulerEventOccurrence | null>(null);
  const eventRef = React.useRef(event);

  // Keep the ref updated
  eventRef.current = event;

  const handleOpen = () => {
    // Create event when opening the dialog
    const currentEvent = eventRef.current;
    const eventId: SchedulerEventId = store.createEvent(currentEvent);
    store.set('visibleDate', currentEvent.start);

    // Generate occurrence directly from the event (don't wait for store to update)
    const eventWithId = { ...currentEvent, id: eventId };
    const processedEvent = processEvent(eventWithId, displayTimezone, adapter);
    const occ: SchedulerEventOccurrence = {
      ...processedEvent,
      key: String(eventId),
    };
    setOccurrence(occ);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOccurrence(null);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleOpen} aria-label="AI Event Creation">
        <AutoAwesomeIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Event Created</DialogTitle>
        <DialogContent>
          <DialogContentText>{summaryText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {occurrence && (
            <EventDraggableDialogTrigger occurrence={occurrence} onClick={handleClose}>
              <Button>Edit</Button>
            </EventDraggableDialogTrigger>
          )}
          <ProgressButton timeoutMs={5000} onClick={handleClose} variant="contained">
            Confirm
          </ProgressButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
