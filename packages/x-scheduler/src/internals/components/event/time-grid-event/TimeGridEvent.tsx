'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { EventDragPreview } from '../../event-drag-preview';
import { useFormatTime } from '../../../hooks/useFormatTime';
import { schedulerPaletteStyles } from '../../../utils/tokens';

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
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-color-3)',
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
  '&[data-dragging], &[data-resizing]': {
    opacity: 0.5,
  },
  '&[data-draggable]': {
    cursor: 'grab',
  },
  '&[data-recurrent]': {
    background:
      'repeating-linear-gradient(-45deg, rgb(var(--event-color-4-rgb), 0.5) 0 12px, var(--event-color-3) 12px 22.5px)',
    backgroundColor: 'var(--event-color-3)',
  },
  '&[data-under-hour="true"]': {
    flexDirection: 'row',
  },
  '&:focus-visible': {
    outline: '2px solid var(--event-color-5)',
    outlineOffset: 2,
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
    background: 'var(--event-color-12)',
    pointerEvents: 'none',
  },
  ...schedulerPaletteStyles,
}));

const TimeGridEventPlaceholder = styled(CalendarGrid.TimeEventPlaceholder, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventPlaceholder',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-color-5)',
  color: 'var(--event-color-12)',
  position: 'absolute',
  left: 'calc(2px + ((100% - 12px) / var(--columns-count)) * (var(--first-index) - 1))',
  right:
    'calc(((100% - 12px) * (var(--columns-count) - var(--last-index))) / var(--columns-count) + 4px + 12px)',
  top: 'var(--y-position)',
  bottom: 'calc(100% - var(--y-position) - var(--height))',
  zIndex: 2,
  padding: theme.spacing(0.5, 2, 0.5, 1.5),
  containerType: 'size',
  ...schedulerPaletteStyles,
}));

const TimeGridEventTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTitle',
})(({ theme }) => ({
  margin: 0,
  color: 'var(--event-color-12)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
  height: 'fit-content',
  ...linesClampStyles(1),
}));

const TimeGridEventTime = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTime',
})(({ theme }) => ({
  color: 'var(--event-color-11)',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
  '&[data-lines-clamp]': {
    ...linesClampStyles(1),
  },
  '@container (max-width: 50px & max-height: 50px)': {
    display: 'none',
  },
}));

const TimeGridEventRecurringIcon = styled(RepeatRounded, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventRecurringIcon',
})({
  position: 'absolute',
  right: 3,
  bottom: 3,
  color: 'var(--event-color-11)',
  '@container (max-width: 50px)': {
    display: 'none',
  },
});

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
  const { occurrence, variant, ...other } = props;

  // Context hooks
  const store = useEventCalendarStoreContext();

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

  const content = React.useMemo(() => {
    return (
      <React.Fragment>
        {isLessThan30Minutes || isBetween30and60Minutes ? (
          <TimeGridEventTitle>
            {occurrence.title}{' '}
            <TimeGridEventTime>
              {formatTime(occurrence.displayTimezone.start.value)}
            </TimeGridEventTime>
          </TimeGridEventTitle>
        ) : (
          <React.Fragment>
            <TimeGridEventTitle>{occurrence.title}</TimeGridEventTitle>
            <TimeGridEventTime data-lines-clamp>
              {formatTime(occurrence.displayTimezone.start.value)} -{' '}
              {formatTime(occurrence.displayTimezone.end.value)}
            </TimeGridEventTime>
          </React.Fragment>
        )}

        {isRecurring && <TimeGridEventRecurringIcon aria-hidden="true" fontSize="small" />}
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
  ]);

  const sharedProps = {
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    ref: forwardedRef,
    className: occurrence.className,
    style: {
      '--first-index': occurrence.position.firstIndex,
      '--last-index': occurrence.position.lastIndex,
    } as React.CSSProperties,
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <TimeGridEventPlaceholder
        aria-hidden={true}
        data-under-hour={isLessThan30Minutes || isBetween30and60Minutes || undefined}
        data-draggable={isDraggable || undefined}
        data-recurrent={isRecurring || undefined}
        data-palette={color}
        {...sharedProps}
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
      data-recurrent={isRecurring || undefined}
      data-palette={color}
      {...sharedProps}
    >
      {isStartResizable && <TimeGridEventResizeHandler side="start" />}
      {content}
      {isEndResizable && <TimeGridEventResizeHandler side="end" />}
    </TimeGridEventRoot>
  );
});
