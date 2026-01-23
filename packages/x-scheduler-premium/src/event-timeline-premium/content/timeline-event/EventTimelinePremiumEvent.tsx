import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useId } from '@base-ui/utils/useId';
import { EventTimelinePremium } from '@mui/x-scheduler-headless-premium/event-timeline-premium';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { getDataPaletteProps, EventDragPreview } from '@mui/x-scheduler/internals';
import { EventTimelinePremiumEventProps } from './EventTimelinePremiumEvent.types';
import { useEventTimelinePremiumClasses } from '../../EventTimelinePremiumClassesContext';
import { eventTimelinePremiumClasses } from '../../eventTimelinePremiumClasses';

const EventTimelinePremiumEventRoot = styled('div', {
  name: 'MuiEventTimeline',
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
  [`&:hover .${eventTimelinePremiumClasses.eventResizeHandler}`]: {
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

const EventTimelinePremiumEventLinesClamp = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'EventLinesClamp',
})({
  display: '-webkit-box',
  WebkitLineClamp: 'var(--number-of-lines)',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
});

const EventTimelinePremiumEventResizeHandler = styled(EventTimelinePremium.EventResizeHandler, {
  name: 'MuiEventTimeline',
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

export const EventTimelinePremiumEvent = React.forwardRef(function EventTimelinePremiumEvent(
  props: EventTimelinePremiumEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, ariaLabelledBy, className, variant, id: idProp, style, ...other } = props;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const classes = useEventTimelinePremiumClasses();

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
    className: clsx(classes.event, className),
    style: {
      '--number-of-lines': 1,
      '--row-index': occurrence.position.firstIndex,
    } as React.CSSProperties,
    ...getDataPaletteProps(color),
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <EventTimelinePremium.EventPlaceholder
        render={<EventTimelinePremiumEventRoot />}
        aria-hidden={true}
        {...sharedProps}
      >
        <EventTimelinePremiumEventLinesClamp className={classes.eventLinesClamp}>{occurrence.title}</EventTimelinePremiumEventLinesClamp>
      </EventTimelinePremium.EventPlaceholder>
    );
  }

  return (
    <EventTimelinePremium.Event
      render={<EventTimelinePremiumEventRoot />}
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...sharedProps}
    >
      {isStartResizable && (
        <EventTimelinePremiumEventResizeHandler
          side="start"
          className={classes.eventResizeHandler}
        />
      )}
      <EventTimelinePremiumEventLinesClamp className={classes.eventLinesClamp}>{occurrence.title}</EventTimelinePremiumEventLinesClamp>
      {isEndResizable && (
        <EventTimelinePremiumEventResizeHandler
          side="end"
          className={classes.eventResizeHandler}
        />
      )}
    </EventTimelinePremium.Event>
  );
});
