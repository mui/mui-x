'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import { useStore } from '@base-ui/utils/store';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingContext, useEventEditingStyledContext } from '../event-editing';

// `Paper` (elevation 3) supplies the `background.paper` fill and `shadows[3]` box shadow.
const EventToolbarRoot = styled(Paper, {
  name: 'MuiEventCalendar',
  slot: 'Toolbar',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  borderRadius: 50,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const EventToolbarButton = styled(IconButton, {
  name: 'MuiEventCalendar',
  slot: 'ToolbarButton',
})(({ theme }) => ({
  width: 40,
  height: 40,
  padding: 0,
  // Circular icon button to match the pill-shaped toolbar container.
  borderRadius: '50%',
  color: (theme.vars || theme).palette.text.primary,
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: -2,
  },
}));

interface EventToolbarProps {
  occurrence: SchedulerRenderableEventOccurrence;
}

export function EventToolbar(props: EventToolbarProps) {
  const { occurrence } = props;

  const store = useSchedulerStoreContext();
  const { stopEditing } = useEventEditingContext();
  const { classes, localeText } = useEventEditingStyledContext();

  const recurringEventsPlugin = useStore(store, schedulerOtherSelectors.recurringEventsPlugin);
  const areRecurringEventsAvailable = useStore(
    store,
    schedulerOtherSelectors.areRecurringEventsAvailable,
  );

  const handleEdit = () => {
    store.setEditingMode('edit');
  };

  // Mirrors `FormContent`'s delete: recurring events open the scope dialog (which closes the surface
  // on submit); single events delete immediately and close.
  const handleDelete = () => {
    if (areRecurringEventsAvailable && recurringEventsPlugin && occurrence.displayTimezone.rrule) {
      store.deleteRecurringEvent({
        occurrenceStart: occurrence.displayTimezone.start.value,
        eventId: occurrence.id,
        onSubmit: stopEditing,
      });
      return;
    }

    store.deleteEvent(occurrence.id);
    stopEditing();
  };

  return (
    <EventToolbarRoot className={classes.eventToolbar} elevation={3} role="toolbar">
      <EventToolbarButton
        className={classes.eventToolbarEditButton}
        aria-label={localeText.editEventButtonAriaLabel}
        onClick={handleEdit}
      >
        <EditRounded fontSize="small" />
      </EventToolbarButton>
      <EventToolbarButton
        className={classes.eventToolbarDeleteButton}
        aria-label={localeText.deleteEventButtonAriaLabel}
        onClick={handleDelete}
      >
        <DeleteRounded fontSize="small" />
      </EventToolbarButton>
    </EventToolbarRoot>
  );
}
