'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingContext, useEventEditingStyledContext } from '../event-editing';
import { useDisarmOnEscape } from '../armed-occurrence';
import { getFocusFallback } from '../../utils/focus-utils';

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
  const { stopEditing, anchor, stableAnchorRef } = useEventEditingContext();
  const { classes, localeText } = useEventEditingStyledContext();

  // Rendered only while armed (desktop anchored surface + mobile dock), so Escape here disarms both.
  useDisarmOnEscape({ active: true, onDisarm: stopEditing });

  const handleEdit = (event: React.MouseEvent) => {
    // A canceled edit disarms and unmounts this toolbar, so the activation's retained stable
    // anchor (or the occurrence element the toolbar is anchored to) is the callback anchor.
    store.setEditingMode(
      'edit',
      event.nativeEvent,
      event.currentTarget as HTMLElement,
      stableAnchorRef.current ?? anchor ?? undefined,
    );
  };

  // Recurring events open the scope dialog; non-recurring events go through the delete
  // confirmation dialog (unless `eventDeletion={{ confirmation: false }}`). Either way the
  // toolbar only closes once the deletion is actually applied.
  const handleDelete = () => {
    // Captured before the delete unmounts `anchor` — see `getFocusFallback`.
    const focusFallback = anchor ? getFocusFallback(anchor) : null;
    store.deleteOccurrence(occurrence, () => {
      stopEditing();
      // `onDelete` may fire synchronously (an immediate delete) or later, from the scope dialog's
      // or the confirmation dialog's own click handler — while its focus trap is still mounted. An
      // immediate `.focus()` call there gets pulled straight back into the trap. Deferring past the
      // current task lets the dialog actually close first, so the fallback focus sticks.
      setTimeout(() => focusFallback?.focus());
    });
  };

  return (
    <EventToolbarRoot
      className={classes.eventToolbar}
      elevation={3}
      role="toolbar"
      aria-label={localeText.eventActionsToolbarAriaLabel}
    >
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
