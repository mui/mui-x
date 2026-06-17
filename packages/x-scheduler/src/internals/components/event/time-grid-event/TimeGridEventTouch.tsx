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
import { useArmedOccurrence } from '../../armed-occurrence';
import { PaletteName } from '../../../utils/tokens';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { useTimeGridEvent } from './useTimeGridEvent';
import {
  getTimeGridEventRootStyles,
  getTouchResizeHandleStyles,
  linesClampStyles,
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
  ...linesClampStyles(1),
  maxHeight: `${TOUCH_TITLE_LINE_HEIGHT_PX}px`,
  ...touchTitleLineClampSteps,
}));

// A placeholder rendered as a real `CalendarGrid.TimeEvent` (rather than the inert
// `TimeEventPlaceholder`) so it can host pointer resize handles for sizing the event.
const TimeGridEventTouchPlaceholderRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTouchPlaceholderRoot',
})(({ theme }) => ({
  ...getTimeGridEventRootStyles(theme),
  padding: theme.spacing(0.5, 0.7),
  backgroundColor: 'var(--event-surface-subtle-hover)',
  outline: '2px solid var(--event-main)',
  outlineOffset: '-2px',
  color: 'var(--event-on-surface-subtle-primary)',
}));

const TimeGridEventTouchResizeHandler = styled(CalendarGrid.TimeEventResizeHandler, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTouchResizeHandler',
})(getTouchResizeHandleStyles());

export const TimeGridEventTouch = React.forwardRef(function TimeGridEventTouch(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, variant, className, ...other } = props;

  const { classes } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
  const { isDraggable, isStartResizable, isEndResizable, rootDataAttributes, rootPositionProps } =
    useTimeGridEvent(occurrence);

  // Creation/resize placeholders show resize handles; move (drag) placeholders don't. All three
  // reuse the `placeholder` variant, so the placeholder type is what distinguishes them.
  const placeholderType = useStore(store, schedulerOccurrencePlaceholderSelectors.type);
  const placeholderHasResizeHandles =
    placeholderType === 'creation' || placeholderType === 'internal-resize';

  // Tapping the event arms it, revealing its resize handles and selection outline.
  const { isArmed } = useArmedOccurrence(occurrence.key);

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
        {placeholderHasResizeHandles && (
          <TimeGridEventTouchResizeHandler
            className={classes.timeGridEventResizeHandler}
            side="start"
            interaction="pointer"
          />
        )}
        {content}
        {placeholderHasResizeHandles && (
          <TimeGridEventTouchResizeHandler
            className={classes.timeGridEventResizeHandler}
            side="end"
            interaction="pointer"
          />
        )}
      </TimeGridEventTouchPlaceholderRoot>
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
