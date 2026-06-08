'use client';
import * as React from 'react';
import clsx from 'clsx';
import { CSSObject, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventDragPreview } from '../../../components/event-drag-preview';
import { useEventCalendarStyledContext } from '../../../../event-calendar/EventCalendarStyledContext';
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

const TimeGridEventTouchResizeHandler = styled(CalendarGrid.TimeEventResizeHandler, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTouchResizeHandler',
})({
  position: 'absolute',
  height: 4,
  left: 0,
  right: 0,
  zIndex: 3,
  cursor: 'ns-resize',
  '&[data-start]': {
    top: 0,
  },
  '&[data-end]': {
    bottom: 0,
  },
});

export const TimeGridEventTouch = React.forwardRef(function TimeGridEventTouch(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, variant, className, ...other } = props;

  const { classes } = useEventCalendarStyledContext();
  const { isDraggable, isStartResizable, isEndResizable, rootDataAttributes, rootPositionProps } =
    useTimeGridEvent(occurrence);

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
      className={clsx(classes.timeGridEvent, sharedProps.className)}
    >
      {isStartResizable && (
        <TimeGridEventTouchResizeHandler
          className={classes.timeGridEventResizeHandler}
          side="start"
        />
      )}
      {content}
      {isEndResizable && (
        <TimeGridEventTouchResizeHandler
          className={classes.timeGridEventResizeHandler}
          side="end"
        />
      )}
    </TimeGridEventTouchRoot>
  );
});
