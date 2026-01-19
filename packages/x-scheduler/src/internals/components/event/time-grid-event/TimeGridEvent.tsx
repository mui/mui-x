'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { EventDragPreview } from '../../event-drag-preview';
import { useFormatTime } from '../../../hooks/useFormatTime';
import { schedulerPaletteStyles } from '../../../utils/tokens';

const TimeGridEventRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEvent',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-color-3)',
  position: 'absolute',
  left: 'calc(2px + ((100% - 12px) / var(--columns-count)) * (var(--first-index) - 1))',
  right:
    'calc(((100% - 12px) * (var(--columns-count) - var(--last-index))) / var(--columns-count) + 4px + 12px)',
  top: 'var(--y-position)',
  bottom: 'calc(100% - var(--y-position) - var(--height))',
  zIndex: 2,
  padding: theme.spacing(0.5, 2, 0.5, 1.5),
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
  '&:focus-visible': {
    outline: '2px solid var(--event-color-5)',
    outlineOffset: 2,
  },
  '&[role="button"]': {
    cursor: 'pointer',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: theme.spacing(1),
    left: 0,
    width: 3,
    height: `min(38px, calc(100% - ${theme.spacing(2)}))`,
    borderRadius: 2,
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
  ...schedulerPaletteStyles,
}));

const TimeGridEventTitle = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTitle',
})(({ theme }) => ({
  margin: 0,
  color: 'var(--event-color-12)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
}));

const TimeGridEventTime = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTime',
})(({ theme }) => ({
  color: 'var(--event-color-11)',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
}));

const TimeGridEventRecurringIcon = styled(RepeatRounded, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventRecurringIcon',
})({
  position: 'absolute',
  bottom: 3,
  right: 3,
  color: 'var(--event-color-11)',
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

const UnderHourEventContent = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventUnderHourContent',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  lineHeight: 1,
  color: 'var(--event-color-11)',
  margin: 0,
  '&[data-under-30]': {
    lineHeight: 0,
  },
  '& > p:first-of-type': {
    marginInlineEnd: theme.spacing(0.5),
    whiteSpace: 'nowrap',
  },
}));

const LinesClamp = styled('span')({
  display: '-webkit-box',
  WebkitLineClamp: 'var(--number-of-lines)',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
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
  const isMoreThan90Minutes = durationMinutes >= 90;
  const titleLineCountRegularVariant = isMoreThan90Minutes ? 2 : 1;

  const content = React.useMemo(() => {
    if (isBetween30and60Minutes || isLessThan30Minutes) {
      return (
        <UnderHourEventContent
          data-under-30={isLessThan30Minutes || undefined}
          style={{ '--number-of-lines': 1 } as React.CSSProperties}
        >
          <TimeGridEventTitle as="span">{occurrence.title}</TimeGridEventTitle>
          <TimeGridEventTime>
            {formatTime(occurrence.displayTimezone.start.value)}
          </TimeGridEventTime>
          {isRecurring && <TimeGridEventRecurringIcon aria-hidden="true" fontSize="small" />}
        </UnderHourEventContent>
      );
    }
    return (
      <React.Fragment>
        <LinesClamp
          style={{ '--number-of-lines': titleLineCountRegularVariant } as React.CSSProperties}
        >
          <TimeGridEventTitle>{occurrence.title}</TimeGridEventTitle>
        </LinesClamp>
        <LinesClamp style={{ '--number-of-lines': 1 } as React.CSSProperties}>
          <TimeGridEventTime>
            {formatTime(occurrence.displayTimezone.start.value)} -{' '}
            {formatTime(occurrence.displayTimezone.end.value)}
          </TimeGridEventTime>
        </LinesClamp>
        {isRecurring && <TimeGridEventRecurringIcon aria-hidden="true" fontSize="small" />}
      </React.Fragment>
    );
  }, [
    isBetween30and60Minutes,
    isLessThan30Minutes,
    titleLineCountRegularVariant,
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
