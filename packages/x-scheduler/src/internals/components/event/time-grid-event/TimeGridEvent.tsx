'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { EventDragPreview } from '../../../components/event-drag-preview';
import { useFormatTime } from '../../../hooks/useFormatTime';
import { getPaletteVariants, PaletteName } from '../../../utils/tokens';
import { useEventCalendarClasses } from '../../../../event-calendar/EventCalendarClassesContext';

const linesClampStyles = (maximumLines: number = 1): React.CSSProperties => ({
  display: '-webkit-box',
  WebkitLineClamp: maximumLines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
});

const TimeGridEventRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEvent',
})<{ palette?: PaletteName }>(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-surface-subtle)',
  position: 'absolute',
  left: 'calc( ((100% - 12px) / var(--columns-count)) * (var(--first-index) - 1))',
  right:
    'calc(((100% - 12px) * (var(--columns-count) - var(--last-index))) / var(--columns-count) + 12px)',
  top: 'calc(var(--y-position) + 1px)',
  bottom: 'calc(100% - var(--y-position) - var(--height))',
  zIndex: 2,
  padding: theme.spacing(0.5, 1, 0.5, 1),
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  gap: theme.spacing(0.25),
  justifyContent: 'flex-start',
  alignContent: 'flex-start',
  minHeight: 11.5,
  '&[data-dragging], &[data-resizing]': {
    opacity: 0.5,
  },
  '&[data-draggable]': {
    cursor: 'grab',
  },
  '&[data-under-hour="true"]': {
    flexDirection: 'row',
  },
  '&[data-under-fifteen-minutes="true"]': {
    padding: theme.spacing(0.05, 1),
  },
  '&:focus-visible': {
    outline: '2px solid var(--event-surface-accent)',
    outlineOffset: 2,
  },
  '&:hover': {
    backgroundColor: 'var(--event-surface-subtle-hover)',
  },
  '&[role="button"]': {
    cursor: 'pointer',
  },
  containerType: 'size',
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
  variants: getPaletteVariants(theme),
}));

const TimeGridEventPlaceholder = styled(CalendarGrid.TimeEventPlaceholder, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventPlaceholder',
})<{ palette?: PaletteName }>(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-surface-subtle-hover)',
  border: `1px dashed var(--event-on-surface-subtle-secondary)`,
  color: 'var(--event-on-surface-subtle-primary)',
  position: 'absolute',
  left: 'calc(((100% - 12px) / var(--columns-count)) * (var(--first-index) - 1))',
  right:
    'calc(((100% - 12px) * (var(--columns-count) - var(--last-index))) / var(--columns-count) + 12px)',
  top: 'var(--y-position)',
  bottom: 'calc(100% - var(--y-position) - var(--height))',
  zIndex: 2,
  padding: theme.spacing(0.5, 2, 0.5, 1.5),
  containerType: 'size',
  minHeight: 11.5,
  '&[data-under-fifteen-minutes="true"]': {
    padding: theme.spacing(0.05, 1),
  },
  variants: getPaletteVariants(theme),
}));

const TimeGridEventTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTitle',
})(({ theme }) => ({
  margin: 0,
  color: 'var(--event-on-surface-subtle-primary)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
  paddingRight: theme.spacing(1.5),
  height: 'fit-content',
  '@container (max-height: 20px)': {
    fontSize: '11px',
    lineHeight: '11px',
  },
  ...linesClampStyles(1),
}));

const TimeGridEventTime = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTime',
})(({ theme }) => ({
  color: 'var(--event-on-surface-subtle-secondary)',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
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
  color: 'var(--event-on-surface-subtle-secondary)',
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

  // Context hooks
  const store = useEventCalendarStoreContext();
  const classes = useEventCalendarClasses();

  // Selector hooks
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);
  const isDraggable = useStore(store, schedulerEventSelectors.isDraggable, occurrence.id);
  const isStartResizable = useStore(
    store,
    schedulerEventSelectors.isResizable,
    occurrence.id,
    'start',
  );
  const isEndResizable = useStore(store, schedulerEventSelectors.isResizable, occurrence.id, 'end');
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);

  // Feature hooks
  const formatTime = useFormatTime();

  const durationMs =
    occurrence.displayTimezone.end.timestamp - occurrence.displayTimezone.start.timestamp;
  const durationMinutes = durationMs / 60000;
  const isBetween30and60Minutes = durationMinutes >= 30 && durationMinutes < 60;
  const isLessThan30Minutes = durationMinutes < 30;
  const isLessThan15Minutes = durationMinutes < 15;

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
            fontSize="small"
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
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    ref: forwardedRef,
    style: {
      '--first-index': occurrence.position.firstIndex,
      '--last-index': occurrence.position.lastIndex,
    } as React.CSSProperties,
    ...other,
    className: clsx(className, occurrence.className),
  };

  if (variant === 'placeholder') {
    return (
      <TimeGridEventPlaceholder
        aria-hidden={true}
        data-under-hour={isLessThan30Minutes || isBetween30and60Minutes || undefined}
        data-draggable={isDraggable || undefined}
        data-recurrent={isRecurring || undefined}
        data-under-fifteen-minutes={isLessThan15Minutes || undefined}
        data-palette={color}
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
      data-under-hour={isLessThan30Minutes || isBetween30and60Minutes || undefined}
      data-draggable={isDraggable || undefined}
      data-under-fifteen-minutes={isLessThan15Minutes || undefined}
      data-recurrent={isRecurring || undefined}
      data-palette={color}
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
