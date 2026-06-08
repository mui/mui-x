'use client';
import * as React from 'react';
import clsx from 'clsx';
import { CSSObject, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { schedulerOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { EventDragPreview } from '../../../components/event-drag-preview';
import { useEventCalendarStyledContext } from '../../../../event-calendar/EventCalendarStyledContext';
import { useCompactEventDrawerContext } from '../../compact-event-drawer';
import { PaletteName } from '../../../utils/tokens';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { useTimeGridEvent } from './useTimeGridEvent';
import {
  getTimeGridEventRootStyles,
  linesClampStyles,
  TimeGridEventPlaceholder,
} from './TimeGridEventShared';

const TimeGridEventTouchRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTouchRoot',
})<{ palette?: PaletteName }>(({ theme }) => ({
  ...getTimeGridEventRootStyles(theme),
  padding: theme.spacing(0.5, 0.7, 0.5, 0.7),
  '&[data-under-fifteen-minutes="true"]': {
    padding: theme.spacing(0, 0.5),
  },
  '&[data-armed]': {
    outline: '2px solid var(--event-main)',
    outlineOffset: '-2px',
  },
}));

const TOUCH_TITLE_LINE_HEIGHT_PX = 12;
const TOUCH_EVENT_VERTICAL_PADDING_PX = 4;
const TOUCH_TITLE_MAX_LINES = 24;

const touchTitleLineClampSteps: CSSObject = {};
for (let lines = 2; lines <= TOUCH_TITLE_MAX_LINES; lines += 1) {
  const minHeight = TOUCH_EVENT_VERTICAL_PADDING_PX + lines * TOUCH_TITLE_LINE_HEIGHT_PX;
  touchTitleLineClampSteps[`@container (min-height: ${minHeight}px)`] = {
    WebkitLineClamp: lines,
    maxHeight: `${lines * TOUCH_TITLE_LINE_HEIGHT_PX}px`,
  };
}

const TimeGridEventTouchTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTouchTitle',
})(({ theme }) => ({
  margin: 0,
  color: 'var(--event-on-surface-subtle-primary)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: 'var(--EventCalendar-fontSize-eventTitle)',
  lineHeight: `${TOUCH_TITLE_LINE_HEIGHT_PX}px`,
  '[data-editing] &': {
    color: 'var(--event-on-surface-selected)',
  },
  ...linesClampStyles(1),
  maxHeight: `${TOUCH_TITLE_LINE_HEIGHT_PX}px`,
  ...touchTitleLineClampSteps,
}));

// A creation placeholder rendered as a real `CalendarGrid.TimeEvent` (rather than the inert
// `TimeEventPlaceholder`) so it can host pointer resize handles — letting the user size the
// new event before it is saved.
const TimeGridEventTouchPlaceholderRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTouchPlaceholderRoot',
})(({ theme }) => ({
  ...getTimeGridEventRootStyles(theme),
  padding: theme.spacing(0.5, 0.7),
  backgroundColor: 'var(--event-surface-subtle-hover)',
  border: '1px dashed var(--event-on-surface-subtle-secondary)',
  color: 'var(--event-on-surface-subtle-primary)',
}));

const TimeGridEventTouchResizeHandler = styled(CalendarGrid.TimeEventResizeHandler, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTouchResizeHandler',
})({
  position: 'absolute',
  width: 14,
  height: 14,
  borderRadius: '50%',
  backgroundColor: 'var(--event-main)',
  border: '2px solid var(--event-on-surface-subtle-primary)',
  zIndex: 3,
  cursor: 'ns-resize',
  // Prevent the browser from scrolling/zooming while the resize gesture is in progress.
  touchAction: 'none',
  '&[data-start]': {
    top: -7,
    left: 6,
  },
  '&[data-end]': {
    bottom: -7,
    right: 6,
  },
});

export const TimeGridEventTouch = React.forwardRef(function TimeGridEventTouch(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, variant, className, ...other } = props;

  const { classes } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
  const { isDraggable, isStartResizable, isEndResizable, rootDataAttributes, rootPositionProps } =
    useTimeGridEvent(occurrence);

  // A creation placeholder has no underlying event but should still be resizable, so it is
  // rendered as a real event with forced handles (see below). Selecting the boolean (rather
  // than the placeholder object) keeps every event from re-rendering on each resize move.
  const isCreationPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.isCreating);

  // A single tap on the event opens the compact drawer for it (via the EventDialogTrigger ->
  // drawer bridge). We reuse that drawer selection to "arm" the event — revealing its resize
  // handles and selection outline — without any custom long-press.
  const { isOpen, data } = useCompactEventDrawerContext();
  const isArmed = isOpen && data?.key === occurrence.key;

  const content = (
    <TimeGridEventTouchTitle className={classes.timeGridEventTitle}>
      {occurrence.title}
    </TimeGridEventTouchTitle>
  );

  const sharedProps = {
    ...rootPositionProps,
    ref: forwardedRef,
    ...other,
    className: clsx(className, occurrence.className),
  };

  if (variant === 'placeholder') {
    // A creation placeholder is resizable: render it as a real event with forced pointer
    // handles so the user can size the new event before saving it. Other placeholders (the
    // transient drag/resize previews) stay inert.
    if (isCreationPlaceholder) {
      return (
        <TimeGridEventTouchPlaceholderRoot
          isDraggable={false}
          eventId={occurrence.id}
          occurrenceKey={occurrence.key}
          renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
          {...rootDataAttributes}
          {...sharedProps}
          className={clsx(classes.timeGridEventPlaceholder, sharedProps.className)}
        >
          <TimeGridEventTouchResizeHandler
            className={classes.timeGridEventResizeHandler}
            side="start"
            interaction="pointer"
          />
          {content}
          <TimeGridEventTouchResizeHandler
            className={classes.timeGridEventResizeHandler}
            side="end"
            interaction="pointer"
          />
        </TimeGridEventTouchPlaceholderRoot>
      );
    }

    return (
      <TimeGridEventPlaceholder
        aria-hidden={true}
        {...rootDataAttributes}
        {...sharedProps}
        className={clsx(classes.timeGridEventPlaceholder, sharedProps.className)}
      >
        {content}
      </TimeGridEventPlaceholder>
    );
  }

  return (
    <TimeGridEventTouchRoot
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...rootDataAttributes}
      {...sharedProps}
      data-armed={isArmed || undefined}
      className={clsx(classes.timeGridEvent, sharedProps.className)}
    >
      {isArmed && isStartResizable && (
        <TimeGridEventTouchResizeHandler
          className={classes.timeGridEventResizeHandler}
          side="start"
          interaction="pointer"
        />
      )}
      {content}
      {isArmed && isEndResizable && (
        <TimeGridEventTouchResizeHandler
          className={classes.timeGridEventResizeHandler}
          side="end"
          interaction="pointer"
        />
      )}
    </TimeGridEventTouchRoot>
  );
});
