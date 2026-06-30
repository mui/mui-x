'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Toolbar } from '@base-ui/react/toolbar';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import { useStore } from '@base-ui/utils/store';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingContext, useEventEditingStyledContext } from '../event-editing';

const EventToolbarRoot = styled(Toolbar.Root, {
  name: 'MuiEventDialog',
  slot: 'Toolbar',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  borderRadius: 50,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxShadow: (theme.vars || theme).shadows[3],
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const EventToolbarButton = styled(Toolbar.Button, {
  name: 'MuiEventDialog',
  slot: 'ToolbarButton',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  margin: 0,
  border: 0,
  borderRadius: theme.shape.borderRadius,
  background: 'none',
  color: (theme.vars || theme).palette.text.primary,
  cursor: 'pointer',
  font: 'inherit',
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

/**
 * Action toolbar shown next to an armed event (touch only). Replaces the read-only intermediary:
 * Edit opens the editing surface, Delete removes the event (opening the recurring scope dialog when
 * the event is recurring). Mounted anchored beside the event in the desktop layout and at the bottom
 * of the view in the compact layout. Read-only events never arm, so both actions always apply.
 */
export function EventToolbar(props: EventToolbarProps) {
  const { occurrence } = props;

  const store = useSchedulerStoreContext();
  // `onClose` clears both the editing surface (modal) and the store state; Delete must use it so the
  // surface doesn't reopen on the just-deleted occurrence after `stopEditing` runs.
  const { onClose } = useEventEditingContext();
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
        onSubmit: onClose,
      });
      return;
    }

    store.deleteEvent(occurrence.id);
    onClose();
  };

  return (
    <EventToolbarRoot className={classes.eventToolbar}>
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
