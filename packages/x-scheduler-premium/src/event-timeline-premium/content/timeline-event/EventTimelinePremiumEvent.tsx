import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import { useStore } from '@base-ui/utils/store';
import { useId } from '@base-ui/utils/useId';
import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { EventDragPreview, getPaletteVariants } from '@mui/x-scheduler/internals';
import { EventTimelinePremiumEventProps } from './EventTimelinePremiumEvent.types';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import { eventTimelinePremiumClasses } from '../../eventTimelinePremiumClasses';

const ARROW_DEPTH = 8; // px - depth of the chevron point
const LEFT_ARROW_CLIP = `polygon(${ARROW_DEPTH}px 0, 100% 0, 100% 100%, ${ARROW_DEPTH}px 100%, 0 50%)`;
const RIGHT_ARROW_CLIP = `polygon(0 0, calc(100% - ${ARROW_DEPTH}px) 0, 100% 50%, calc(100% - ${ARROW_DEPTH}px) 100%, 0 100%)`;
const BOTH_ARROWS_CLIP = `polygon(${ARROW_DEPTH}px 0, calc(100% - ${ARROW_DEPTH}px) 0, 100% 50%, calc(100% - ${ARROW_DEPTH}px) 100%, ${ARROW_DEPTH}px 100%, 0 50%)`;
const REPEAT_ROUNDED_ICON_PATH =
  'M7 7h10v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V5H6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zm10 10H7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.31.31.85.09.85-.36V19h11c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1z';

const EventTimelinePremiumEventRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'Event',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-surface-subtle)',
  color: 'var(--event-on-surface-subtle-primary)',
  padding: theme.spacing(0.5, 1),
  position: 'relative',
  width: 'var(--width)',
  marginLeft: 'var(--x-position)',
  gridRow: 'var(--row-index, 1)',
  gridColumn: 1,
  cursor: 'pointer',
  '&[data-dragging], &[data-resizing]': {
    opacity: 0.5,
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
    '&::before': {
      background: 'var(--event-surface-selected)',
    },
  },
  [`&:hover .${eventTimelinePremiumClasses.eventResizeHandler}`]: {
    opacity: 1,
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
  '&[data-starting-before-edge]': {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    clipPath: LEFT_ARROW_CLIP,
    paddingLeft: ARROW_DEPTH + 8,
    '&::before': {
      display: 'none',
    },
  },
  '&[data-ending-after-edge]': {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    clipPath: RIGHT_ARROW_CLIP,
    paddingRight: ARROW_DEPTH + 8,
  },
  '&[data-starting-before-edge][data-ending-after-edge]': {
    clipPath: BOTH_ARROWS_CLIP,
  },
  variants: getPaletteVariants(theme),
}));

const EventTimelinePremiumEventLinesClamp = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'EventLinesClamp',
})({
  flexGrow: 1,
  minWidth: 0,
  display: '-webkit-box',
  WebkitLineClamp: 'var(--number-of-lines)',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
});

const EventTimelinePremiumEventContent = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'EventContent',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minWidth: 0,
}));

const EventTimelinePremiumEventRecurringIcon = styled(SvgIcon, {
  name: 'MuiEventTimeline',
  slot: 'EventRecurringIcon',
})({
  flexShrink: 0,
});

const EventTimelinePremiumEventResizeHandler = styled(TimelineGrid.EventResizeHandler, {
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
  const { classes } = useEventTimelinePremiumStyledContext();
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
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);

  // Feature hooks
  const id = useId(idProp);

  const sharedProps = {
    id,
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    ref: forwardedRef,
    'aria-labelledby': `${ariaLabelledBy} ${id}`,
    className: clsx(className, occurrence.className),
    style: {
      '--number-of-lines': 1,
      '--row-index': occurrence.position.firstIndex,
    } as React.CSSProperties,
    'data-palette': color,
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <TimelineGrid.EventPlaceholder
        render={<EventTimelinePremiumEventRoot />}
        aria-hidden={true}
        {...sharedProps}
        className={clsx(sharedProps.className, classes.eventPlaceholder)}
      >
        <EventTimelinePremiumEventContent className={classes.eventContent}>
          <EventTimelinePremiumEventLinesClamp className={classes.eventLinesClamp}>
            {occurrence.title}
          </EventTimelinePremiumEventLinesClamp>
          {isRecurring && (
            <EventTimelinePremiumEventRecurringIcon
              className={classes.eventRecurringIcon}
              fontSize="small"
              aria-hidden="true"
            >
              <path d={REPEAT_ROUNDED_ICON_PATH} />
            </EventTimelinePremiumEventRecurringIcon>
          )}
        </EventTimelinePremiumEventContent>
      </TimelineGrid.EventPlaceholder>
    );
  }

  return (
    <TimelineGrid.Event
      render={<EventTimelinePremiumEventRoot />}
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...sharedProps}
      className={clsx(sharedProps.className, classes.event)}
    >
      {isStartResizable && (
        <EventTimelinePremiumEventResizeHandler
          side="start"
          className={classes.eventResizeHandler}
        />
      )}
      <EventTimelinePremiumEventContent className={classes.eventContent}>
        <EventTimelinePremiumEventLinesClamp className={classes.eventLinesClamp}>
          {occurrence.title}
        </EventTimelinePremiumEventLinesClamp>
        {isRecurring && (
          <EventTimelinePremiumEventRecurringIcon
            className={classes.eventRecurringIcon}
            fontSize="small"
            aria-hidden="true"
          >
            <path d={REPEAT_ROUNDED_ICON_PATH} />
          </EventTimelinePremiumEventRecurringIcon>
        )}
      </EventTimelinePremiumEventContent>
      {isEndResizable && (
        <EventTimelinePremiumEventResizeHandler side="end" className={classes.eventResizeHandler} />
      )}
    </TimelineGrid.Event>
  );
});
