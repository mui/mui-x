'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { EventDragPreview } from '../../../components/event-drag-preview';
import { useFormatTime } from '../../../hooks/useFormatTime';
import { PaletteName } from '../../../utils/tokens';
import { useEventCalendarStyledContext } from '../../../../event-calendar/EventCalendarStyledContext';
import { useTimeGridEvent } from './useTimeGridEvent';
import {
  getTimeGridEventRootStyles,
  linesClampStyles,
  TimeGridEventPlaceholder,
} from './TimeGridEventShared';

const TimeGridEventRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventRoot',
})<{ palette?: PaletteName }>(({ theme }) => ({
  ...getTimeGridEventRootStyles(theme),
  padding: theme.spacing(0.5, 1, 0.5, 1),
  '&[data-under-fifteen-minutes="true"]': {
    padding: theme.spacing(0, 1),
  },
  '&:hover': {
    backgroundColor: 'var(--event-surface-subtle-hover)',
  },
  '&[data-editing]': {
    backgroundColor: 'var(--event-surface-selected)',
    color: 'var(--event-on-surface-selected)',
    '&:hover': {
      backgroundColor: 'var(--event-surface-selected-hover)',
    },
  },
  '&[role="button"]': {
    cursor: 'pointer',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
    borderRadius: '4px 0 0 4px',
    background: 'var(--event-surface-accent)',
    pointerEvents: 'none',
  },
  '&[data-editing]::before': {
    background: 'var(--event-surface-selected)',
  },
}));

const TimeGridEventTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTitle',
})(({ theme }) => ({
  margin: 0,
  color: 'var(--event-on-surface-subtle-primary)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: 'var(--EventCalendar-fontSize-eventTitle, 0.75rem)',
  lineHeight: 1.43,
  paddingRight: theme.spacing(1.5),
  height: 'fit-content',
  '@container (max-height: 20px)': {
    fontSize: '11px',
    lineHeight: '11px',
  },
  '[data-editing] &': {
    color: 'var(--event-on-surface-selected)',
  },
  ...linesClampStyles(1),
}));

const TimeGridEventTime = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTime',
})(({ theme }) => ({
  color: 'var(--event-on-surface-subtle-secondary)',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: 'var(--EventCalendar-fontSize-timeText, 0.75rem)',
  lineHeight: 1.43,
  '[data-editing] &': {
    color: 'var(--event-on-surface-selected)',
  },
  '&[data-lines-clamp]': {
    ...linesClampStyles(1),
    paddingInlineEnd: theme.spacing(1.5),
  },
  '@container (max-width: 50px & max-height: 50px)': {
    display: 'none',
  },
  '@container (max-height: 20px)': {
    fontSize: '11px',
    lineHeight: '11px',
  },
}));

const TimeGridEventRecurringIcon = styled(RepeatRounded, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventRecurringIcon',
})(({ theme }) => ({
  position: 'absolute',
  right: 3,
  bottom: 3,
  padding: theme.spacing(0.25),
  fontSize: 'var(--EventCalendar-fontSize-recurringIcon, 1.25rem)',
  color: 'var(--event-on-surface-subtle-secondary)',
  '[data-editing] &': {
    color: 'var(--event-on-surface-selected)',
  },
  '@container (max-width: 50px)': {
    display: 'none',
  },
  '@container (max-height: 12px)': {
    fontSize: 14,
    lineHeight: 14,
    padding: 0,
    bottom: 0,
  },
}));

const TimeGridEventResizeHandler = styled(CalendarGrid.TimeEventResizeHandler, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventResizeHandler',
})({
  position: 'absolute',
  height: 4,
  left: 0,
  right: 0,
  zIndex: 3,
  cursor: 'ns-resize',
  opacity: 0,
  '*:hover > &': {
    opacity: 1,
  },
  '&[data-start]': {
    top: 0,
  },
  '&[data-end]': {
    bottom: 0,
  },
});

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, variant, className, ...other } = props;

  const { classes } = useEventCalendarStyledContext();
  const {
    isRecurring,
    isDraggable,
    isStartResizable,
    isEndResizable,
    isLessThan30Minutes,
    isBetween30and60Minutes,
    rootDataAttributes,
    rootPositionProps,
  } = useTimeGridEvent(occurrence);

  const formatTime = useFormatTime();

  const content = React.useMemo(() => {
    return (
      <React.Fragment>
        {isLessThan30Minutes || isBetween30and60Minutes ? (
          <TimeGridEventTitle className={classes.timeGridEventTitle}>
            {occurrence.title}{' '}
            <TimeGridEventTime className={classes.timeGridEventTime}>
              {formatTime(occurrence.displayTimezone.start.value)}
            </TimeGridEventTime>
          </TimeGridEventTitle>
        ) : (
          <React.Fragment>
            <TimeGridEventTitle className={classes.timeGridEventTitle}>
              {occurrence.title}
            </TimeGridEventTitle>
            <TimeGridEventTime className={classes.timeGridEventTime} data-lines-clamp>
              {formatTime(occurrence.displayTimezone.start.value)} -{' '}
              {formatTime(occurrence.displayTimezone.end.value)}
            </TimeGridEventTime>
          </React.Fragment>
        )}

        {isRecurring && (
          <TimeGridEventRecurringIcon
            className={classes.timeGridEventRecurringIcon}
            aria-hidden="true"
          />
        )}
      </React.Fragment>
    );
  }, [
    isBetween30and60Minutes,
    isLessThan30Minutes,
    occurrence.title,
    occurrence.displayTimezone.start.value,
    occurrence.displayTimezone.end.value,
    formatTime,
    isRecurring,
    classes,
  ]);

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
    <TimeGridEventRoot
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...rootDataAttributes}
      {...sharedProps}
      className={clsx(classes.timeGridEvent, sharedProps.className)}
    >
      {isStartResizable && (
        <TimeGridEventResizeHandler className={classes.timeGridEventResizeHandler} side="start" />
      )}
      {content}
      {isEndResizable && (
        <TimeGridEventResizeHandler className={classes.timeGridEventResizeHandler} side="end" />
      )}
    </TimeGridEventRoot>
  );
});
