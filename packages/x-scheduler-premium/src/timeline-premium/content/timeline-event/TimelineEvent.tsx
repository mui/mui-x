import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useId } from '@base-ui/utils/useId';
import { TimelinePremium } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-timeline-premium-store-context';
import { getDataPaletteProps, EventDragPreview } from '@mui/x-scheduler/internals';
import { TimelineEventProps } from './TimelineEvent.types';

const TimelineEventRoot = styled('div', {
  name: 'MuiEventTimelinePremium',
  slot: 'Event',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-color-3)',
  color: 'var(--event-color-12)',
  padding: theme.spacing(0.5, 1),
  position: 'relative',
  width: 'var(--width)',
  marginLeft: 'var(--x-position)',
  gridRow: 'var(--row-index, 1)',
  gridColumn: 1,
  '&[data-dragging], &[data-resizing]': {
    opacity: 0.5,
  },
  '&:hover .TimelineEventResizeHandler': {
    opacity: 1,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: theme.spacing(0.5),
    bottom: theme.spacing(0.5),
    left: 0,
    width: 3,
    borderRadius: 2,
    background: 'var(--event-color-9)',
    pointerEvents: 'none',
  },
}));

const TimelineEventResizeHandler = styled(TimelinePremium.EventResizeHandler, {
  name: 'MuiEventTimelinePremium',
  slot: 'EventResizeHandler',
})({
  position: 'absolute',
  width: 4,
  top: 0,
  bottom: 0,
  zIndex: 3,
  cursor: 'ew-resize',
  opacity: 0,
  '&[data-start]': {
    left: 0,
  },
  '&[data-end]': {
    right: 0,
  },
});

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  props: TimelineEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, ariaLabelledBy, className, variant, id: idProp, style, ...other } = props;

  // Context hooks
  const store = useTimelinePremiumStoreContext();

  // Selector hooks
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
  const id = useId(idProp);

  const sharedProps = {
    id,
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    ref: forwardedRef,
    'aria-labelledby': `${ariaLabelledBy} ${id}`,
    className: clsx(className),
    style: {
      '--number-of-lines': 1,
      '--row-index': occurrence.position.firstIndex,
    } as React.CSSProperties,
    ...getDataPaletteProps(color),
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <TimelinePremium.EventPlaceholder
        render={<TimelineEventRoot />}
        aria-hidden={true}
        {...sharedProps}
      >
        <span className="LinesClamp">{occurrence.title}</span>
      </TimelinePremium.EventPlaceholder>
    );
  }

  return (
    <TimelinePremium.Event
      render={<TimelineEventRoot />}
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...sharedProps}
    >
      {isStartResizable && (
        <TimelineEventResizeHandler side="start" className="TimelineEventResizeHandler" />
      )}
      <span className="LinesClamp">{occurrence.title}</span>
      {isEndResizable && (
        <TimelineEventResizeHandler side="end" className="TimelineEventResizeHandler" />
      )}
    </TimelinePremium.Event>
  );
});
