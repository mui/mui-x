'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingContext, useEventEditingStyledContext } from '../event-editing';
import { useDisarmOnEscape } from '../armed-occurrence';
import { deleteOccurrenceAndRestoreFocus } from '../../utils/focus-utils';

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
  const deletionConfig = useStore(store, schedulerEventSelectors.deletionConfig);
  const { stopEditing, anchor, stableAnchorRef } = useEventEditingContext();
  const { classes, localeText } = useEventEditingStyledContext();

  // Rendered only while armed (desktop anchored surface + mobile dock), so Escape here disarms both.
  useDisarmOnEscape({ onDisarm: stopEditing });

  const handleEdit = (event: React.MouseEvent) => {
    // The dialog gives focus back to the element focused when it opened, and this toolbar unmounts
    // once editing starts, so focus moves to the event first.
    const button = event.currentTarget as HTMLElement;
    if (anchor?.isConnected && button.contains(button.ownerDocument.activeElement)) {
      anchor.focus({ preventScroll: true });
    }
    // A canceled edit disarms and unmounts this toolbar, so the activation's retained stable
    // anchor (or the occurrence element the toolbar is anchored to) is the callback anchor.
    store.setEditingMode(
      'edit',
      event.nativeEvent,
      button,
      stableAnchorRef.current ?? anchor ?? undefined,
    );
  };

  const handleDelete = () => {
    deleteOccurrenceAndRestoreFocus(store, occurrence, anchor, stopEditing);
  };

  // A single tab stop, the arrow keys move between the buttons (APG toolbar pattern).
  const isRtl = useRtl();
  const buttonCount = deletionConfig !== false ? 2 : 1;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const tabStopIndex = Math.min(activeIndex, buttonCount - 1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button'));
    const index = buttons.indexOf(event.target as HTMLElement);
    if (index === -1) {
      return;
    }
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const previousKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
    let nextIndex: number;
    if (event.key === nextKey) {
      nextIndex = (index + 1) % buttons.length;
    } else if (event.key === previousKey) {
      nextIndex = (index - 1 + buttons.length) % buttons.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = buttons.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    buttons[nextIndex].focus();
  };

  // The toolbar is outside the cell (portaled or docked), so Tab moves between it and the event.
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const toolbar = rootRef.current;
    if (anchor == null || toolbar == null) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === 'Escape' && toolbar.contains(target)) {
        // Disarming unmounts the toolbar, so focus goes back to the event first.
        anchor.focus();
        return;
      }
      if (event.key !== 'Tab') {
        return;
      }
      const tabStop = toolbar.querySelector<HTMLElement>('[tabindex="0"]');
      if (target === anchor && !event.shiftKey && tabStop != null) {
        event.preventDefault();
        tabStop.focus();
      } else if (toolbar.contains(target)) {
        event.preventDefault();
        anchor.focus();
      }
    };
    // Capture phase, before the calendar grid moves focus between the items of the cell.
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [anchor]);

  const getButtonProps = (index: number) => ({
    tabIndex: index === tabStopIndex ? 0 : -1,
    onFocus: () => setActiveIndex(index),
  });

  return (
    <EventToolbarRoot
      ref={rootRef}
      className={classes.eventToolbar}
      elevation={3}
      role="toolbar"
      aria-label={localeText.eventActionsToolbarAriaLabel}
      onKeyDown={handleKeyDown}
    >
      <EventToolbarButton
        className={classes.eventToolbarEditButton}
        aria-label={localeText.editEventButtonAriaLabel}
        onClick={handleEdit}
        {...getButtonProps(0)}
      >
        <EditRounded fontSize="small" />
      </EventToolbarButton>
      {deletionConfig !== false && (
        <EventToolbarButton
          className={classes.eventToolbarDeleteButton}
          aria-label={localeText.deleteEventButtonAriaLabel}
          onClick={handleDelete}
          {...getButtonProps(1)}
        >
          <DeleteRounded fontSize="small" />
        </EventToolbarButton>
      )}
    </EventToolbarRoot>
  );
}
